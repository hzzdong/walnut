package org.nutz.walnut.ext.hmaker.util.com;

import org.nutz.walnut.ext.hmaker.util.HmPageTranslating;

public class hmc_sorter extends AbstractCom {

    @Override
    protected void _exec(HmPageTranslating ing) {
        ing.eleCom.child(0).child(0).unwrap();
        ing.eleCom.child(0).unwrap();
        ing.eleCom.addClass("hmc-sorter hmc-cnd");
    }

}
