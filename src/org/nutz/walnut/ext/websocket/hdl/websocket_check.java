package org.nutz.walnut.ext.websocket.hdl;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import org.nutz.lang.ContinueLoop;
import org.nutz.lang.Each;
import org.nutz.lang.ExitLoop;
import org.nutz.lang.Lang;
import org.nutz.lang.LoopException;
import org.nutz.lang.util.NutMap;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.api.io.WnQuery;
import org.nutz.walnut.ext.websocket.WnWebSocket;
import org.nutz.walnut.impl.box.JvmHdl;
import org.nutz.walnut.impl.box.JvmHdlContext;
import org.nutz.walnut.impl.box.WnSystem;
import org.nutz.walnut.util.ZParams;

public class websocket_check implements JvmHdl {

    public void invoke(WnSystem sys, JvmHdlContext hc) {
        ZParams params = ZParams.parse(hc.args, "y");
        boolean doIt = params.is("y");
        WnQuery q = new WnQuery();
        q.setv(WnWebSocket.KEY, new NutMap("$exists", true));
        List<String> toRemove = new ArrayList<>();
        int[] count = new int[1];
        sys.io.each(q, (index, ele, len)->{
            Object tmp = ele.get(WnWebSocket.KEY);
            if (tmp == null) {
                return;
            }
            if (tmp instanceof String) {
                sys.out.printlnf("%s - string - %s", ele.path(), tmp);
                if (doIt)
                    toRemove.add(ele.id());
                count[0]++;
            } else if (tmp.getClass().isArray() || tmp instanceof Collection) {
                Lang.each(tmp, (index2, ele2, len2)->{
                    String wsid = String.valueOf(ele2);
                    if (WnWebSocket.get(wsid) == null) {
                        sys.out.printlnf("%s - array - %s", ele.path(), wsid);
                        if (doIt)
                            sys.io.pull(ele.id(), WnWebSocket.KEY, wsid, false);
                        count[0]++;
                    }
                });
            }
        });
    }

}