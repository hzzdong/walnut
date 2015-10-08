package org.nutz.walnut.web;

import java.util.Date;

import org.nutz.lang.Each;
import org.nutz.lang.Lang;
import org.nutz.lang.Times;
import org.nutz.lang.util.Region;
import org.nutz.log.Log;
import org.nutz.log.Logs;
import org.nutz.trans.Atom;
import org.nutz.walnut.api.io.WnIo;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.api.io.WnQuery;

public class WnIoCleaner implements Atom {

    private static final Log log = Logs.get();

    private WnIo io;

    public WnIoCleaner(WnIo io) {
        this.io = io;
    }

    @Override
    public void run() {
        try {
            while (!Thread.interrupted()) {
                try {
                    __in_loop();
                }
                catch (Exception e) {
                    Throwable e2 = e.getCause();
                    if (e2 != null && e2 instanceof InterruptedException) {
                        throw (InterruptedException) e2;
                    }
                    if (log.isWarnEnabled())
                        log.warnf("something wrong!", e);
                }
                // 休息一个时间间隔
                Thread.sleep(5000);
            }
        }
        catch (InterruptedException e) {
            if (log.isInfoEnabled())
                log.info("------------------- Interrupted & quit");
        }
    }

    private void __in_loop() {
        long now = System.currentTimeMillis();
        WnQuery q = new WnQuery();
        q.setv("expi", Region.Longf("(,%d]", now));
        io.each(q, new Each<WnObj>() {
            public void invoke(int index, WnObj o, int length) {
                if (o.isExpired()) {
                    if (log.isInfoEnabled()) {
                        Date d = new Date(o.expireTime());
                        log.infof("rm expired : %s : %s", Times.sDTms2(d), o.path());
                    }
                    io.delete(o);
                    // 每删除一个对象，就休息一下
                    try {
                        Thread.sleep(1);
                    }
                    catch (InterruptedException e) {
                        throw Lang.wrapThrow(e);
                    }
                }
            }
        });
    }

}