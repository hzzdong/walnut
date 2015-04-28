package org.nutz.walnut;

import org.nutz.ioc.impl.PropertiesProxy;
import org.nutz.lang.Mirror;
import org.nutz.walnut.api.io.MimeMap;
import org.nutz.walnut.api.io.WnIo;
import org.nutz.walnut.impl.MimeMapImpl;
import org.nutz.walnut.impl.WnIoImpl;

public abstract class WnIoTest extends WnStoreTest {

    protected WnIo io;

    protected void on_before(PropertiesProxy pp) {
        super.on_before(pp);

        io = new WnIoImpl();
        Mirror.me(io).setValue(io, "tree", tree);
        Mirror.me(io).setValue(io, "indexer", indexer);
        Mirror.me(io).setValue(io, "stores", storeFactory);

        PropertiesProxy ppMime = new PropertiesProxy(pp.check("mime"));
        MimeMap mimes = new MimeMapImpl(ppMime);
        Mirror.me(io).setValue(io, "mimes", mimes);
    }

}
