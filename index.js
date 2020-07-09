class Editor {
    constructor(id) {
        this.id = id //渲染dom
        this.lastAddress = '' //焦点最后位置
        this.config = [ //菜单配置
            {
                title: 'B',
                name: 'bold'
            },
            {
                title: 'C',
                name: 'foreColor',
                list: [{
                    title: 'blue',
                    val: '#007ACC'
                },
                    {
                        title: 'red',
                        val: '#E21918'
                    },
                    {
                        title: 'green',
                        val: '#1AA15F'
                    }
                ]
            },
            {
                title: 'H',
                name: 'FontSize',
                list: [{
                    title: 'H1',
                    val: '6'
                },
                    {
                        title: 'H2',
                        val: '5'
                    },
                    {
                        title: 'H3',
                        val: '4'
                    },
                    {
                        title: 'H4',
                        val: '3'
                    },
                    {
                        title: 'H5',
                        val: '2'
                    },
                    {
                        title: 'H6',
                        val: '1'
                    }
                ]
            }
        ]
    }

    //创建编辑dom
    createDom() {
        const self = this

        //检验是否传入dom
        if ($(this.id).length === 0) {
            console.log('未传入DOM')
            return;
        }

        //创建菜单 和 编辑区域
        let div_top = $("<div id='div_top'></div>");
        let div_bottom = $("<div id='div_bottom'><div id='area' contenteditable></div></div>");
        $(this.id).append(div_top, div_bottom)

        //生成菜单
        $(this.config).each(function (i, n) {
            var menu = ''
            if (!n.list) {
                menu = `<div class='memu-l'><i class='memu-l-btn' name='${n.name}'>${n.title}</i></div>`
            } else {
                var str = ''
                if (n.name === 'foreColor') {
                    $(n.list).each(function (j, k) {
                        str = str + `<div class='memu-l-list' name='${n.name}' val='${k.val}' ><i class='memu-l-btn' name='${n.name}' val='${k.val}' style='color:${k.val}'>${k.title}</i></div>`
                    })
                } else if (n.name === 'FontSize') {
                    $(n.list).each(function (j, k) {
                        str = str + `<div class='memu-l-list'><${k.title}><i class='memu-l-btn' name='${n.name}' val='${k.val}'>${k.title}</i></${k.title}></div>`
                    })
                }
                menu = `<div class='memu-l'><i class='memu-l-btn' name='${n.name}'>${n.title}</i><div class="memu-l-btn_"> ${str}</div></div>`
                // console.log(i, menu)
            }
            $("#div_top").append(menu)
        })



        //按键 插入dom 记录焦点最后的位置
        $('#area').on('keyup', function (e) {
            self.saveRangeAddress()
        })


        //点击 记录焦点最后的位置
        $('#area').on('click', function () {
            const selection = window.getSelection ? window.getSelection() : document.getSelection()
            if (selection) {
                // console.log('click 保存')
                self.saveRangeAddress()
            }
        })

        //功能
        $('.memu-l-btn').on('click', function (e) {
            //阻止默认事件
            e.preventDefault();
            //设置最后焦点位置
            self.setRangeAddress()
            //执行功能
            self.execCommand($(e.target).attr("name"), false, $(e.target).attr("val"))
            //发生改变后在执行一次保存焦点
            // console.log('memu-l-btn 保存')
            self.saveRangeAddress()
        })
    }

    //编辑插入事件
    execCommand(type, bool, val = null) {
        document.execCommand(type, bool, val);
    }

    // 保存当前焦点位置
    saveRangeAddress() {
        const self = this
        // 获取selection对象 保存焦点
        const selection = window.getSelection ? window.getSelection() : document.getSelection()
        self.lastAddress = selection.getRangeAt(0)
        console.log('保存******', self.lastAddress)
        console.log( self.lastAddress.startContainer.length, self.lastAddress.endOffset)
    }

    // 设置焦点最后所处位置
    setRangeAddress() {
        const self = this
        //清除焦点 还原最后焦点的位置
        const selection = window.getSelection ? window.getSelection() : document.getSelection()
        $('#area').focus()
        //判断是否具有getSelection对象
        if (selection) {
            // 判断是否有焦点最后位置
            if (self.lastAddress) {
                // console.log('存在++ 设置', window.getSelection().getRangeAt(0),self.lastAddress)
                selection.removeAllRanges()
                selection.addRange(self.lastAddress)
            } else {
                // console.log('不存在-- 设置', self.lastAddress)
                // 如果之前没有保存焦点则新建一个
                const content = $('#area')[0]
                const range = document.createRange()
                range.setStart(content, 0)
                range.setEnd(content, 0)
                selection.addRange(range)
                self.lastAddress = range
            }
        } else {
            $('#area').focus()
        }

        // console.log('设置', self.lastAddress)
    }

    //输出代码
    exportHtml() {
        return $('#area').html()
    }

    //渲染
    visibleHtml() {
        console.log(this.exportHtml())
        $('#visible').html(this.exportHtml())
    }

}
