package org.nutz.walnut.util;

import java.io.OutputStream;

import org.nutz.walnut.api.box.WnTurnnel;

public class JTOutputStream extends OutputStream {

    private WnTurnnel tnl;

    public JTOutputStream(WnTurnnel turnnel) {
        this.tnl = turnnel;
    }

    @Override
    public void write(int b) {
        tnl.write((byte) b);
    }

    @Override
    public void write(byte[] bs, int off, int len) {
        tnl.write(bs, off, len);
    }

    @Override
    public void close() {
        tnl.closeWrite();
    }

}
