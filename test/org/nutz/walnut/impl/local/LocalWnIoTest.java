package org.nutz.walnut.impl.local;

import org.nutz.walnut.WnTUs;
import org.nutz.walnut.api.io.AbstractWnIoTest;
import org.nutz.walnut.api.io.WnNode;

public class LocalWnIoTest extends AbstractWnIoTest {

    @Override
    protected WnNode _create_top_tree_node() {
        return WnTUs.create_tree_node(pp, "mnt-local-a");
    }

    @Override
    protected String getAnotherTreeMount() {
        return pp.check("mnt-mongo-a");
    }
}
