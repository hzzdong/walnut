package org.nutz.walnut.ext.hmaker.util.com;

import org.nutz.json.Json;
import org.nutz.json.JsonFormat;
import org.nutz.lang.util.NutMap;
import org.nutz.walnut.ext.hmaker.util.HmPageTranslating;
import org.nutz.walnut.ext.hmaker.util.Hms;

public class hmc_objlist extends AbstractComHanlder {

    static class TCC {
        // 代码模板
        String itemHtml;

        // 基于这个条件进行查询
        NutMap match;

        // 需要加入的 API
        NutMap api;
    }

    @Override
    protected void _exec(HmPageTranslating ing) {
        // JS 控件的配置项目
        NutMap conf = ing.prop;

        // 生成 JS 代码片段，并计入转换上下文
        String script = String.format("$('#%s').objlist(%s);",
                                      ing.comId,
                                      Json.toJson(conf, JsonFormat.forLook().setIgnoreNull(false)));
        ing.scripts.add(Hms.wrapjQueryDocumentOnLoad(script));

        // 链接必要的外部文件
        ing.cssLinks.add("/gu/rs/ext/hmaker/hmc_objlist.css");
        ing.jsLinks.add("/gu/rs/ext/hmaker/hmc_objlist.js");
    }

}