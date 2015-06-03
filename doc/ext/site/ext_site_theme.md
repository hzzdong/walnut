---
title:网站的主题
author:zozoh
tags:
- 系统
- 扩展
- 网站
---

# 什么是网站的主题

网站的主题包括这个网站的:

1. 界面样式
2. 布局
3. 动态交互效果
4. 组件

换句话说，就是包括一个网站主要数据之外一切设置。 你们也许会奇怪，主题也会包括组件？
是的，这里的 *主题* 不是 *皮肤*，
一些交互效果甚至与服务器的交互逻辑是由这个主题内置的组件提供的。
当然你可以在自己的站点覆盖掉 *主题* 提供的任意功能，从而形成自己新的主题。

因此主题是有继承关系的。

# 主题目录

```
%mysite%
    theme                   # 主题
        current -> blacksky     # 当前主题链接至某一个备选主题
        blacksky                # 备选主题, 元数据 ptheme 指向自己从什么主题继承
            #.......................................................
            js                  # 主题用到的 JS 文件
                blacksky.js     # 可以随意添加任何 JS 文件
                                # 后面会详细讲讲详细的约定
            #.......................................................
            css                 # 主题用到的样式表
                bs_core.css     # 可以随意添加任何 CSS 文件
                bs_ext.css      # 名字无所谓，在《网站的CSS规范》有详细介绍
            #.......................................................
            template            # 主题的模板目录
                home            # 任何模板都是一个目录
                    dom.html    # [必须] 模板的 DOM 结构
                                # 在《网站的DOM规范》有详细介绍
                page            
                    dom.html    # 模板的任何 js/css 都会被链接到最终网页
                    page.css    # 你可以随意制定你的 JS 和 css
                    page.js     # 在《网站的JS规范》有详细介绍
            #.......................................................
            lib                 # 主题的组件目录，与模板目录同理
                menu            # 一个组件就是一个目录，其中包括
                    dom.html    # [必须] 组件的 HTML 片段
                    main.js     # 随意添加 js/css 文件
                labels          # 因此，每个组件都可能会有很多不同
                    dom.html
                    abc.js
                links
                    dom.html
                    links.css
            #.......................................................
            i18n                # 主题的国际化语言包目录
                zh_CN           # 简体中文，文件内容就是一个 properties
                en_US           # 也就是说，是等号分隔的名值对，一行一个
                                # 在《网站的本地化规范》有详细介绍
            #.......................................................
```


# 扩展阅读

* [网站的DOM规范][dom]
* [网站的JS规范][js]
* [网站的CSS规范][css]
* [网站的本地化规范][i18n]
* [网站的布局][theme]
* [网站的组件编写规范][lib]


[theme]:  ext_site_theme.md      "网站的主题"
[dom]:    ext_site_rule_dom.md   "网站的DOM规范"
[js]:     ext_site_rule_js.md    "网站的JS规范"
[css]:    ext_site_rule_css.md   "网站的CSS规范"
[i18n]:   ext_site_rule_i18n.md  "网站的本地化规范"
[layout]: ext_site_layout.md     "网站的布局"
[lib]:    ext_site_lib.md        "网站的组件编写规范"

