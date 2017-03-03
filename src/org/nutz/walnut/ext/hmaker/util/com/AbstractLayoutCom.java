package org.nutz.walnut.ext.hmaker.util.com;

import org.jsoup.nodes.Element;
import org.nutz.walnut.ext.hmaker.util.HmPageTranslating;

public abstract class AbstractLayoutCom extends AbstractCom {

    @Override
    protected void _exec(HmPageTranslating ing) {
        ing.addMyRule(null, ing.cssEle);
        ing.addMyRule("." + this.getArenaClassName(), ing.cssArena);
    }
    
    @Override
    public boolean isDynamic(Element eleCom) {
        return false;
    }

}
