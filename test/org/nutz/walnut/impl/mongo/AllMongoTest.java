package org.nutz.walnut.impl.mongo;

import org.junit.runner.RunWith;
import org.junit.runners.Suite;

@RunWith(Suite.class)
@Suite.SuiteClasses({MongoWnTreeTest.class, MongoWnIoTest.class, MongoWnIndexerTest.class})
public class AllMongoTest {}
