define({
    "hmaker" : {
        "icon" : {
            "skin" : '<i class="zmdi zmdi-texture"></i>'
        },
        "res" : {
            "title" : '资源库',
        },
        "link" : {
            "none"   : "无链接",
            "edit"   : '<i class="zmdi zmdi-link"></i> 编辑超链接',
            "select" : "站内链接快速选择",
            "edit_tip" : '如果想编辑站外链接，请用 <code>http://</code> 或者 <code>https://</code> 开头。站内链接一律相对于站点主目录，并以 <code>/</code> 开头',
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
            "loading"   : "正在加载属性面板",
            "margin"    : "外边距",
            "padding"   : "内边距",
            "border"    : "边框",
            "borderRadius" : "圆角",
            "_align"     : "排列",
            "textAlign" : "文本排列",
            "ta_left"    : "居左",
            "ta_center"  : "居中",
            "ta_right"   : "居右",
            "ta_justify" : "两端对齐",
            "fontFamily" : "字体",
            "fontSize"   : "字大小",
            "_font"       : "文字风格",
            "textShadow" : "文字阴影",
            "letterSpacing" : "字间距",
            "lineHeight" : "行高",
            "background": "背景",
            "color"     : "前景色",
            "boxShadow" : "阴影",
            "img_src"   : "图片源",
            "href"      : "超链接",
            "width"     : "宽度",
            "height"    : "高度",
            "overflow"  : "内容溢出",
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
            "skin_none"  : "无皮肤",
            "skin_unset" : '<i class="zmdi zmdi-alert-triangle"></i> 站点没有设置皮肤，请在 "菜单>站点设置>站点皮肤" 处选择皮肤',
            "skin_empty" : '<i class="zmdi zmdi-info-outline"></i> 没有找到相关的皮肤样式',
            "noarea" : "您必须得在属性面板上选中一个区域才能进行这个操作",
            "css_tt"   : "CSS类选择器列表",
            "css_none" : "无可用的 CSS 类选择器",
            "css_edit" : "进入编辑模式",
            "css_edit_ok"     : "确认修改",
            "css_edit_cancel" : "放弃",
            "css_nolinks" : "您的页面没有链接任何 CSS 文件",
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
            "publish" : "发布站点",
            "enter" : "点击预览",
            "insert" : "插入项",
            "ibarloading" : '<i class="fa fa-spinner fa-pulse"></i> 正在取得 ..',
            "noLibName"   : "组件名称为空，咋插入啊大哥 -_-!",
            "ireload"     : "重新加载插入项",
            "links_edit"  : "编辑资源列表",
            "pick_rs"     : "选择资源",
            "preparing"   : "正在准备页面组件...",
        },
        "com" : {
            "_" : {
                "move_left"   : "左移",
                "move_right"  : "右移",
                "move_up"     : "上移",
                "move_down"   : "下移",
                "move_prev"   : "前移",
                "move_next"   : "后移",
                "create"      : "新建",
                "del"         : "删除",
                "dft"         : "默认",
                "existsID" : "这个组件ID已经存在",
                "no_setting"  : '<i class="zmdi zmdi-alert-octagon"></i> 无需设置',
                "fld_name"    : "字段名",
                "fld_text"    : "字段描述",
                "description" : "描述",
            },
            "_area" : {
                "name"  : "布局区域",
                "add"   : "添加分栏",
                "id"    : "分栏ID",
                "del"   : "删除当前分栏",
                "mv_prev" : "前移当前分栏",
                "mv_next" : "后移当前分栏",
            },
            "rows" : {
                "name"  : "水平分栏",
                "tip"   : "对于所在区域进行水平分隔，可以容纳更多控件",
                "icon"  : '<i class="zmdi zmdi-view-agenda"></i>',
                "fixwidth"  : "固定宽度",
                "fixwidth_tip" : "单位是 px 或者 %",
                "padding"   : "栏内边距",
            },
            "columns" : {
                "name"  : "垂直分栏",
                "tip"   : "对于所在区域进行垂直分隔，可以容纳更多控件",
                "icon"  : '<i class="zmdi zmdi-view-column"></i>',
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
                "del"   : "删除当前菜单项",
                "mv_prev" : "前移当前菜单项",
                "mv_next" : "后移当前菜单项",
                "mv_parent"  : "升级当前菜单项",
                "mv_sub"     : "降级当前菜单项(成为子菜单)",
                "newtab" : "在新窗口打开",
                "nohref" : "未设置",
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
                "toar_no_bar"    : "请在 <em>对应分栏</em> 一项选择本菜单要处理的分栏控件，谢谢。这个分栏控件的各个区域关联到本菜单后，会随着菜单项的高亮而显示，随着其取消高亮而隐藏。",
                "toar_edit_title" : "选择对应的分栏区域",
                "toar_edit_tip"   : "建议你直接选择，写的话可能会出错哦",
                "autoCurrent" : "自动高亮",
                "autoCurrent_tip" : "根据页面自动设置高亮项",
                "autoShowSub"     : "自动展开",
                "autoShowSub_tip" : "鼠标停留自动展开子菜单",
            },
            "text" : {
                "name"  : "文本",
                "tip"   : "直接编辑你想要的文字内容",
                "icon"  : '<i class="fa fa-text-width"></i>',
                "tt"       : "编辑文本内容",
                "open"     : "打开文本编辑器",
                "edit_tt"  : "文本编辑器",
                "blank_content" : "没有任何文本内容",
            },
            "image" : {
                "name"  : "图片",
                "tip"   : "不解释你懂的",
                "icon"  : '<i class="fa fa-image"></i>',
                "tt_image" : "图片属性",
                "newtab"   : "新窗口",
                "tt_text"  : "图片文本属性",
                "text"     : "图片文本",
                "text_tip" : "图片文本的各种属性，比如字号，颜色，背景等，请在 \"外观\" 标签下修改对应设置项。",
                "text_pos" : "文字位置",
                "text_pos_N" : "顶部",
                "text_pos_S" : "底部",
                "text_pos_P" : "居中",
            },
            "htmlcode" : {
                "name"  : "HTML代码片段",
                "tip"   : "你可以添加任意HTML片段，甚至包括 script 和 style",
                "icon"  : '<i class="fa fa-code"></i>',
                "tt"    : "编辑HTML代码",
                "open"  : "打开代码编辑器",
                "edit_tip" : "CTRL(Command)+Enter 快速应用修改",
                "edit_tt"  : "HTML 代码编辑器",
                "blank_content" : "没有任何 HTML 代码",
            },
            "dynamic" : {
                "name"  : "动态数据",
                "tip"   : "指定从某 [数据接口] 获取数据，并可以定制显示方式",
                "icon"  : '<i class="fa fa-cube"></i>',
                "api"          : "数据接口",
                "api_refresh"  : "刷新数据接口列表",
                "params"       : "接口参数",
                "template"     : "显示模板",
                "tmpl_refresh" : "刷新显示模板列表",
                "tmpl_noskin"  : "无皮肤",
                "options"      : "模板映射",
                "noapi"        : '<i class="zmdi zmdi-alert-polygon"></i> 没设定数据接口',
                "api_gone"     : '<i class="zmdi zmdi-alert-polygon"></i> 数据接口不存在',
                "notemplate"   : '<i class="zmdi zmdi-alert-polygon"></i> 未设定显示模板',
                "api_loading"  : '<i class="zmdi zmdi-rotate-right zmdi-hc-spin"></i> 正在从接口加载数据 ...',
                "api_empty"    : '<i class="zmdi zmdi-alert-circle-o"></i> 厄...没有数据',
                "api_lack_params" : '<i class="zmdi zmdi-alert-circle"></i> 动态参数没有提供默认数据，不能预览显示，只能发布以后查看效果',
                "api_data_nomatch" : '<i class="zmdi zmdi-alert-triangle"></i> API返回值数据与模板不匹配',
                "need_params"  : '<i class="zmdi zmdi-alert-triangle"></i> 您还有参数未设值',
                "reload" : "重新从接口加载数据，以便查看显示效果",
                "com_none" : "请选择页面上的控件",
                "e_nocom" : '<i class="zmdi zmdi-alert-triangle"></i>  控件不存在',
                "e_p_mapping" : '<i class="zmdi zmdi-alert-octagon"></i>  映射参数必须是一个JSON对象',
            },
            "searcher" : {
                "name"  : "搜索框",
                "tip"   : "与 '动态数据' 控件联合使用，可以为数据接口提供搜索关键字参数",
                "icon"  : '<i class="fa fa-search"></i>',
                "placeholder"  : "提示信息",
                "plhd_dft"     : "请输入",
                "defaultValue" : "默认值",
                "btnText"   : "按钮文字",
                "trimSpace" : "截取空白",
                "maxLen"    : "最大长度",
                "maxLen_tip" : "负数或者 0 表示不限制。超过这个长度，内容将被截断"
            },
            "filter" : {
                "name"  : "筛选条件",
                "tip"   : "与 '动态数据' 控件联合使用，可以让用户为数据接口提供筛选条件",
                "icon"  : '<i class="fa fa-filter"></i>',
                "add"   : "添加新过滤字段",
                "edit"  : "编辑过滤字段",
                "del"   : "移除当前过滤字段",
                "empty" : "过滤器没有设置内容",
                "ext_show"         : "展开",
                "ext_hide"         : "收起",
                "multi"            : "多选",
                "multi_ok_txt"     : "确认",
                "multi_cancel_txt" : "取消",
                "fld_more_txt"     : "更多",
                "fld_less_txt"     : "收起",
                "btnMultiText"       : "多选按钮文字",
                "btnExtTextShow"     : "展开按钮文字",
                "btnExtTextHide"     : "收起按钮文字",
                "btnMultiOkText"     : "多选确认文字",
                "btnMultiCancelText" : "多选取消文字",
                "moreItemsMode"      : "更多选项模式",
                "fim_auto"   : "自动",
                "fim_always" : "总是",
                "fim_never"  : "从不",
                "btnFldMoreText"     : "更多选项文字",
                "btnFldLessText"     : "更少选项文字",
                "fld_name_tip" : "过滤字段名即参数名，主要是看你要访问的数据接口能接受什么样的参数，如果你实在搞不清要写什么，请联系你的数据接口提供者，他/她应该会告诉你一切",
                "fld_text_tip" : "本过滤字段显示给用户看的文字，起的帅一点哦 ^_^",
                "fld_multi" : "可多选",
                "fld_hide"  : "折叠",
                "fld_hide_tip" : "整个控件所有的折叠的过滤项会默认隐藏起来，只显示一个按钮，用户点击才会显示出来",
                "fld_item_add" : "添加选项",
                "fld_item_edit" : "编辑选项",
                "fld_item_del" : "删除选项",
                "fld_item_text" : "选项描述",
                "fld_item_text_tip" : "每个选项实际上就是字段值的一种约束。起一个人类比较容易懂的名字吧，你的用户会看到这个",
                "fld_item_type" : "选项类型",
                "fld_item_tp_string" : "普通值",
                "fld_item_tp_number_range" : "数字范围",
                "fld_item_tp_data_range"   : "日期范围",
                "fld_item_value" : "选项值",

            },
            "sorter" : {
                "name"  : "排序条件",
                "tip"   : "与 '动态数据' 控件联合使用，可以为数据接口提供排序参数",
                "icon"  : '<i class="zmdi zmdi-sort-asc"></i>',
                "add"   : "添加新排序字段",
                "edit"  : "编辑排序字段",
                "del"   : "移除当前排序字段",
                "empty" : "排序器没有设置内容",
                "fld_name_tip" : "排序字段名即参数名，主要是看你要访问的数据接口能接受什么样的参数，如果你实在搞不清要写什么，请联系你的数据接口提供者，他/她应该会告诉你一切",
                "fld_text_tip" : "本排序字段显示给用户看的文字，起的帅一点哦 ^_^",
                "fld_modify"    : "可修改",
                "fld_modify_tip"  : "最终用户是否能修改排序方向",
                "fld_order"     : "顺序",                
                "fld_or_asc"    : "升序",
                "fld_or_desc"   : "降序",
                "fld_or_asc_icon"  : '<i class="zmdi zmdi-sort-amount-asc"></i>',
                "fld_or_desc_icon" : '<i class="zmdi zmdi-sort-amount-desc"></i>',
                "fld_order_tip" : "升序(ASC):即从小到大，降序(DESC):即从大到小",
                "fld_item_add"  : "添加固定排序项",
                "fld_item_edit" : "编辑固定排序选项",
                "fld_item_del"  : "删除固定排序选项",
                "fld_item_name" : "选项字段",
                "fld_item_name_tip" : "当用户选择了本排序项后，您还可以添加一些固定的排序项与本字段一起生效。这里你需要给出您的固定排序项字段名，用户不会看到这个名字，请符合您的数据接口的参数规范",
            },
            "pager" : {
                "name"  : "分页条",
                "tip"   : "与 '动态数据' 控件联合使用，可以为数据接口提供分页参数",
                "icon"  : '<i class="zmdi zmdi-n-3-square"></i>',
                "t_button"  : '<i class="zmdi zmdi-n-1-square"></i> 按钮',
                "t_brief"   : '<i class="zmdi zmdi-info-outline"></i> 信息',
                "pagerType"   : "类型",
                "type_button" : "按钮",
                "type_jumper" : "跳转",
                "free_jump"   : "自由跳转",
                "max_bar_nb"  : "最多按钮个数",
                "show_first_last" : "首尾按钮",
                "show_prev_next"  : "前后按钮",
                "dft_pgsz" : "页大小",
                "dft_pgsz_tip" : "一页最多显示多少数据。必须大于 1",
                "btn_first" : "首页文字",
                "btn_prev"  : "前页文字",
                "btn_next"  : "后页文字",
                "btn_last"  : "末页文字",
                "show_brief" : "显示信息",
                "brief_text" : "信息文字",
                "brief_text_tip" : "你可以用 '{{关键字}}' 组织文本。pn 表示当前页码, pgnb 表示总共的页数, sum 表示一共有多少数据, pgsz 为你设置的页大小",
                "brief_dft" : "第 {{pn}} 页，共 {{pgnb}}页, {{sum}} 条记录"
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