package org.nutz.walnut.ext.httpapi;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Enumeration;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.nutz.ioc.loader.annotation.IocBean;
import org.nutz.lang.Lang;
import org.nutz.lang.Streams;
import org.nutz.lang.Strings;
import org.nutz.lang.tmpl.Tmpl;
import org.nutz.lang.util.NutMap;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.mvc.annotation.At;
import org.nutz.mvc.annotation.By;
import org.nutz.mvc.annotation.Fail;
import org.nutz.mvc.annotation.Filters;
import org.nutz.mvc.annotation.Ok;
import org.nutz.mvc.view.HttpServerResponse;
import org.nutz.trans.Proton;
import org.nutz.walnut.api.box.WnBox;
import org.nutz.walnut.api.box.WnBoxContext;
import org.nutz.walnut.api.err.Er;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.api.io.WnRace;
import org.nutz.walnut.api.usr.WnSession;
import org.nutz.walnut.api.usr.WnUsr;
import org.nutz.walnut.util.Wn;
import org.nutz.walnut.util.WnContext;
import org.nutz.walnut.web.filter.WnAsUsr;
import org.nutz.walnut.web.module.AbstractWnModule;
import org.nutz.walnut.web.module.AppRespOutputStreamWrapper;
import org.nutz.walnut.web.module.HttpRespStatusSetter;
import org.nutz.walnut.web.util.WnWeb;

@IocBean
@At("/api")
@Filters(@By(type = WnAsUsr.class, args = {"root", "root"}))
public class HttpApiModule extends AbstractWnModule {

    private static final Log log = Logs.get();

    @At("/?/**")
    @Ok("void")
    @Fail("void")
    public void do_api(String usr,
                       String api,
                       final HttpServletRequest req,
                       final HttpServletResponse resp)
            throws IOException {
        final WnUsr u;
        final WnObj oHome;
        final WnObj oApi;
        int respCode = 500;
        // 找到用户和对应的命令
        try {
            if (log.isInfoEnabled())
                log.infof("httpAPI(%s): /%s/%s", Lang.getIP(req), usr, api);

            // 得到用户和主目录
            u = usrs.check(usr);
            String homePath = Strings.sBlank(u.home(), "/home/" + u.name());
            oHome = io.check(null, homePath);

            // 找到 API 对象
            oApi = io.fetch(oHome, Wn.appendPath(".regapi/api", api));

            // 如果没有这个 API 文件，就 404 吧
            if (null == oApi) {
                respCode = 404;
                throw Er.create("e.api.nofound", api);
            }

            // 将当前线程切换到指定的用户
            WnContext wc = Wn.WC();
            wc.me("root", "root");
            WnSession se = sess.create(u);
            wc.SE(se);

            // 如果 API 文件声明了需要 copy 的 cookie 到线程上下文 ...
            String[] copyCookieNames = oApi.getAs("copy-cookie", String[].class);
            if (null != copyCookieNames && copyCookieNames.length > 0) {
                wc.copyCookieItems(req, copyCookieNames);
            }

            // 准备临时目录
            final WnObj oTmp = Wn.WC().su(u, new Proton<WnObj>() {
                protected WnObj exec() {
                    return io.createIfNoExists(oHome, ".regapi/tmp", WnRace.DIR);
                }
            });

            // 生成请求对象
            WnObj oReq = __gen_req_obj(req, u, oApi, oTmp);

            // 执行 API 文件
            try {
                _do_api(oReq, resp, oHome, se, u, oApi);
            }
            // 确保退出登录
            finally {
                sess.logout(se.id());
                wc.SE(null);
            }
        }
        catch (Exception e) {
            if (log.isWarnEnabled()) {
                log.warn("Fail to handle API", e);
            }
            resp.setStatus(respCode);
            e.printStackTrace(resp.getWriter());
            resp.flushBuffer();
            return;
        }

    }

    private void _do_api(WnObj oReq,
                         HttpServletResponse resp,
                         final WnObj oHome,
                         WnSession se,
                         WnUsr u,
                         WnObj oApi)
            throws IOException {

        // 记录是否客户端设定了响应的 ContentType
        String mimeType = oReq.getString("http-qs-mime");

        // 解析命令
        String cmdPattern = io.readText(oApi);
        String cmdText = Tmpl.exec(cmdPattern, oReq);

        // 如果是 API 的执行是自动决定的文本
        if (oApi.getBoolean("http-dynamic-header")) {
            this.__setup_resp_header(oApi, oReq, mimeType, resp);

            String html = this.exec("box", se, null, cmdText);

            HttpServerResponse hsr = new HttpServerResponse();
            hsr.updateBy(html);

            hsr.render(resp);
            return;
        }

        // 根据返回码决定怎么处理
        int respCode = oApi.getInt("http-resp-code", 200);

        // 重定向
        if (respCode == 301 || respCode == 302) {
            _do_redirect(resp, cmdText, se, u);
        }
        // 肯定要写入返回流
        else {
            _do_run_box(oApi, oReq, mimeType, resp, cmdText, se, u);
        }
    }

    private WnObj __gen_req_obj(HttpServletRequest req, WnUsr u, WnObj oApi, final WnObj oTmp)
            throws UnsupportedEncodingException, IOException {
        // 创建临时文件以便保存请求的内容
        WnObj oReq = Wn.WC().su(u, new Proton<WnObj>() {
            protected WnObj exec() {
                return io.create(oTmp, "${id}", WnRace.FILE);
            }
        });
        Enumeration<String> hnms = req.getHeaderNames();
        NutMap map = new NutMap();

        // 保存 http 参数
        map.setv("http-usr", u.name()).setv("http-api", oApi.name());

        map.setv("http-protocol", req.getProtocol().toUpperCase());
        map.setv("http-method", req.getMethod().toUpperCase());
        map.setv("http-uri", req.getRequestURI());
        map.setv("http-url", req.getRequestURL());
        map.setv("http-remote-addr", req.getRemoteAddr());
        map.setv("http-remote-host", req.getRemoteHost());
        map.setv("http-remote-port", req.getRemotePort());

        // 保存 QueryString，同时，看看有没必要更改 mime-type
        String qs = req.getQueryString();
        map.setv("http-qs", qs);
        if (!Strings.isBlank(qs)) {
            // 解码
            qs = URLDecoder.decode(qs, "UTF-8");
            // 分析每个请求参数
            String[] ss = Strings.splitIgnoreBlank(qs, "[&]");
            for (String s : ss) {
                int pos = s.indexOf('=');
                // 有值
                if (pos > 0) {
                    String nm = s.substring(0, pos);
                    String val = s.substring(pos + 1);
                    map.setv("http-qs-" + nm, val);
                }
                // 没值的用空串表示
                else {
                    map.setv("http-qs-" + s, "");
                }
            }
        }

        // 保存请求头
        while (hnms.hasMoreElements()) {
            String hnm = hnms.nextElement();
            String hval = req.getHeader(hnm);
            map.setv("http-header-" + hnm.toUpperCase(), hval);
        }

        // 更新头信息
        io.appendMeta(oReq, map);

        // 保存请求体
        InputStream ins = req.getInputStream();
        OutputStream ops = io.getOutputStream(oReq, 0);
        Streams.writeAndClose(ops, ins);

        // 将请求的对象设置一下清除标志（缓存 30 分钟)
        oReq.expireTime(System.currentTimeMillis() + 1800000L);
        io.set(oReq, "^expi$");
        return oReq;
    }

    private void _do_redirect(HttpServletResponse resp, String cmdText, WnSession se, WnUsr u)
            throws IOException {
        StringBuilder sbOut = new StringBuilder();
        StringBuilder sbErr = new StringBuilder();
        OutputStream out = Lang.ops(sbOut);
        OutputStream err = Lang.ops(sbErr);

        this.exec("apiR", se, cmdText, out, err, null, null);

        // 处理出错了
        if (sbErr.length() > 0) {
            resp.sendError(500, sbErr.toString());
        }
        // 正常的重定向
        else {
            resp.sendRedirect(sbOut.toString());
        }
    }

    private static final Pattern P = Pattern.compile("^(attachment; *filename=\")(.+)(\")$");

    private void _do_run_box(WnObj oApi,
                             WnObj oReq,
                             String mimeType,
                             HttpServletResponse resp,
                             String cmdText,
                             WnSession se,
                             WnUsr u)
            throws UnsupportedEncodingException {
        // 执行命令
        WnBox box = boxes.alloc(0);

        if (log.isDebugEnabled())
            log.debugf("box:alloc: %s", box.id());

        // 设置沙箱
        WnBoxContext bc = new WnBoxContext(new NutMap());
        bc.io = io;
        bc.me = u;
        bc.session = se;
        bc.usrService = usrs;
        bc.sessionService = sess;

        if (log.isDebugEnabled())
            log.debugf("box:setup: %s", bc);
        box.setup(bc);

        // 根据请求，设置响应的头
        __setup_resp_header(oApi, oReq, mimeType, resp);

        // 准备回调
        if (log.isDebugEnabled())
            log.debug("box:set stdin/out/err");

        HttpRespStatusSetter _resp = new HttpRespStatusSetter(resp);
        OutputStream out = new AppRespOutputStreamWrapper(_resp, 200);
        OutputStream err = new AppRespOutputStreamWrapper(_resp, 500);

        box.setStdin(null); // HTTP GET 方式，不支持沙箱的 stdin
        box.setStdout(out);
        box.setStderr(err);

        // 运行
        if (log.isDebugEnabled())
            log.debugf("box:run: %s", cmdText);
        box.run(cmdText);

        // 释放沙箱
        if (log.isDebugEnabled())
            log.debugf("box:free: %s", box.id());
        boxes.free(box);

        if (log.isDebugEnabled())
            log.debug("box:done");
    }

    private String __setup_resp_header(WnObj oApi,
                                       WnObj oReq,
                                       String mimeType,
                                       HttpServletResponse resp) {
        // 设置响应头，并看看是否指定了 content-type
        for (String key : oApi.keySet()) {
            if (key.startsWith("http-header-")) {
                String nm = key.substring("http-header-".length()).toUpperCase();
                String val = Strings.trim(oApi.getString(key));
                val = Tmpl.exec(val, oReq);
                // 指定了响应内容
                if (nm.equals("CONTENT-TYPE")) {
                    mimeType = val;
                }
                // 指定了下载目标
                else if (nm.equals("CONTENT-DISPOSITION")) {
                    Matcher m = P.matcher(val);
                    String fnm;
                    if (m.find()) {
                        fnm = m.group(2);
                    } else {
                        fnm = val;
                    }
                    String ua = oReq.getString("http-header-USER-AGENT", "");
                    WnWeb.setHttpRespHeaderContentDisposition(resp, fnm, ua);
                }
                // 其他头，添加
                else {
                    resp.setHeader(nm, val);
                }
            }
        }

        // 最后设定响应内容
        mimeType = Strings.sBlank(mimeType, "text/html");
        resp.setContentType(mimeType);

        // 返回最后更新的 mimeType
        return mimeType;
    }

}
