package org.nutz.walnut.ext.thing.hdl;

import org.nutz.lang.Strings;
import org.nutz.lang.util.NutMap;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.api.io.WnRace;
import org.nutz.walnut.ext.thing.Things;
import org.nutz.walnut.impl.box.JvmHdl;
import org.nutz.walnut.impl.box.JvmHdlContext;
import org.nutz.walnut.impl.box.JvmHdlParamArgs;
import org.nutz.walnut.impl.box.WnSystem;

@JvmHdlParamArgs("cnqihbslVNHQ")
public class thing_create implements JvmHdl {

    @Override
    public void invoke(WnSystem sys, JvmHdlContext hc) {
        // 找到集合
        WnObj oTS = Things.checkThingSet(hc.oRefer);

        // 找到索引
        WnObj oIndex = Things.dirTsIndex(sys, hc);

        // 创建一个 Thing
        WnObj oT = sys.io.create(oIndex, "${id}", WnRace.FILE);

        // 准备要更新的元数据集合
        NutMap meta = Things.fillMeta(sys, hc.params);

        // 名称
        String th_nm = hc.params.val(0);
        if (!Strings.isBlank(th_nm)) {
            meta.put("th_nm", th_nm);
        }

        // 设置更多的固有属性
        meta.put("tp", "th_index");
        meta.put("th_set", oTS.id());
        meta.put("th_live", Things.TH_LIVE);

        // 默认的内容类型
        if (!meta.has("mime"))
            meta.put("mime", "text/plain");

        // 图标
        if (!meta.has("icon"))
            meta.put("icon", oTS.get("th_icon"));

        // 缩略图
        if (!meta.has("thumb"))
            meta.put("thumb", oTS.get("th_thumb"));

        // 更新这个 Thing
        sys.io.appendMeta(oT, meta);

        // 记录到输出里
        hc.output = oT;
    }

}
