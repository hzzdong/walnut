define({
    "hmaker" : {
        "icon" : {
            "skin" : '<i class="zmdi zmdi-texture"></i>'
        },
        "res" : {
            "title" : '资源库',
        },
        "site" : {
            "conf"   : '<i class="fa fa-gear"></i> <b>站点设置</b>',
            "nm"     : "站点名称",
            "hm_target_release" : "在线发布目标",
            "hm_target_debug"   : "调试发布目标",
            "skin" : "站点皮肤",
            "del_confirm"  : "删除站点是不可撤销的操作，你现在取消还来得及！点击「确定」将会把这个站点彻底删除。（当然已经发布的内容不会受到影响）",
            "new_site_dir" : "新站点所在目录",
            "newsite_nm"   : "我的新站点",
            "newsite_tt"  : '<i class="fa fa-sitemap"></i> 新建站点',
            "newsite_do"  : '立即创建这个新站点',
            "newsite_copy"  : '复制站点',
            "newsite_ok_tip" : "请点击下方按钮，创建站点",
            "newsite_warn_tip" : "站点名称已经被使用，请重新输入一个名字",
            "newsite_nocopy" : "空",
        },
        "lib" : {
            "title"     : "共享库",
            "item"      : "共享组件",
            "tip"       : "可以让多个网页复用相同的控件设定",
            "icon"      : '<i class="fa fa-diamond"></i>',
            "icon_item" : '<i class="zmdi zmdi-puzzle-piece"></i>',
            "empty"     : "共享组件库为空",
            "blank"     : "请选择一个组件显示其内容",
            "create"    : "创建组件",
            "reload"    : "重新加载组件",
            "delete_tip" : "组件如果被删除，使用这个组件的页面将不能正常显示，你确定继续吗？",
            "detach"     : "分离组件...",
            "detach_tip" : "分离组件后，组件所有的变化将不会再影响本控件，您确定要继续吗？",
            "create_tip": "请输入组件的名称",
            "nm_checking" : "检查名称...",
            "e_nm_exists" : '<i class="zmdi zmdi-alert-triangle"></i> 同名组件已存在',
            "e_nm_blank"  : '<i class="zmdi zmdi-alert-circle"></i> 请输入一个组件名称',
            "nm_valid"    : '<i class="zmdi zmdi-check"></i> 这个组件名称可用',
            "e_set_lib"   : "已经是组件了，只能先取消关联再设置",
            "e_load"      : '组件加载错误',
            "confirm_del_invalid" : "是否移除无效组件",
            "pages"       : "本组件的使用情况",
            "pages_none"  : "没有被使用",
            "rename"      : "改名",
            "rename_tip"  : "请输入新的组件名称",
            "rename_ok"   : "组件改名成功",
            "nm_exists"   : "这个组件名称已被使用",
            "e_noselect"  : "请选择一个组件",
            // "e_create_nest" : "组件不能嵌套组件",
        },
        "prop" : {
            "title" : '属性',
            "tt_edit"   : '<i class="zmdi zmdi-puzzle-piece"></i><b>控件属性</b>',
            "tt_page"   : '<i class="fa fa-gears"></i><b>页面属性</b>',
            "tt_folder" : '<i class="fa fa-gear"></i><b>属性</b>',
            "tt_other"  : '<i class="fa fa-gear"></i><b>属性</b>',
            "tab_block" : '<b>外观</b>',
            "tab_com"   : '<b>控件</b>',
            "margin"    : "外边距",
            "padding"   : "内边距",
            "border"    : "边框",
            "borderRadius" : "圆角",
            "background": "背景",
            "color"     : "前景色",
            "boxShadow" : "阴影",
            "img_src"   : "图片源",
            "href"      : "超链接",
            "width"     : "宽度",
            "height"    : "高度",
            "overflow"  : "内容溢出",
            "overflow_dft"     : "默认",
            "overflow_visible" : "可见",
            "overflow_auto"    : "滚动",
            "overflow_hidden"  : "剪裁",
            "objectFit" : "拉伸方式",
            "objectFit_contain" : "包含",
            "objectFit_cover"   : "覆盖",
            "objectFit_fill"    : "撑满",
            "areaWidth" : "内容宽度",
            "areaAlign" : "内容排列",
            "blockBackground"   : "块背景",
            "skin" : "皮肤",
            "skin_tip" : "为控件选择一个皮肤样式",
            "skin_none"  : "无皮肤样式",
            "skin_unset" : '<i class="zmdi zmdi-alert-triangle"></i> 站点没有设置皮肤，请在 "菜单>站点设置>站点皮肤" 处选择皮肤',
            "skin_empty" : '<i class="zmdi zmdi-info-outline"></i> 没有针对这个控件的皮肤样式',
            "noarea" : "您必须得在属性面板上选中一个区域才能进行这个操作"
        }, 
        "drag" : {
            "com_tip" : "拖拽移动到任意分栏",
            "hover" : "拖拽至此，Shift键取消"
        },
        "pos" : {
            "abs"    : "绝对定位: 用鼠标在页面上任意定位本块",
            "TL"     : "左上顶点定位",
            "TR"     : "右上顶点定位",
            "LB"     : "左下顶点定位",
            "BR"     : "右下顶点定位",
            "left"   : "左",
            "right"  : "右",
            "top"    : "上",
            "bottom" : "下",
            "width"  : "宽",
            "height" : "高",            
        },
        "page" : {
            "attr"         : "页面设置",
            "links"        : "链接资源",
            "title"        : "页面标题",
            "body"         : "页面",
            "margin"       : "页边距",
            "move_to_body" : "移出分栏",
            "move_before"  : "前移渲染顺位",
            "move_after"   : "后移渲染顺位",
            "assisted_showhide" : "显示或者隐藏辅助线",
            "publish" : "正在发布站点",
            "enter" : "点击预览",
            "insert" : "插入项",
            "ibarloading" : '<i class="fa fa-spinner fa-pulse"></i> 正在取得 ..',
            "noLibName" : "组件名称为空，咋插入啊大哥 -_-!",
            "ireload" : "重新加载插入项",
            "links_add"     : "添加",
            "links_del"     : "删除",
            "links_refresh" : "刷新",
            "pick_rs" : "选择资源",
        },
        "com" : {
            "_" : {
                "move_left"   : "左移",
                "move_right"  : "右移",
                "move_up"     : "上移",
                "move_down"   : "下移",
                "create"      : "新建",
                "del"         : "删除",
                "dft"         : "默认",
                "existsID" : "这个组件ID已经存在"
            },
            "_area" : {
                "name"  : "布局区域",
                "add"   : "添加分栏",
                "id"    : "分栏ID",
            },
            "rows" : {
                "name"  : "水平分栏",
                "tip"   : "对于所在区域进行水平分隔，可以容纳更多控件",
                "icon"  : '<i class="zmdi zmdi-view-agenda" style="font-size:1.2em;"></i>',
                "fixwidth"  : "固定宽度",
                "fixwidth_tip" : "单位是 px 或者 %",
                "padding"   : "栏内边距",
            },
            "columns" : {
                "name"  : "垂直分栏",
                "tip"   : "对于所在区域进行垂直分隔，可以容纳更多控件",
                "icon"  : '<i class="zmdi zmdi-view-column" style="font-size:1.4em;"></i>',
                "fixwidth"  : "固定宽度",
                "fixwidth_tip" : "单位是 px 或者 %",
                "padding"   : "栏内边距",
            },
            "navmenu" : {
                "name"  : "菜单条",
                "tip"   : "可垂直或水平放置，支持超链接或者显示隐藏某个区域的客户端动作",
                "icon"  : '<i class="fa fa-navicon"></i>',
                "item_dft_text" : "菜单项文字",
                "add"   : "添加菜单项",
                "newtab" : "新窗口",
                "nohref" : "无链接",
                "nocurrent" : "抱歉，您执行这个操作前，必须要选择一个菜单项",
                "empty" : "菜单无任何项目",
                "mode"  : "放置模式",
                "mode_default" : "水平",
                "mode_aside"   : "垂直",
                "itemAlign"    : "对齐方式",
                "atype" : {
                    "title" : "菜单类型",
                    "link"  : "超链接",
                    "toggleArea"  : "区域显示",
                    "layoutComId" : "对应分栏",
                },
                "toar_check_tip" : "标识当前项对应的区域为默认显示区域",
                "toar_area_none" : "选择一个区域",
                "toar_no_bar"    : "请选择菜单条对应的分栏控件",
                "edit_href" : "编辑菜单项链接"
            },
            "text" : {
                "name"  : "文本",
                "tip"   : "直接编辑你想要的文字内容",
                "icon"  : '<i class="fa fa-text-width"></i>',
                "tt_editor"   : '<i class="fa fa-edit"></i> 编辑内容',
                "lineHeight"    : "行高",
                "letterSpacing" : "字间距",
                "color"         : "文字颜色",
                "upperFirst"    : "首字母大写",
                "textAlign"     : "文字对齐",
                "fontSize"      : "文字大小",
                "blank_content" : "编辑文字内容",
                "textShadow"    : "文字阴影",
                "edit_tip" : "编辑",
            },
            "image" : {
                "name"  : "图片",
                "tip"   : "不解释你懂的",
                "icon"  : '<i class="fa fa-image"></i>',
                "tt_image" : "图片属性",
                "tt_text"  : "文本属性",
                "text"  : "图片文本",
                "text_pos" : "文字位置",
                "text_pos_N" : "顶部",
                "text_pos_S" : "底部",
                "text_pos_W" : "左侧",
                "text_pos_E" : "右侧",
                "text_padding" : "文本边距",
                "text_size"    : "文本区大小",
                "text_color"   : "文本颜色",
                "text_background"  : "文本背景",
            },
            "objlist" : {
                "name"  : "动态数据列表",
                "tip"   : "为你的数据集合设置列表模式的显示版式。支持翻页，海量数据也没问题哦",
                "icon"  : '<i class="fa fa-cubes"></i>',
                "dds"          : "数据源",
                "parti_key"    : "字段",
                "parti_text"   : "描述",
                "filter"       : "过滤器",
                "flt_add"      : "添加过滤字段",
                "flt_del"      : "删除过滤字段",
                "flt_mvup"     : "前移过滤字段",
                "flt_mvdown"   : "后移过滤字段",
                "flt_kwd"      : "关键字",
                "flti_multi"   : "可多选",
                "flti_show"    : "默认显示",
                "flti_list"    : "可选值",
                "flti_list_tip": "可选值一行一个，每行半角冒号分隔，前面是显示文字，后面是实际的值，支持区间表示值的范围",
                "flti_list_demo": "18岁以前 : [,18]\n18至35岁 : [18,35)\n35至60岁 : [35,60]\n60岁以后 : [60,)",
                "flt_kwd_tip"  : "对应字段",
                "flt_kwd_tip2" : "半角逗号分隔，可以连续输入多个关键字对应的字段",
                "sort"         : "排序",
                "sort_add"     : "添加一个排序字段",
                "sort_del"     : "删除一个",
                "sort_mvup"    : "前移排序字段",
                "sort_mvdown"  : "后移排序字段",
                "sorti_toggleable" : "可修改",
                "sorti_asc"    : "从小到大",
                "sorti_desc"   : "从大到小",
                "sorti_more"   : "更多排序字段",
                "sorti_more_tip"  : "选择本排序条件后，还附加哪些更多的排序条件，这个是你的用户不能修改的，请用 JSON 来表示，1 为asc默认，-1 为 desc",
                "sorti_more_demo" : "[{nm:1,ct:-1}]",
                "sort_lskey"   : "在本地存储排序状态",
                "sort_lskey_tip"  : "如果你打算在用户的客户端保存用户最后一次选择的排序，可以声明一个键值（一个特殊的字符串，比如 mysite_pageA_sort)",
                "sort_lskey_demo" : "你的本地存储键",
                "pager"        : "分页器",
                "pg_sizes"     : "可选页大小",
                "pg_dftpgsz"   : "默认页大小",
                "lskey"        : "保存状态",
                "pg_auto_hide" : "自动隐藏",
                "pg_style"     : "显示风格",
                "pg_style_normal" : "普通",
                "pg_style_jump"   : "跳转",
                "pg_i18n"      : "显示文字",
                "pg_i18n_dft"  : {
                    "prev"  : "前页",
                    "next"  : "后页",
                    "first" : "首页",
                    "last"  : "尾页",
                    "pgsz"  : "页大小",
                    "sum"   : "共{{pn}}页"
                },
            },
            "objshow" : {
                "name"  : "动态数据对象",
                "tip"   : "详细的定制了某个数据的详细显示方式",
                "icon"  : '<i class="fa fa-cube"></i>',
            },
        },
        "dds" : {
            "api"          : "数据接口",
            "api_refresh"  : "刷新数据接口列表",
            "params"       : "接口参数",
            "template"     : "显示模板",
            "tmpl_refresh" : "刷新显示模板列表",
            "tmpl_noskin"  : "无皮肤",
            "options"      : "模板映射",
            "param_base"   : "基础值",
            "param_from"   : "来自",
            "param_key"    : "键",
            "param_merge"  : "合并",
            "noapi"        : "没设定数据接口",
            "notemplate"   : "未设定显示模板",
            "nopartitem"   : "没有选中任何项目，无法继续操作",
            "api_loading"  : "正在从接口加载数据 ...",
            "api_empty"    : "厄...没有数据",
            "api_lack_params" : "动态参数没有提供默认数据，不能预览显示，只能发布以后查看效果",
            "reload" : "重新从接口加载数据，以便查看显示效果",
        },
    }
});