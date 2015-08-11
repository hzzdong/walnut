package org.nutz.walnut.impl.box;

import static org.junit.Assert.assertEquals;

import org.junit.Test;
import org.nutz.lang.Lang;
import org.nutz.walnut.BaseBoxTest;
import org.nutz.walnut.api.io.WnObj;

public class JvmBoxTest extends BaseBoxTest {

    @Test
    public void test_append_redirect() {
        box.run("echo 'hello' >> ~/abc.txt");
        WnObj o = io.check(null, me.home() + "/abc.txt");
        String txt = io.readText(o);
        assertEquals("hello\n", txt);
    }

    @Test
    public void test_simple_grap() {
        box.run("echo -e 'a\\nbc\\nc\\nd' | grep c");

        assertEquals("bc\nc\n", outs());
    }

    @Test
    public void test_simple_pipe() {
        box.run("output -delay 500 'hello' | md5sum");

        assertEquals(Lang.md5("hello\n"), touts());
    }

    @Test
    public void test_echo_newline() {
        box.run("echo -en 'a\\nb'");

        assertEquals("a\nb", outs());
    }

    @Test
    public void test_echo_hello2() {
        box.run("echo 'hello' 'world'");

        assertEquals("hello world\n", outs());
    }

    @Test
    public void test_echo_hello() {
        box.run("echo 'hello'");

        assertEquals("hello\n", outs());
    }

}