(function ($z) {
    $z.declare(['zui', 'wn/util'], function (ZUI, Wn) {
        return ZUI.def("ui.wjson", {
            pkg: "wjson",
            vue: true,
            css: "ui/wedit/wedit.css", // 依赖wedit的css
            $wj_main: null,
            $wj_vm: null,
            events: {
                "click .ui-wjson-save": function () {
                    this.write_obj();
                },
                "click .ui-wjson-reload": function () {
                    this.read_obj();
                }
            },
            redraw: function () {
                this.$wj_main = this.arena.find('.ui-wjson-main');
                var mid = "wjson-id-" + Math.floor((Math.random() * 1000000) + 1); // $z.guid();
                this.$wj_main.attr('id', mid);
                // 注册控件
                Vue.directive('wjson-tn-edit', {
                    twoWay: true,
                    bind: function () {
                        this.handler = function () {
                            this.set(this.el.innerHTML)
                        }.bind(this);
                        this.el.addEventListener('keyup', this.handler)
                    },
                    update: function (newValue, oldValue) {
                        this.el.innerHTML = newValue || ''
                    },
                    unbind: function () {
                        this.el.removeEventListener('keyup', this.handler)
                    }
                });
                Vue.component('ui-wjson-treenode', {
                    template: '#ui-wjson-template-treenode',
                    props: {
                        model: Object,
                        qkey: String,
                        depth: 0
                    },
                    data: function () {
                        return {}
                    },
                    computed: {
                        isFolder: function () {
                            return this.model.children &&
                                this.model.children.length
                        },
                        isArray: function () {
                            return this.model.type == "array";
                        },
                        isBoolean: function () {
                            return this.model.type == "boolean";
                        },
                        isNumber: function () {
                            return this.model.type == "number";
                        },
                        isString: function () {
                            return this.model.type == "string";
                        },
                        keyEmpty: function () {
                            return !this.model.name;
                        },
                        valEmpty: function () {
                            return !this.model.value;
                        },
                        guessType: function () {

                        },
                        length: function () {
                            if (this.model.type == "object") {
                                return "{" + this.model.children.length + "}";
                            } else {
                                return "[" + this.model.children.length + "]";
                            }
                        },
                        hasValue: function () {
                            if (this.model.value != null || this.model.value != undefined || this.model.value != "") {
                                return true;
                            }
                            return false;
                        },
                        matchKey: function () {
                            if (this.qkey == "") {
                                return false;
                            }
                            return this.model.name.indexOf(this.qkey) != -1;
                        },
                        matchVal: function () {
                            if (this.qkey == "" || !this.hasValue) {
                                return false;
                            }
                            return ("" + this.model.value).indexOf(this.qkey) != -1;
                        }
                    },
                    watch: {
                        'model.value': function (val) {
                            // console.log(this.model.name + ":" + val + "[" + this.valType(val) + "]");
                            this.model.type = this.valType(val);
                        }
                    },
                    methods: {
                        toggle: function () {
                            if (this.isFolder) {
                                this.model.open = !this.model.open;
                            }
                        },
                        showMenu: function () {

                        },
                        valType: function (val) {
                            var vt = "unknow";
                            if (val == "") {
                                vt = "null";
                            }
                            // 判断bool
                            else if (val == "true" || val == "false" || val == "True" || val == "False") {
                                vt = "boolean";
                            }
                            // 整数
                            else if (/^-?[1-9]\d*$/.test(val)) {
                                vt = "number";
                            }
                            // 浮点数
                            else if (/^-?([1-9]\d*.\d+|0.\d+|0?.0+|0)$/.test(val)) {
                                vt = "number";
                            }
                            // 字符串
                            else if (_.isString(val)) {
                                vt = "string";
                            }
                            return vt;
                        }
                    }
                });
                // 初始化页面
                this.$wj_vm = new Vue({
                    el: "#" + mid,
                    data: {
                        // 显示相关
                        showJson: true,
                        sindex: 0,
                        jindex: 0,
                        qkey: "",
                        // 内容相关
                        json: {
                            root: {},
                            tree: {
                                name: "root",
                                type: "object",
                                value: {},
                                children: [],
                                open: true
                            }
                        },
                        source: {
                            lines: [],
                            content: ""
                        }
                    },
                    watch: {
                        "json.root": function (val) {
                            // 转换为字符串
                            this.source.content = $z.toJson(val, null, 2);
                            // 更新tree
                            this.json.tree = this.obj2tree(val);
                            console.log("### JSON ###\n" + $z.toJson(val, null, 2) + "\n");
                            console.log("### TREE ###\n" + $z.toJson(this.json.tree, null, 2) + "\n");
                        },
                        "source.content": function (val) {
                            // TODO 按照 key, value等进行处理， 可以高亮一些一些内容
                            var lines = val.replace(/ /g, "&nbsp;").split("\n");
                            // 最终插入到lines中为html元素
                            this.$set("source.lines", lines);
                        },
                        "showJson": function (val) {
                            if (val) {

                            } else {

                            }
                        }
                    },
                    methods: {
                        // 对象与显示用的tree相互转换
                        obj2tree: function (obj) {
                            var self = this;
                            var tree = {
                                name: "root",
                                value: obj,
                                type: self.valType(obj),
                                open: true,
                                children: []
                            };
                            if (_.isObject(obj) || _.isArray(obj)) {
                                self.js2properties(tree, obj);
                            }
                            else {
                                throw "Not a Json Object";
                            }
                            return tree;
                        },
                        tree2obj: function () {
                            // TODO
                        },
                        // js转换为treenode
                        js2tn: function (parent, key, val) {
                            var self = this;
                            var treeNode = {
                                name: key,
                                value: val,
                                type: self.valType(val)
                            };
                            if (_.isObject(val) || _.isArray(val)) {
                                treeNode.children = [];
                                treeNode.open = true;
                                self.js2properties(treeNode, val);
                            }
                            // 加入到父节点中
                            if (parent.children) {
                                parent.children.push(treeNode);
                            } else {
                                parent.children = [treeNode];
                            }
                        },
                        // 遍历一个js对象或数组
                        js2properties: function (parent, obj) {
                            var self = this;
                            var key, val;
                            if (_.isObject(obj)) {
                                for (key in obj) {
                                    val = obj[key];
                                    self.js2tn(parent, key, val);
                                }
                            } else {
                                for (key = 0; key < obj.length; key++) {
                                    val = obj[key];
                                    self.js2tn(parent, key, val);
                                }
                            }
                        },
                        valType: function (val) {
                            var vt = "unknow";
                            if (_.isNull(val)) {
                                vt = "null";
                            }
                            else if (_.isUndefined(val)) {
                                vt = "undefined";
                            }
                            else if (_.isBoolean(val)) {
                                vt = "boolean";
                            }
                            else if (_.isNumber(val)) {
                                vt = "number";
                            }
                            else if (_.isString(val)) {
                                vt = "string";
                            }
                            else if (_.isArray(val)) {
                                vt = "array";
                            }
                            else if (_.isObject(val)) {
                                vt = "object";
                            }
                            return vt;
                        },
                        // 切换编辑器
                        toogleEditor: function () {
                            this.showJson = !this.showJson;
                        },
                        // 全部展开
                        expandTree: function (tn) {
                            var self = this;
                            var children = tn.children;
                            if (children) {
                                tn.open = true;
                                for (var i = 0; i < children.length; i++) {
                                    var child = tn.children[i];
                                    self.expandTree(child);
                                }
                            }
                        },
                        // 全部折叠
                        collapseTree: function (tn) {
                            var self = this;
                            var children = tn.children;
                            if (children) {
                                tn.open = false;
                                for (var i = 0; i < children.length; i++) {
                                    var child = tn.children[i];
                                    self.collapseTree(child);
                                }
                            }
                        }

                    }
                });
                // 读取对象
                this.read_obj();
            },
            // 读写方法
            write_obj: function () {
                Wn.writeObj(UI, null, this.$wj_vm.source.content);
            },
            read_obj: function () {
                var UI = this;
                Wn.readObj(UI, null, UI.update_content); // TODO 改成funciton 不要直接放UI中的方法
            },
            // 更新内容
            update_content: function (content) {
                var UI = this;
                var json = content;
                if (!content) {
                    // 没内容 ？？？
                    this.load_fail("对象内容为空，无法解析");
                    return;
                }
                if (typeof content == "string") {
                    try {
                        UI.$wj_vm.json.root = $z.fromJson(content);
                    } catch (e) {
                        // 提示这不是一个json格式的文本
                        this.load_fail("对象内容非json格式，解析失败");
                        return;
                    }
                }
                this.update_obj();
            },
            // 更新对象信息
            update_obj: function () {
                var obj = this.app.obj;
                this.arena.find('.ui-wedit-title .ui-tt').text(obj.nm);
                this.arena.find('.ui-wedit-footer').text(obj.ph);
            },
            // 加载对象内容是吧
            load_fail: function (errMsg) {
                // TODO 更友好的提示方式
                alert(errMsg);
            }
        });
    });
})(window.NutzUtil);