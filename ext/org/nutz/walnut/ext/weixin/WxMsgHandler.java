package org.nutz.walnut.ext.weixin;

import java.util.Collection;
import java.util.Map;

import org.nutz.lang.Strings;
import org.nutz.lang.util.Region;
import org.nutz.walnut.api.err.Er;
import org.nutz.weixin.bean.WxInMsg;
import org.nutz.weixin.bean.WxScanCodeInfo;
import org.nutz.weixin.bean.WxSendLocationInfo;

public class WxMsgHandler {

    public String id;

    public Object match;

    public boolean context;

    public Object command;

    @SuppressWarnings("unchecked")
    public boolean isMatched(WxInMsg im) {
        if (null != match) {
            // 仅仅一个判断条件
            if (match instanceof Map<?, ?>) {
                return _is_matched(im, (Map<String, Object>) match);
            }
            // 很多判断条件
            else if (match instanceof Collection<?>) {
                for (Object ele : (Collection<?>) match) {
                    // 选择
                    if (ele instanceof Map<?, ?>) {
                        if (_is_matched(im, (Map<String, Object>) ele))
                            return true;
                    }
                    // 字符串
                    else if (ele.toString().equals(im.getContent())) {
                        return true;
                    }
                }
                return false;
            }
            // 其他的，当做文本处理
            else {
                return this._do_match(match, im.getContent());
            }
        }
        return true;
    }

    private boolean _is_matched(WxInMsg im, Map<String, Object> map) {
        for (Map.Entry<String, Object> en : map.entrySet()) {
            String key = en.getKey();
            Object val = en.getValue();
            // MsgType
            if ("MsgType".equals(key)) {
                if (!_do_match(val, im.getMsgType()))
                    return false;
            }
            // Content
            else if ("Content".equals(key)) {
                if (!_do_match(val, im.getContent()))
                    return false;
            }
            // Event
            else if ("Event".equals(key)) {
                if (!_do_match(val, im.getEvent()))
                    return false;
            }
            // EventKey
            else if ("EventKey".equals(key)) {
                if (!_do_match(val, im.getEventKey()))
                    return false;
            }
            // ScanCodeInfo
            else if (key.startsWith("ScanCodeInfo.")) {
                String subKey = key.substring("ScanCodeInfo.".length());
                WxScanCodeInfo scinfo = im.getScanCodeInfo();
                // ScanCodeInfo.ScanType
                if ("ScanType".equals(subKey)) {
                    if (!_do_match(val, scinfo.getScanType()))
                        return false;
                }
                // ScanCodeInfo
                else if ("ScanResult".equals(subKey)) {
                    if (!_do_match(val, scinfo.getScanResult()))
                        return false;
                }
                // 错误的键
                else {
                    throw Er.create("e.cmd.weixin.invalid.matchkey.ScanCodeInfo", subKey);
                }
            }
            // SendLocationInfo
            else if (key.startsWith("SendLocationInfo.")) {
                String subKey = key.substring("SendLocationInfo.".length());
                WxSendLocationInfo slinfo = im.getSendLocationInfo();
                // Label.ScanType
                if ("Label".equals(subKey)) {
                    if (!_do_match(val, slinfo.getLabel()))
                        return false;
                }
                // ScanCodeInfo
                else if ("Poiname".equals(subKey)) {
                    if (!_do_match(val, slinfo.getPoiname()))
                        return false;
                }
                // Location_X
                else if ("Location_X".equals(subKey)) {
                    if (!_do_match_double_region(val, slinfo.getLocation_X()))
                        return false;
                }
                // Location_Y
                else if ("Location_Y".equals(subKey)) {
                    if (!_do_match_double_region(val, slinfo.getLocation_Y()))
                        return false;
                }
                // Scale
                else if ("Scale".equals(subKey)) {
                    if (!_do_match_double_region(val, slinfo.getScale()))
                        return false;
                }
                // 错误的键
                else {
                    throw Er.create("e.cmd.weixin.invalid.matchkey.SendLocationInfo", subKey);
                }
            }
            // 不可能
            else {
                throw Er.create("e.cmd.weixin.invalid.matchkey", key);
            }
        }
        return true;
    }

    private boolean _do_match_double_region(Object val, double nb) {
        Region<Double> rg = Region.Double(val.toString());
        return rg.match(nb);
    }

    @SuppressWarnings("unchecked")
    private boolean _do_match(Object pattern, String str) {
        // 用 {regex:"xxx"} 表示的正则表达式
        if (pattern instanceof Map) {
            String regex = ((Map<String, String>) pattern).get("regex");
            if (null != regex) {
                return str.matches(regex);
            }
        }
        // 得到字符串
        String exp = Strings.trim(pattern.toString());

        // ^开头表示正则表达式
        if (exp.startsWith("^") && exp.length() > 1) {
            return str.matches(exp);
        }

        // 字符串精确匹配，但是忽略大小写
        return exp.equalsIgnoreCase(Strings.trim(str));
    }

}
