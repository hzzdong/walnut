package org.nutz.walnut.impl.io;

import org.nutz.walnut.api.err.Er;
import org.nutz.walnut.api.io.WnObj;
import org.nutz.walnut.api.io.WnSecurity;
import org.nutz.walnut.api.io.WnIndexer;
import org.nutz.walnut.api.io.WnNode;
import org.nutz.walnut.api.io.WnTree;
import org.nutz.walnut.api.usr.WnUsr;
import org.nutz.walnut.api.usr.WnUsrService;
import org.nutz.walnut.util.Wn;

public class WnSecurityImpl implements WnSecurity {

    private WnIndexer indexer;

    private WnTree tree;

    private WnUsrService usrs;

    public WnSecurityImpl(WnIndexer indexer, WnTree tree, WnUsrService usrs) {
        this.indexer = indexer;
        this.tree = tree;
        this.usrs = usrs;
    }

    @Override
    public WnNode enter(WnNode nd) {
        WnObj o = __eval_obj(nd, true);
        return __do_check(o, Wn.Io.RX, false);
    }

    @Override
    public WnNode access(WnNode nd) {
        WnObj o = __eval_obj(nd, true);
        return __do_check(o, Wn.Io.R, false);
    }

    @Override
    public WnNode view(WnNode nd) {
        WnObj o = __eval_obj(nd, false);
        return __do_check(o, Wn.Io.R, true);
    }

    @Override
    public WnNode read(WnNode nd) {
        WnObj o = __eval_obj(nd, true);
        return __do_check(o, Wn.Io.R, false);
    }

    @Override
    public WnNode write(WnNode nd) {
        WnObj o = __eval_obj(nd, true);
        return __do_check(o, Wn.Io.W, false);
    }

    private WnObj __eval_obj(WnNode nd, boolean auto_unlink) {
        WnObj o = indexer.toObj(nd);
        // 处理链接文件
        if (auto_unlink && o.isLink()) {
            String ln = o.link();
            // 用 ID
            if (ln.startsWith("id:")) {
                String id = ln.substring("id:".length());
                nd = tree.getNode(id);
            }
            // 用路径
            else {
                nd = tree.fetch(nd, ln);
            }
            // 如果节点不存在
            if (null == nd)
                throw Er.create("e.io.obj.noexists", ln);

            // 转换为对象
            o = indexer.toObj(nd);
        }
        return o;
    }

    private WnNode __do_check(WnObj o, int mask, boolean asNull) {

        // 我是谁？
        String me = Wn.WC().checkMe();
        WnUsr u = usrs.check(me);

        // 对象组给我啥权限
        int role = usrs.getRoleInGroup(u, o.group());

        // 黑名单的话，禁止
        if (Wn.ROLE.BLOCK == role)
            throw Er.create("e.io.forbidden");

        // 对象的权限设定
        // TODO zozoh: 这里考虑一下 /grp/$grp/pvg 下的权限设定
        // 或许给 WnUsrService 加个函数，带点缓存就是了 ...
        int md = o.mode();

        // o 允许进入
        if ((md & mask) == mask)
            return o;

        // g 允许进入
        if (Wn.ROLE.MEMBER == role && ((md >> 3) & mask) == mask)
            return o;

        // u 允许进入
        if (Wn.ROLE.ADMIN == role && ((md >> 6) & mask) == mask)
            return o;

        // 抛错，没有权限
        throw Er.create("e.io.forbidden");
    }
}
// // 检查基本权限
// int mode = last.mode();
//
// // 检查 other
// int m = mode & 7;
// if (!Maths.isMaskAll(m, mode))
// throw Er.create("e.io.forbiden", nd);
//
// // 检查 member
// m = mode >> 3 & 7;
// if (!Maths.isMaskAll(m, mode))
// throw Er.create("e.io.forbiden", nd);
//
// // 检查 admin
// m = mode >> 6 & 7;
// if (!Maths.isMaskAll(m, mode))
// throw Er.create("e.io.forbiden", nd);

//