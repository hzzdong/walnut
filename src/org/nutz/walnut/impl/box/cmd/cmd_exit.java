package org.nutz.walnut.impl.box.cmd;

import org.nutz.json.JsonFormat;
import org.nutz.lang.Lang;
import org.nutz.walnut.api.usr.WnSession;
import org.nutz.walnut.impl.box.JvmExecutor;
import org.nutz.walnut.impl.box.WnSystem;
import org.nutz.walnut.impl.io.WnEvalLink;
import org.nutz.walnut.util.Wn;

public class cmd_exit extends JvmExecutor {

    @Override
    public void exec(final WnSystem sys, String[] args) throws Exception {
        Wn.WC().security(new WnEvalLink(sys.io), () -> {
            __exec_without_security(sys);
        });
    }

    private void __exec_without_security(final WnSystem sys) {
        // 退出登录
        WnSession newSe = sys.sessionService.logout(sys.se.id());

        // 输出这个新会话
        if (null != newSe) {
            JsonFormat jfmt = JsonFormat.nice().setQuoteName(true).setIgnoreNull(true);
            String json = newSe.toJson(jfmt);
            sys.out.println(json);
        }

        // ............................................
        // 在沙盒的上下文标记一把
        if (null != newSe) {
            sys.attrs().put(Wn.MACRO.CHANGE_SESSION, Lang.mapf("seid:'%s',exit:true", newSe.id()));
        } else {
            sys.attrs().put(Wn.MACRO.CHANGE_SESSION, "{}");
        }
    }

}
