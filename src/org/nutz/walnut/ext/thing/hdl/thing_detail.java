package org.nutz.walnut.ext.thing.hdl;

import org.nutz.lang.Strings;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.ext.thing.Things;
import org.nutz.walnut.impl.box.JvmHdl;
import org.nutz.walnut.impl.box.JvmHdlContext;
import org.nutz.walnut.impl.box.JvmHdlParamArgs;
import org.nutz.walnut.impl.box.WnSystem;
import org.nutz.walnut.util.Cmds;

@JvmHdlParamArgs(value = "cnqihbslVNHQ", regex = "^(drop)$")
public class thing_detail implements JvmHdl {

    @Override
    public void invoke(WnSystem sys, JvmHdlContext hc) {
        // 得到对应对 Thing
        WnObj oT = Things.checkThIndex(sys, hc);

        // 清除详情
        if (hc.params.is("drop")) {
            // 情况 detail
            sys.io.writeText(oT, "");

            // 设置 thing 元数据
            oT.setv("th_detail_tp", null);
            oT.setv("th_detail_sz", 0);
            sys.io.set(oT, "^th_detail_.+$");

            // 输出被清空的 detail 对象
            hc.output = oT;
        }
        // 创建或者修改
        else if (hc.params.has("content")) {
            // 根据类型修改内容类型
            if (hc.params.has("tp")) {
                String tp = hc.params.get("tp", "txt");
                String mime = sys.io.mimes().getMime(tp, "text/plain");
                if (!oT.isMime(mime)) {
                    sys.io.set(oT.mime(mime), "^(mime)$");
                }
            }
            // 直接修改内容蕾西
            else if (hc.params.has("mime")) {
                String mime = hc.params.get("mime");
                if (!oT.isMime(mime)) {
                    sys.io.set(oT.mime(mime), "^(mime)$");
                }
            }

            // 写入内容
            String content = Cmds.getParamOrPipe(sys, hc.params, "content", false);
            sys.io.writeText(oT, content);

            // 得到摘要
            String brief = hc.params.get("brief");

            // 指定了摘要
            if (!Strings.isBlank(brief)) {
                // 自动摘要 TODO 根据内容类型设计不同的摘要算法
                if ("true".equals(brief)) {
                    brief = content.substring(0, Math.min(content.length(), 256));
                }

                // 设置 thing 元数据
                oT.setv("brief", brief);
                sys.io.set(oT, "^brief$");
            }

            // 输出 detail 对象
            hc.output = oT;
        }
        // 输出 detail 对象的内容
        else {
            hc.output = sys.io.readText(oT);
        }
    }

}
