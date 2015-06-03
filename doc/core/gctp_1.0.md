---
title:GCTP1.0
author:zozoh
- 系统
- 协议
- WTP
---

# 什么是 GCTP

*GCTP* 即 **General Control Text Protocol** (通用控制文本协议)。 
是客户端与服务器通过文本流的方式进行交互的约定。

```
         +-- write >>>> [in] >>>>  read --+
         |                                |
Client --+              async             +-- Server
         |                                |
         +-- read  <<<< [out] <<<< write -+
```

* 客户端发起的是输入流(`GCTP.in`)，服务器端发起的为输出流(`GCTP.out`)。
* 这两个流是异步的
    - 因此当服务器端输出时，客户端可以通过输入流对其进行干预
    - 比如终止输出
* 无论输入流还是输出流，其内容都为纯文本，发送和接收都以行为单位
    -  行 : 一行数据
    -  块 : 多行数据，以某特殊行为开始和结束
    -  组 : 多块/行数据，以某特殊行位开始，之后是一个个块/行最后以某特殊行为结束

比如:

    # 流中，`#` 开头的行是注释行，应该被读取者忽略
    #------------------------------------------- 行
    # `>:` 表示一行，会一直读到 \n 考虑引号和逃逸字符
    >: ls -l 
    #
    # 当然，可以为行声明特殊的类型。行不需要特殊选项和结束符
    # 因为行数据通常很简单，比如下面的例子就是类型为 "I" 的行
    #
    >:I: Today is a good day ^_^
    #------------------------------------------- 块
    # `@:` 开始的行表示块，三个字段分别为 
    #   块标识:块结束码:块类型:块选项
    @:45a399810432788ae:json:{..}
    {
        x:100, y:980
    }
    @:~45a399810432788ae     # 块结束行
    #------------------------------------------- 组
    # `=:` 表示`组`。组里可以包括多个 `行` 或 `块`，并且，组
    # 头部为所有的`块`提供了默认选项。这样当组包括海量的同类型块时
    # 可以节省可观的字节
    #
    #   组标识:默认组ID:默认组块类型:默认组块选项
    #
    =:a9dd43a2ecs8b53720:json:{..}
    #..................................... 块[0]
    @:                       # 组块开头，不需要块ID和类型，默认用组的
    {
        name : "xiaobai", 
        type:"dog"
    }
    @:~a9dd43a2ecs8b53720    # 组块结束行
    #..................................... 块[1]
    @:-:info                 # 指定了其他类型的组块行
    这里是一行
    一行的信息
    @:~a9dd43a2ecs8b53720    # `:-:` 表示块结束码用组默认的
    > 
    #..................................... 块[2]
    @:                       # 下一个组块开始
    {
        name : "xiaohei", 
        type:"cat"
    }
    @:~a9dd43a2ecs8b53720
    =:~
    #------------------------------------------- 流结束
    # 这个特殊行告诉流的读取者，有输入者断言，这个流已经不会再有任何内容了
    !:STREAM-END

* 无论 *组(GROUP)*，*块(BLOCK)* 还是 *行(LINE)* 都被称为`GctpItem`
* 无论 `GCTP.in` 还是 `GCTP.out`，读取还是写入都是以 *GctpItem* 为单位的
* 如果 *GctpItem* 的类型是 *组*，因为 *组* 的内容可以是无限大，因此实现者只能返回组头
    - 实现者允许调用者传入组头，并获取 1-n 个组
    - 如果遇到组尾，调用再用这个组头获取，将一直返回 null
    - 如果没有遇到组尾，调用者想再获取 `GctpItem`，也一直返回 null

> 无论对于 *组(GROUP)*，*块(BLOCK)* 还是 *行(LINE)*， 考虑到输入输出的业务特点，将会有更详细的业务约定。
下面的章节我们将依据不同的场景来详细的说明一下这些约定。

# 输入流 `GCTP.in`

客户端通过输入流可以让服务器执行命令，或者是回答服务器给出的表单输入

## 命令输入

    >: ls -l         # 执行命令 'ls -l'

## 提交表单

    @:45a399810432788ae:submit
    {
        // ... 用户填写的表单项，具体细节请看后面关于表单的专门介绍
    }
    @:~45a399810432788ae

# 输出流 `GCTP.out`

服务器端通过输出流来控制客户端的逻辑行为。

## 信息

    >:I: 这里是一行数据，一直遇到 `\n` 才算本行结束

**或者**

    @:45a399810432788ae:I
    这里是一行
    一行的信息
    @:~45a399810432788ae

## 警告

    >:W: 这里是一行数据，一直遇到 `\n` 才算本行结束

**或者**

    @:45a399810432788ae:W
    这里是一行
    一行的信息
    @:~45a399810432788ae

## 文本

类型为空，就代表本行或块是文本类型的

    >: 这里是一行数据，一直遇到 `\n` 才算本行结束

**或者**

    @:45a399810432788ae:
    这里是一行
    一行的信息
    @:~45a399810432788ae

## 日志

日志组默认内部的所有 *GctpItem* 的类型都是空，即表示 *文本*

    =:7823cda1091d8acae8:
    >: 这里是一行
    >: 一行的日志
    @:
    当然也可以是某些块
    @:~7823cda1091d8acae8
    >: 块和行可以混排在组里
    =:~

## HTML

    @:45a399810432788ae:html
    <p>
    这里是一组 HTML 片段
    </p>
    @:~45a399810432788ae

## JSON

    >:json: {x:100,y:99}

**或者**

    @:45a399810432788ae:json
    {
        // ...一个 JSON 对象的内容
    }
    @:~45a399810432788ae

## 上传

向客户端要求上传一个或多个文件:

    @:45a399810432788ae:upload
    {
        target : {..},        // 上传的目标，一个 OBJ 对象
        multi  : true,        // 多个文件，dest 表示一个目录
        name   : "$REGEX",    // 名称的正则表达式校验
        type   : "$REGEX",    // 类型的校验
        mime   : "$REGEX"     // 内容类型的校验
    }
    @:~45a399810432788ae

## 表单

表单是一种特殊的 JSON，他用来向客户端询问一些数据

    @:45a399810432788ae:form
    {
        name : {..//一个符合 ASK 约定的JSON字符串..},
        age  : {..//一个符合 ASK 约定的JSON字符串..},
        ...
    }
    @:~45a399810432788ae

客户端收到表单后，必须向输入流写入 `submit`，因为服务器端这时候一定在等着从标准输入流里获取

## 对象

对象是一种特殊的 JSON

    @:45a399810432788ae:obj:{mode:'long|sort',fields:'REGEX'}
    {
        // ...  Obj 的字段们 ...
    }
    @:~45a399810432788ae

* fields 字段默认 `/^id|ow|lm|nm$/` 仅当 **long** 时有效`

# 表单的约定

表单由下列格式构成

    {
        name : {..一个符合 ASK 约定的JSON字符串..}
        age  : {..一个符合 ASK 约定的JSON字符串..}
        ...
    }

## ASK约定

    {
        name    : "数据的名称"  // [可选]
        // 数据类型
        type    : "STR|ENUM|ARRAY|INT|FLOAT|BOOL|FILE",
        // 显示类型:
        //  - input    : 单行文本输入
        //  - textarea : 多行文本输入
        //  - range    : 数值区间
        //  - list     : array 为多选，其他为单选
        //  - drop     : array 为多选，其他为单选
        display  : "input|textarea|password|..",
        prompt   : "提示符",
        errorTip : "输入如果出错，给出的提示信息",
        data     : "根据 dtype 的不同，给出的约束条件"
    }

## type==STR

    ..
    data : "![a-zA-Z0-9]+"  // `!` 开头表示正则表达式取反
    ..

## type==ENUM,type==ARRAY

这两个的 **data** 段都一样，都表一个列表，不过一个为单选(*enum*)一个位多选(*array*)。

    ..
    data : [
        {text:"显示文字", value:89},
        "也可以是个字符串，那么value就是字符串本身",
        97,    // 当然也能是个数字
    ]
    ..

## type==INT,type==FLOAT

    ..
    data : "(45, 79]"  // 支持开闭区间，以及 `(45,)` 的写法
                       // 实际上 `(45,)` 与 `(45,]` 是一样的
    ..

## type==BOOL

    ..
    data : {
        yes: "true,yes,on",  // 默认为 "true,yes,on"
        no : "false,no,off"  // 默认为 "false,no,off"
    }
    ..

## type==FILE

    {
        type    : "FILE",
        ps      : "请输入您的头像:",
        etip    : "只能是 jpg 图片，不能大于3M",
        data    : {
            dest  : "ea09..3c4f",    // 上传的目标，默认当前的目录 $PWD
            mode  : "write|append",  // *write|append 追加还是覆盖
            multi : true,            // 多个文件，dest 表示一个目录
            name  : "$REGEX",
            type  : "$REGEX",
            mime  : "$REGEX"
        }
    }

客户端将会执行文件上传，上传完毕后，给出的 *answer* 为
        
    {
        ...
        $NAME : ["89ac..45a1"]
        ...
    }

服务器会对这个 *answer* 进行自己的后续处理