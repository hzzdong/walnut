package org.nutz.walnut.ext.hmaker.hdl;

import org.nutz.lang.Files;
import org.nutz.lang.Stopwatch;
import org.nutz.lang.Strings;
import org.nutz.lang.util.Callback;
import org.nutz.log.Log;
import org.nutz.walnut.api.err.Er;
import org.nutz.walnut.api.io.WalkMode;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.ext.hmaker.util.HmContext;
import org.nutz.walnut.ext.hmaker.util.HmPageTranslating;
import org.nutz.walnut.impl.box.JvmHdl;
import org.nutz.walnut.impl.box.JvmHdlContext;
import org.nutz.walnut.impl.box.JvmHdlParamArgs;
import org.nutz.walnut.impl.box.WnSystem;
import org.nutz.walnut.util.Wn;

@JvmHdlParamArgs("^(quiet|debug|info|warn)$")
public class hmaker_publish implements JvmHdl {

    @Override
    public void invoke(WnSystem sys, JvmHdlContext hc) {
        // 上下文
        final HmContext hpc = new HmContext(sys.io);
        hpc.strict = !hc.params.is("quiet");
        hpc.oConfHome = Wn.checkObj(sys, "~/.hmaker");

        // 得到源
        hpc.oHome = Wn.checkObj(sys, hc.params.val_check(0));

        // 得到目标
        String dst = hc.params.val(1);
        // 没有的话，尝试读取源的目标设置
        if (Strings.isBlank(dst)) {
            dst = hpc.oHome.getString("hm_target_release");
        }
        // 还没有!!! 不能忍受，抛错吧
        if (Strings.isBlank(dst)) {
            throw Er.create("cmd.hmaker.publish.nodest");
        }
        hpc.oDest = Wn.checkObj(sys, dst);

        // 源和目标不能相互包含
        if (hpc.oHome.path().startsWith(hpc.oDest.path())
            || hpc.oDest.path().startsWith(hpc.oHome.path())) {
            throw Er.create("e.cmd.hmaker.twine");
        }

        // 如果限定了源
        WnObj oSrc = hpc.oHome;
        if (hc.params.has("src")) {
            oSrc = Wn.checkObj(sys, hc.params.get("src"));
            // 确保给定的 site 是 src 的父目录
            if (!oSrc.path().startsWith(hpc.oHome.path())) {
                throw Er.create("e.cmd.hmaker.siteNoIncludeSrc", hpc.oHome + " :: " + oSrc);
            }
        }

        // 准备日志输出接口
        Log log = sys.getLog(hc.params);
        Stopwatch sw = Stopwatch.begin();

        // 准备文件处理逻辑
        Callback<WnObj> callback = new Callback<WnObj>() {
            public void invoke(WnObj o) {
                // 根据扩展名判断
                String suffixName = Strings.sNull(Files.getSuffixName(o.path()), "").toLowerCase();

                // 如果是网页，转换
                if (suffixName.matches("^html?$")) {
                    log.debug(" read: " + o.name());
                    WnObj oTa = new HmPageTranslating(hpc).translate(o);
                    log.info("   > trans ->: " + oTa.path());
                }
                // 其他: copy
                else {
                    hpc.resources.add(o);
                }
            }
        };

        // 仅仅处理的是一个文件
        if (oSrc.isFILE()) {
            log.info("do file:");
            callback.invoke(oSrc);
        }
        // 要处理的是一个目录
        else {
            log.info("walk in folder:");
            sys.io.walk(oSrc, callback, WalkMode.LEAF_ONLY);
        }

        // 最后处理所有依赖的资源: copy 它们
        if (hpc.resources.size() > 0) {
            log.infof("copy %d resources:", hpc.resources.size());

            for (WnObj o : hpc.resources) {
                // 在目标处创建
                WnObj oTa = hpc.createTarget(o);

                // 执行内容的 copy
                Wn.Io.copyFile(sys.io, o, oTa);

                log.infof("  ++ %s", oTa.path());
            }
        }
        // 没有需要 copy 的资源，啥也不做
        else {
            log.info("- no resource need to be copy -");
        }

        // 全部输出完成
        sw.stop();
        log.infof("All done in %dms", sw.getDuration());

    }

}
