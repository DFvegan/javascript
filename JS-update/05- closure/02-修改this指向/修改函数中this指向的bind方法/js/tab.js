// 定义最大的类
// var that;//可以不用全局变量that
class Tab{
    constructor(id) {//此处的id接收传递进来的参数
        // that = this;
        this.main = document.querySelector(id);
        this.lis = this.main.querySelectorAll('li');
        this.sections = this.main.querySelectorAll('section');
        this.add = this.main.querySelector('.tabadd');
        // li的父元素
        this.ul = this.main.querySelector('.fisrstnav ul:first-child')
        // section的父元素
        this.fsection = this.main.querySelector('.tabscon');
       
        this.init();
    }
    // 1.初始化操作：所有的li添加绑定事件
    init() {
        this.updateNode();
        this.add.onclick = this.addTab.bind(this.add,this);//按钮点击添加效果
        for (var i = 0; i < this.lis.length; i++) {
            // 添加获取索引号
            this.lis[i].index = i;
            // 此处点击之后实现的是切换效果所以应该是调用切换函数，而不是匿名函数
            // 此处如果实现的是点击之后再调用就不需要在调用之后添加小括号
            // bind:第一个this参数表示的还是绑定的元素，第二个参数表示实参作为方法的参数
            this.lis[i].onclick = this.toggleTab.bind(this.lis[i],this);
            //调用删除按钮执行删除效果
            this.remove[i].onclick = this.removeTab.bind(this.remove[i],this);
            this.spans[i].ondblclick = this.editTab;
            this.sections[i].ondblclick = this.editTab;
            // 此处的edit不需要使用
        }
    }
     //动态添加元素，需要重新获取对应的元素
    updateNode() {
         // 更新获取所有的li和section
        this.lis = this.main.querySelectorAll('li');
         this.sections = this.main.querySelectorAll('section');
          // 不断更新方式获取删除按钮
        this.remove = this.main.querySelectorAll('.icon-guanbi')
        //获取所有span
        this.spans = this.main.querySelectorAll('.fisrstnav ul span:first-child')
    }
    // 1.切换功能
    toggleTab(that) {
        // 测试console.log(this.index);
        // 排他思想：实例对象使用清除方法
        that.clearClass();
        // 点击当前按钮：添加样式
        this.className = 'liactive';
        // 当前对应的内容显示(注意this的用法不是指向按钮而是类)
        that.sections[this.index].className = 'conactive';
    };
    // 单独创建一个清除方法
    clearClass() {

        for (var i = 0; i < this.lis.length; i++){
            this.lis[i].className = '';
            this.sections[i].className = '';
        }
    }
   
    // 2.添加功能
    addTab(that) { 
        that.clearClass();
        var random = Math.random();
        // 1.创建li元素和section 元素
        var li = '<li class="liactive"><span>Tab</span><span class="iconfont icon-guanbi"></span> </li>';
        var section = '  <section class="conactive">测试'+random+'</section>';
        // 2. 把这两个元素追加到相应的父元素中
        that.ul.insertAdjacentHTML('beforeend', li);
        that.fsection.insertAdjacentHTML('beforeend', section);
        // 在执行完添加按钮之后再进行添加初始化
        that.init();
    };
    // 3.删除功能
    removeTab(that,e) {
        // 阻止事件冒泡
        e.stopPropagation();
        var index = this.parentNode.index;
        console.log(index);
        //直接使用remove方法删除指定元素
        that.lis[index].remove();
        that.sections[index].remove();
        that.init();
        // 当删除的li不是选择的li时候，删除指定的li，原来选择的li还是保持状态
        if (document.querySelector('.liactive')) return;
        // bug:设置当前的按钮点击删除之后显示当前按钮前一个显示点击状态
        index--;
        //手动调用不需要鼠标触发 （判断是否存在这个li）     
        that.lis[index]&&that.lis[index].click();

     };
    // 4.修改功能
    editTab() { 
        var str = this.innerHTML;//首先获取原先文字
        // 双击文字禁止选中
        window.getSelection ? window.getSelection().removeAllRanges() : document.selection.empty();
        this.innerHTML = '<input type = "text"/>';
        var input = this.children[0];
        input.value = str;
        input.select();//文本框内文字属于选中状态
        // 当离开文本框就把文本框值给span
        input.onblur = function () {
            this.parentNode.innerHTML = this.value;
        };
        //按下回车也可以将文本框内容的值给span 
        input.onkeyup = function (e) {
            if (e.keyCode === 13) {
                //手动调用可直接调用鼠标移除事件
                this.blur();
            }
        }
    };
}
new Tab('#tab');//此处实例化参数是tab栏
