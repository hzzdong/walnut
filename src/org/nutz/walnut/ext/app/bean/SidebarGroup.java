package org.nutz.walnut.ext.app.bean;

import java.util.List;

import org.nutz.lang.Strings;

public class SidebarGroup {

    private String title;

    private List<SidebarItem> items;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public List<SidebarItem> getItems() {
        return items;
    }

    public void setItems(List<SidebarItem> items) {
        this.items = items;
    }

    public String toHtml() {
        StringBuilder sb = new StringBuilder();
        sb.append("<section>");
        if (!Strings.isBlank(title)) {
            sb.append("\n    <h1>").append(Strings.escapeHtml(title)).append("</h1>");
        }
        for (SidebarItem si : items)
            si.joinHtml(sb);
        sb.append("\n</section>");
        return sb.toString();
    }

}
