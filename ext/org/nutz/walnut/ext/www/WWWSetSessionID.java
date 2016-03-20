package org.nutz.walnut.ext.www;

import javax.servlet.http.HttpServletRequest;

import org.nutz.lang.Lang;
import org.nutz.mvc.ActionContext;
import org.nutz.mvc.ActionFilter;
import org.nutz.mvc.View;
import org.nutz.walnut.util.Wn;

/**
 * 将 Cookie 里的 DSEID 设置到线程上下文
 * 
 * @author zozoh(zozohtnt@gmail.com)
 */
public class WWWSetSessionID implements ActionFilter {

    @Override
    public View match(ActionContext ac) {

        HttpServletRequest req = ac.getRequest();

        // 获取 Session
        Wn.WC().copyCookieItems(req, Lang.array(WWW.AT_SEID));

        // 继续下面的操作
        return null;
    }

}
