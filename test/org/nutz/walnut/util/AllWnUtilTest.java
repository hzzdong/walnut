package org.nutz.walnut.util;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({CmdsTest.class,
                     WnTest.class,
                     WnRgTest.class,
                     ZParamsTest.class,
                     JvmTunnelTest.class})
public class AllWnUtilTest {}
