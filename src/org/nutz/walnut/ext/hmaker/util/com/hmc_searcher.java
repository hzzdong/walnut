package org.nutz.walnut.ext.hmaker.util.com;

import org.jsoup.nodes.Element;
import org.nutz.json.Json;
import org.nutz.json.JsonFormat;
import org.nutz.walnut.ext.hmaker.util.HmPageTranslating;
import org.nutz.walnut.ext.hmaker.util.Hms;

public class hmc_searcher extends AbstractSimpleCom {

    @Override
    protected String getArenaClassName() {
        return "hmc-searcher";
    }

    @Override
    protected boolean doArena(HmPageTranslating ing, Element eleArena) {
        ing.eleCom.attr("wn-rt-jq-fn", "hmc_searcher");
        ing.eleCom.attr("wn-rt-jq-selector", ">.hmc-searcher");
        // ...........................................
        // 确保页面输出是 wnml
        ing.markPageAsWnml();

        // ...........................................
        // 链入控件的 jQuery 插件
        ing.jsLinks.add("/gu/rs/ext/hmaker/hmc_searcher.js");
        String script = String.format("$('#%s > .hmc-searcher').hmc_searcher(%s);",
                                      ing.comId,
                                      Json.toJson(ing.propCom,
                                                  JsonFormat.forLook().setIgnoreNull(false)));
        ing.scripts.add(Hms.wrapjQueryDocumentOnLoad(script));

        return true;
    }

}
