package org.nutz.walnut;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;
import org.nutz.walnut.impl.AllImplTest;
import org.nutz.walnut.util.AllWnUtilTest;

@RunWith(Suite.class)
@Suite.SuiteClasses({AllWnUtilTest.class, AllImplTest.class})
public class WnTestAll {}
