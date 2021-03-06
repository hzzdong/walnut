package org.nutz.walnut.api.box;

import org.nutz.lang.util.NutMap;
import org.nutz.walnut.api.io.WnIo;
import org.nutz.walnut.api.usr.WnSession;
import org.nutz.walnut.api.usr.WnSessionService;
import org.nutz.walnut.api.usr.WnUsr;
import org.nutz.walnut.api.usr.WnUsrService;

public class WnBoxContext {

    public WnUsr me;

    public WnSession session;

    public WnIo io;

    public WnSessionService sessionService;

    public WnUsrService usrService;

    public NutMap attrs;

    public WnBoxContext(NutMap attrs) {
        this.attrs = attrs;
    }

    public WnBoxContext clone() {
        WnBoxContext bc = new WnBoxContext(new NutMap());
        bc.me = this.me;
        bc.session = this.session;
        bc.io = this.io;
        bc.sessionService = this.sessionService;
        bc.usrService = this.usrService;
        bc.attrs.putAll(this.attrs);
        return bc;
    }

}
