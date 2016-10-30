package org.nutz.walnut.api.io;

public interface WnSecurity {

    WnObj enter(WnObj nd, boolean asNull);

    WnObj access(WnObj nd, boolean asNull);

    WnObj read(WnObj nd, boolean asNull);

    WnObj write(WnObj nd, boolean asNull);

    WnObj meta(WnObj nd, boolean asNull);

    WnObj remove(WnObj nd, boolean asNull);

    boolean test(WnObj nd, int mode);

}
