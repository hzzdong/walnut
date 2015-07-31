package org.nutz.walnut.impl.io;

import java.io.InputStream;
import java.io.OutputStream;
import java.io.Reader;
import java.io.Writer;
import java.util.Collection;
import java.util.List;

import org.nutz.json.Json;
import org.nutz.json.JsonFormat;
import org.nutz.lang.Each;
import org.nutz.lang.Files;
import org.nutz.lang.Lang;
import org.nutz.lang.Streams;
import org.nutz.lang.Strings;
import org.nutz.lang.util.Callback;
import org.nutz.walnut.api.err.Er;
import org.nutz.walnut.api.io.MimeMap;
import org.nutz.walnut.api.io.WalkMode;
import org.nutz.walnut.api.io.WnIo;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.api.io.WnQuery;
import org.nutz.walnut.api.io.WnRace;
import org.nutz.walnut.api.io.WnStore;
import org.nutz.walnut.api.io.WnTree;
import org.nutz.walnut.util.Wn;

public class WnIoImpl implements WnIo {

    private WnTree tree;

    private WnStore store;

    private MimeMap mimes;

    public void _clean_for_unit_test() {
        tree._clean_for_unit_test();
        store._clean_for_unit_test();
    }

    @Override
    public WnObj rename(WnObj o, String nm) {
        return tree.rename(o, nm);
    }

    @Override
    public WnObj move(WnObj src, String destPath) {
        return tree.move(src, destPath);
    }

    @Override
    public void set(WnObj o, String regex) {
        tree.set(o, regex);
    }

    @Override
    public WnObj getOne(WnQuery q) {
        return tree.getOne(q);
    }

    @Override
    public int each(WnQuery q, Each<WnObj> callback) {
        return tree.each(q, callback);
    }

    @Override
    public List<WnObj> query(WnQuery q) {
        return tree.query(q);
    }

    @Override
    public long count(WnQuery q) {
        return tree.count(q);
    }

    @Override
    public boolean hasChild(WnObj p) {
        return tree.hasChild(p);
    }

    @Override
    public boolean exists(WnObj p, String path) {
        return tree.fetch(p, path) != null;
    }

    @Override
    public boolean existsId(String id) {
        return tree.existsId(id);
    }

    @Override
    public WnObj get(String id) {
        return tree.get(id);
    }

    @Override
    public WnObj getRoot() {
        return tree.getRoot();
    }

    @Override
    public WnObj checkById(String id) {
        WnObj o = get(id);
        if (null == o)
            throw Er.create("e.io.noexists", "id:" + id);
        return o;
    }

    @Override
    public WnObj check(WnObj p, String path) {
        WnObj o = fetch(p, path);
        if (null == o)
            throw Er.create("e.io.noexists", path);
        return o;
    }

    @Override
    public WnObj fetch(WnObj p, String path) {
        // 判断是否是获取对象索引
        String nm = Files.getName(path);
        boolean rwmeta = false;
        if (nm.startsWith(Wn.OBJ_META_PREFIX)) {
            path = Files.renamePath(path, nm.substring(Wn.OBJ_META_PREFIX.length())).replace('\\',
                                                                                             '/');
            rwmeta = true;
        }

        // 获取对象
        WnObj o = tree.fetch(p, path);
        // 标记一下，如果读写的时候，只写这个对象的索引
        if (rwmeta) {
            o.setv(Wn.OBJ_META_RW, rwmeta);
            o.mime(mimes.getMime("json"));
        }
        return o;
    }

    @Override
    public WnObj fetch(WnObj p, String[] paths, int fromIndex, int toIndex) {

        // 判断是否是获取对象索引
        String nm = paths[toIndex - 1];
        boolean rwmeta = false;
        if (nm.startsWith(Wn.OBJ_META_PREFIX)) {
            paths[toIndex - 1] = nm.substring(Wn.OBJ_META_PREFIX.length());
            rwmeta = true;
        }

        // 获取对象
        WnObj o = tree.fetch(p, paths, fromIndex, toIndex);

        // 标记一下，如果读写的时候，只写这个对象的索引
        if (rwmeta) {
            o.setv(Wn.OBJ_META_RW, rwmeta);
            o.mime(mimes.getMime("json"));
        }
        return o;
    }

    @Override
    public void walk(WnObj p, final Callback<WnObj> callback, WalkMode mode) {
        tree.walk(p, callback, mode);
    }

    @Override
    public WnObj createIfNoExists(WnObj p, String path, WnRace race) {
        // 判断是否是获取对象索引
        String nm = Files.getName(path);
        if (nm.startsWith(Wn.OBJ_META_PREFIX)) {
            return fetch(p, path);
        }

        return tree.createIfNoExists(p, path, race);
    }

    @Override
    public WnObj create(WnObj p, String path, WnRace race) {
        // 判断是否是获取对象索引
        String nm = Files.getName(path);
        if (nm.startsWith(Wn.OBJ_META_PREFIX)) {
            return fetch(p, path);
        }

        return tree.create(p, path, race);
    }

    @Override
    public WnObj createById(WnObj p, String id, String name, WnRace race) {
        return tree.createById(p, id, name, race);
    }

    @Override
    public WnObj create(WnObj p, String[] paths, int fromIndex, int toIndex, WnRace race) {
        // 判断是否是获取对象索引
        String nm = paths[toIndex - 1];
        if (nm.startsWith(Wn.OBJ_META_PREFIX)) {
            return fetch(p, paths, fromIndex, toIndex);
        }

        return tree.create(p, paths, fromIndex, toIndex, race);
    }

    @Override
    public void delete(WnObj o) {
        // 调用回调
        o = Wn.WC().doHook("delete", o);

        // 链接的话，就删了吧
        if (null != o) {
            if (!o.isLink()) {
                // 目录的话，删除不能为空
                if (hasChild(o)) {
                    throw Er.create("e.io.rm.noemptynode", o);
                }

                // 删除树节点和索引
                tree.delete(o);

                // 文件删除
                if (!o.isDIR()) {
                    store.delete(o);
                }
            }

            // 触发同步时间修改
            Wn.Io.update_ancestor_synctime(this, o, false);
        }
    }

    @Override
    public void setMount(WnObj o, String mnt) {
        // 保存旧 mount 信息
        o.setv("_old_mnt", o.mount());

        // 如果是 unmount，则恢复到父节点的 mount
        if (null == mnt) {
            o.mount(o.parent().mount());
        }
        // 否则..
        else {
            o.setv("mnt", mnt);
        }
        set(o, "^mnt$");

        // 调用钩子
        Wn.WC().doHook("mount", o);
    }

    @Override
    public InputStream getInputStream(WnObj o, long off) {
        // 是读取元数据的
        if (o.getBoolean(Wn.OBJ_META_RW)) {
            WnObj o2 = (WnObj) o.duplicate();
            o2.remove(Wn.OBJ_META_RW);
            return new WnObjMetaInputStream(o2);
        }
        // 读取内容的
        return store.getInputStream(o, off);
    }

    @Override
    public OutputStream getOutputStream(WnObj o, long off) {
        // 是写入元数据的
        if (o.getBoolean(Wn.OBJ_META_RW)) {
            return new WnObjMetaOutputStream(o, this, off < 0);
        }
        // 写入内容
        OutputStream ops = store.getOutputStream(o, off);
        return new WnIoOutputStreamWrapper(this, o, ops);
    }

    @Override
    public void writeMeta(WnObj o, Object meta) {
        // 得到之前的配置
        boolean rw = o.getBoolean(Wn.OBJ_META_RW);

        // 确保是写 Meta
        o.setv(Wn.OBJ_META_RW, true);

        // 写入
        String json = __to_meta_json(o, meta);
        writeText(o, json);

        // 恢复
        if (!rw)
            o.remove(Wn.OBJ_META_RW);
    }

    private String __to_meta_json(WnObj o, Object meta) {
        // 空
        if (null == meta) {
            return "{}";
        }

        // 准备格式化
        JsonFormat fmt = JsonFormat.compact().setIgnoreNull(false);

        // 字符串
        if (meta instanceof CharSequence) {
            String str = Strings.trim(meta.toString());
            // 空字符串，当做空对象
            if (Strings.isBlank(str)) {
                return "{}";
            }
            // 正则表达式
            if (str.startsWith("^")) {
                return Json.toJson(o.toMap(str), fmt);
            }
            // 如果是 JSON 对象
            if (Strings.isQuoteBy(str, '{', '}')) {
                return str;
            }
            // 否则，试图给其包裹上 map
            return Json.toJson(Lang.map(str), fmt);
        }
        // 列表和数组是不可以的
        if (meta instanceof Collection<?> || meta.getClass().isArray()) {
            throw Er.create("e.io.meta.aslist", meta);
        }
        // 其他的对象，统统变 JSON 字符串
        return Json.toJson(meta, fmt);
    }

    @Override
    public void appendMeta(WnObj o, Object meta) {
        // 得到之前的配置
        boolean rw = o.getBoolean(Wn.OBJ_META_RW);

        // 确保是写 Meta
        o.setv(Wn.OBJ_META_RW, true);

        // 写入
        String json = __to_meta_json(o, meta);
        appendText(o, json);

        // 恢复
        if (!rw)
            o.remove(Wn.OBJ_META_RW);
    }

    @Override
    public long readAndClose(WnObj o, OutputStream ops) {
        InputStream ins = this.getInputStream(o, 0);
        return Streams.writeAndClose(ops, ins);
    }

    @Override
    public String readText(WnObj o) {
        InputStream ins = this.getInputStream(o, 0);
        Reader r = Streams.buffr(Streams.utf8r(ins));
        return Streams.readAndClose(r);
    }

    @Override
    public <T> T readJson(WnObj o, Class<T> classOfT) {
        InputStream ins = this.getInputStream(o, 0);
        Reader r = Streams.buffr(Streams.utf8r(ins));
        try {
            return Json.fromJson(classOfT, r);
        }
        finally {
            Streams.safeClose(r);
        }
    }

    @Override
    public Reader getReader(WnObj o, long off) {
        InputStream ins = this.getInputStream(o, off);
        return Streams.utf8r(ins);
    }

    @Override
    public Writer getWriter(WnObj o, long off) {
        OutputStream ops = this.getOutputStream(o, off);
        return Streams.utf8w(ops);
    }

    @Override
    public long writeText(WnObj o, CharSequence cs) {
        OutputStream ops = this.getOutputStream(o, 0);
        Writer w = Streams.buffw(Streams.utf8w(ops));
        Streams.writeAndClose(w, cs);
        return o.len();
    }

    @Override
    public long appendText(WnObj o, CharSequence cs) {
        OutputStream ops = this.getOutputStream(o, -1);
        Writer w = Streams.buffw(Streams.utf8w(ops));
        Streams.writeAndClose(w, cs);
        return o.len();
    }

    @Override
    public long writeJson(WnObj o, Object obj, JsonFormat fmt) {
        if (null == fmt)
            fmt = JsonFormat.full().setQuoteName(true);

        Object json = obj;
        if (obj instanceof CharSequence) {
            json = Json.fromJson(obj.toString());
        }

        OutputStream ops = this.getOutputStream(o, 0);
        Writer w = Streams.buffw(Streams.utf8w(ops));
        try {
            Json.toJson(w, json, fmt);
        }
        finally {
            Streams.safeClose(w);
        }
        return o.len();
    }

    @Override
    public long writeAndClose(WnObj o, InputStream ins) {
        OutputStream ops = this.getOutputStream(o, 0);
        return Streams.writeAndClose(ops, ins);
    }

    @Override
    public MimeMap mimes() {
        return this.mimes;
    }

    @Override
    public String open(WnObj o, int mode) {
        return store.open(o, mode);
    }

    @Override
    public void close(String hid) {
        store.close(hid);
    }

    @Override
    public int read(String hid, byte[] bs, int off, int len) {
        return store.read(hid, bs, off, len);
    }

    @Override
    public void write(String hid, byte[] bs, int off, int len) {
        store.write(hid, bs, off, len);
    }

    @Override
    public int read(String hid, byte[] bs) {
        return store.read(hid, bs);
    }

    @Override
    public void write(String hid, byte[] bs) {
        store.write(hid, bs);
    }

    @Override
    public void seek(String hid, long pos) {
        store.seek(hid, pos);
    }

    @Override
    public void flush(String hid) {
        store.flush(hid);
    }

}
