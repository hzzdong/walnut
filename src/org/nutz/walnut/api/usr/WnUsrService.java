package org.nutz.walnut.api.usr;

import org.nutz.walnut.impl.usr.IoWnUsr;

public interface WnUsrService {

    WnUsr create(String str, String pwd);

    /**
     * 删除一个用户
     * 
     * @param nm
     *            用户名
     * @return 被删除的用户，null 表用户不存在
     */
    void delete(WnUsr u);

    void setPassword(String str, String pwd);

    WnUsr setName(String str, String nm);

    WnUsr setPhone(String str, String phone);

    WnUsr setEmail(String str, String email);

    WnUsr setHome(String str, String home);

    WnUsr fetch(String str);

    IoWnUsr check(String str);

}