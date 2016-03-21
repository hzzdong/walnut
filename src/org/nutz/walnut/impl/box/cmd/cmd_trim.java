package org.nutz.walnut.impl.box.cmd;

import org.nutz.lang.Strings;
import org.nutz.walnut.impl.box.JvmExecutor;
import org.nutz.walnut.impl.box.WnSystem;
import org.nutz.walnut.util.ZParams;

public class cmd_trim extends JvmExecutor {

    @Override
    public void exec(WnSystem sys, String[] args) throws Exception {
        if (sys.pipeId > 0) {
            ZParams params = ZParams.parse(args, "lr");

            String str = sys.in.readAll();

            // 左侧
            if (params.is("l")) {
                sys.out.print(Strings.trimLeft(str));
            }
            // 右侧
            else if (params.is("r")) {
                sys.out.print(Strings.trimRight(str));
            }
            // 全部
            else {
                sys.out.print(Strings.trim(str));
            }
        }
    }

}
