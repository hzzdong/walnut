package org.nutz.walnut.impl;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.nutz.lang.Lang;
import org.nutz.lang.Strings;
import org.nutz.lang.util.NutMap;
import org.nutz.walnut.api.err.Er;
import org.nutz.walnut.api.io.WnNode;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.api.io.WnRace;
import org.nutz.walnut.api.io.WnTree;
import org.nutz.walnut.util.Wn;

public class WnBean extends NutMap implements WnObj {

    public WnBean() {}

    public WnBean(WnBean o) {
        this.putAll(o);
        if (null != o._nd)
            this.setNode(o._nd.duplicate());
    }

    private WnNode _nd;

    public WnNode nd() {
        return _nd;
    }

    public WnObj setNode(WnNode nd) {
        // 如果已经设置了 ID, 那么必须一致
        String id = id();
        if (!Strings.isBlank(id)) {
            if (!nd.isSameId(id)) {
                throw Er.create("e.io.obj.nd.NoSameId", id + " != " + nd.id());
            }
        } else {
            id(nd.id());
        }

        // 设置节点
        this._nd = nd;

        // 更新其他字段用作冗余记录
        this.setv("nm", nd.name());
        this.setv("ph", nd.path());
        this.setv("race", nd.race());
        this.setv("pid", nd.parentId());
        this.setv("mnt", nd.tree().getMount());

        // 返回
        return this;
    }

    public NutMap toMap4Update(String regex) {
        NutMap map = new NutMap();
        if (Strings.isBlank(regex)) {
            map.putAll(this);
        } else {
            for (Map.Entry<String, Object> en : this.entrySet()) {
                String key = en.getKey();
                // 如果 regex 为空，只要不是 id 就全要
                if (null == regex && !"id".equals(key)) {
                    map.put(key, en.getValue());
                }
                // 否则只给出正则表达式匹配的部分，以及几个固定需要更新的字段
                else if (key.matches("^nm|race|pid|mnt$") || key.matches(regex)) {
                    map.put(key, en.getValue());
                }
            }
        }
        return map;
    }

    public String id() {
        return getString("id");
    }

    public WnNode id(String id) {
        // 如果已经设置了 Node，那么必须一致
        WnNode nd = nd();
        if (null != nd) {
            if (!nd.isSameId(id)) {
                throw Er.create("e.io.obj.id.NoSameId", id + " != " + nd.id());
            }
        }
        setv("id", id);
        return this;
    }

    public boolean hasID() {
        return !Strings.isBlank(id());
    }

    public boolean isSameId(WnNode o) {
        return o.isSameId(id());
    }

    public boolean isSameId(String id) {
        return id().equals(id);
    }

    public WnNode genID() {
        throw Er.create("e.io.obj.forbiden.genid");
    }

    public String checkString(String key) {
        String str = getString(key);
        if (null == str)
            throw Er.create("e.io.obj.nokey", key);
        return str;
    }

    public boolean isSameId(WnObj o) {
        return isSameId(o.id());
    }

    public WnBean parentId(String pid) {
        this.setv("pid", pid);
        return this;
    }

    public String link() {
        return this.getString("ln");
    }

    public WnBean link(String lid) {
        this.setOrRemove("ln", lid);
        return this;
    }

    public boolean isType(String tp) {
        String mytp = type();
        if (null == mytp)
            return null == tp;
        if (null == tp)
            return false;
        return mytp.equals(tp);
    }

    public String type() {
        return this.getString("tp");
    }

    public WnBean type(String tp) {
        this.setOrRemove("tp", tp);
        return this;
    }

    public String mime() {
        return this.getString("mime");
    }

    public WnBean mime(String mime) {
        this.setOrRemove("mime", mime);
        return this;
    }

    public boolean hasSha1() {
        return !Strings.isBlank(sha1());
    }

    public String sha1() {
        return this.getString("sha1");
    }

    public WnBean sha1(String sha1) {
        this.setv("sha1", sha1);
        return this;
    }

    public boolean isSameSha1(String sha1) {
        if (null == sha1)
            return false;
        String mySha1 = sha1();
        if (null == mySha1)
            return false;
        return mySha1.equals(sha1);
    }

    public boolean hasData() {
        return !Strings.isBlank(data());
    }

    public String data() {
        return this.getString("data");
    }

    public WnBean data(String data) {
        this.setv("data", data);
        return this;
    }

    public boolean isSameData(String data) {
        if (null == data)
            return false;
        String myData = data();
        if (null == myData)
            return false;
        return myData.equals(data);
    }

    public long len() {
        return this.getLong("len", 0);
    }

    public WnBean len(long len) {
        this.put("len", len);
        return this;
    }

    public int remain() {
        return this.getInt("remain");
    }

    public WnBean remain(int remain) {
        this.put("remain", remain);
        return this;
    }

    public String creator() {
        return this.getString("c");
    }

    public WnBean creator(String creator) {
        this.setOrRemove("c", creator);
        return this;
    }

    public String mender() {
        return this.getString("m");
    }

    public WnBean mender(String mender) {
        this.setOrRemove("m", mender);
        return this;
    }

    public String group() {
        return this.getString("g");
    }

    public WnBean group(String grp) {
        this.setOrRemove("g", grp);
        return this;
    }

    public int mode() {
        return this.getInt("md");
    }

    public WnBean mode(int md) {
        this.setOrRemove("md", md);
        return this;
    }

    public String d0() {
        return this.getString("d0");
    }

    public WnBean d0(String d0) {
        this.setv("d0", d0);
        return this;
    }

    public String d1() {
        return this.getString("d1");
    }

    public WnBean d1(String d1) {
        this.setv("d1", d1);
        return this;
    }

    public WnBean update(NutMap map) {
        this.putAll(map);
        return this;
    }

    public String[] labels() {
        return this.getArray("lbs", String.class);
    }

    public WnBean labels(String[] lbs) {
        this.setOrRemove("lbs", lbs);
        return this;
    }

    public Date createTime() {
        return this.getAs("ct", Date.class);
    }

    public WnBean createTime(Date ct) {
        this.setOrRemove("ct", ct);
        return this;
    }

    public Date lastModified() {
        return this.getAs("lm", Date.class);
    }

    public long nanoStamp() {
        return this.getLong("nano");
    }

    public WnBean nanoStamp(long nano) {
        this.setv("nano", nano);
        this.setv("lm", new Date(nano / 1000000L));
        return this;
    }

    public boolean equals(Object obj) {
        if (obj instanceof WnBean) {
            WnBean o = (WnBean) obj;
            if (o.size() != size())
                return false;
            for (String key : o.keySet()) {
                if (!Lang.equals(o.get(key), get(key)))
                    return false;
            }
            return true;
        }
        return false;
    }

    public String toString() {
        return String.format("%s:%s[%s] %dbytes -> %s", id(), name(), sha1(), len(), mount());
    }

    // -----------------------------------------
    // 下面的属性不要主动设置，用 nd() 方法设置
    // -----------------------------------------

    public String path() {
        return getString("ph");
    }

    public WnNode path(String path) {
        setv("ph", path);
        return this;
    }

    public WnNode appendPath(String path) {
        path(Wn.appendPath(path(), path));
        return this;
    }

    public String name() {
        return getString("nm");
    }

    public WnNode name(String nm) {
        throw Er.create("e.io.obj.forbiden.set", "name=" + nm);
    }

    public WnRace race() {
        return getEnum("race", WnRace.class);
    }

    public WnNode race(WnRace race) {
        throw Er.create("e.io.obj.forbiden.set", "race=" + race);
    }

    public boolean isRace(WnRace race) {
        return race() == race;
    }

    public boolean isOBJ() {
        return isRace(WnRace.OBJ);
    }

    public boolean isDIR() {
        return isRace(WnRace.DIR);
    }

    public boolean isFILE() {
        return isRace(WnRace.FILE);
    }

    public String parentId() {
        return getString("pid");
    }

    @Override
    public boolean hasParent() {
        return !Strings.isBlank(parentId());
    }

    public String mount() {
        return getString("mnt");
    }

    public WnNode mount(String mnt) {
        setv("mnt", mnt);
        return this;
    }

    public boolean isMount() {
        return !Strings.isBlank(mount());
    }

    // -----------------------------------------
    // 下面是委托 _nd 属性的方法
    // -----------------------------------------

    public boolean isHidden() {
        return nd().isHidden();
    }

    @Override
    public boolean isRootNode() {
        return nd().isRootNode();
    }

    public WnNode parent() {
        return nd().parent();
    }

    public void setParent(WnNode parent) {
        nd().setParent(parent);
    }

    @Override
    public WnNode loadParents(List<WnNode> list, boolean force) {
        return nd().loadParents(list, force);
    }

    public boolean isMyParent(WnNode p) {
        return nd().isMyParent(p);
    }

    public WnTree tree() {
        return nd().tree();
    }

    public void setTree(WnTree tree) {
        nd().setTree(tree);
    }

    public void assertTree(WnTree tree) {
        nd().assertTree(tree);
    }

    public WnNode clone() {
        return duplicate();
    }

    @Override
    public WnNode duplicate() {
        return new WnBean(this);
    }

}
