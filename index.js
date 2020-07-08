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
                menu = `<div class='memu-l'><a href="#" class='memu-l-btn' name='${n.name}'>${n.title}</a></div>`
            } else {
                var str = ''
                if (n.name === 'foreColor') {
                    $(n.list).each(function (j, k) {
                        str = str + `<div class='memu-l-list' name='${n.name}' val='${k.val}' ><a  href="#" name='${n.name}' val='${k.val}' style='color:${k.val}'>${k.title}</a></div>`
                    })
                } else if (n.name === 'FontSize') {
                    $(n.list).each(function (j, k) {
                        str = str + `<div class='memu-l-list'><${k.title}><a  href="#" name='${n.name}' val='${k.val}'>${k.title}</a></${k.title}></div>`
                    })
                }
                menu = `<div class='memu-l'><a href="#" class='memu-l-btn' name='${n.name}'>${n.title}</a><div class="memu-l-btn_"> ${str}</div></div>`
                // console.log(i, menu)
            }
            $("#div_top").append(menu)
        })

        //阻止回车保留上一行格式 
        $('#area').on('keydown', function (e) {
            let keycode = (e.keyCode ? e.keyCode : e.which);
            console.log(keycode)
            if (keycode === 13) { //是否敲了回车键
                console.log('点击了回车')
                e.preventDefault();
            }
        })

        //按键 记录焦点最后的位置
        $('#area').on('keyup', function (e) {
            let keycode = (e.keyCode ? e.keyCode : e.which);
            if (keycode === 13) { //是否敲了回车键
                self.insertDom()
            }
            self.saveRangeAddress()
        })

        //点击 记录焦点最后的位置
        $('#area').on('click', function () {
            self.saveRangeAddress()
        })

        //功能
        $('a').on('click', function (e) {
            //防止直接点击按钮未保存焦点位置
            // self.lastAddress !== '' ? self.saveRangeAddress() : ''
            //设置最后焦点位置
            self.setRangeAddress()
            self.execCommand($(e.target).attr("name"), false, $(e.target).attr("val"))
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
        console.log('保存', self.lastAddress)
    }

    // 设置焦点最后所处位置
    setRangeAddress() {
        const self = this
        //清除焦点 还原最后焦点的位置
        const selection = window.getSelection ? window.getSelection() : document.getSelection()
        selection.removeAllRanges()

        if (selection) {
            // 判断是否有焦点最后位置
            if (self.lastAddress) {
                console.log('存在++',self.lastAddress)
                selection.addRange(self.lastAddress)
            } else {
                console.log('不存在--',self.lastAddress)
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

        console.log('设置', self.lastAddress)
    }

    //回车插入无格式标签
    insertDom(){
        console.log('回车事件')
        let p = '<p><br/></p>'
        $("#area").append(p)
         //设置输入焦点
        var active =  $($("#area").children(':last-child')[0]).children(':first-child')[0]
        console.log(active)
        var range = document.createRange();
        range.selectNodeContents(active);
        range.collapse(false);
        range.setEndAfter(active);
        range.setStartAfter(active);
        this.lastAddress = range;
        this.setRangeAddress();
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