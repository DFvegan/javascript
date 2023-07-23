/* 
//利用构造函数创建对象
function UIGoods(g) {
    this.data = g;
    this.choose = 0;
    // this.totalPrice = 0;//数据冗余【当上面数据发生变化时候下面的数据也会发生变化】
}
//获取总价
UIGoods.prototype.getTotalPrice = function () {
    return this.data.price * this.choose;
};
//是否选中此件商品
UIGoods.prototype.isChoose = function () {
    return this.choose > 0; //封装判断布尔值
};
 */

//es6创建类【单件商品数据】
class UIGoods {
    constructor(g) {
        this.data = g;
        this.choose = 0;
    }
    getTotalPrice() {
        return this.data.price * this.choose;
    }
    isChoose() {
        return this.choose > 0;
    }
    // 选择数量+1
    increase() {
        this.choose++;
    }
    //选择数量-1
    decrease() {
        if (this.choose === 0) {
            return;
        }
        this.choose--;
    }
}

//整个界面的数据
class UIData {
    constructor() {
        var uiGoods = [];
        for (var i = 0; i < goods.length; i++) {
            var uig = new UIGoods(goods[i]);
            uiGoods.push(uig);
        }
        this.uiGoods = uiGoods;
        this.deliveryThreshold = 30; //起送费【硬数据】
        this.deliveryPrice = 5; //配费
    }
    getTotalPrice() {
        var sum = 0;
        for (var i = 0; i < this.uiGoods.length; i++) {
            var g = this.uiGoods[i];
            sum += g.getTotalPrice();
        }
        return sum;
    }
    //面向对象封装
    increase(index) {
        this.uiGoods[index].increase();
    }
    decrease(index) {
        this.uiGoods[index].decrease();
    }
    //得到总共的选择数量
    getTotalChooseNumber() {
        var sum = 0;
        for (var i = 0; i < this.uiGoods.length; i++) {
            sum += this.uiGoods[i].choose;
        }
        return sum;
    }
    //查看有没有东西在购物车
    hasGoodsInCar() {
        return this.getTotalChooseNumber() > 0;
    }
    //是不是跨域配送门槛
    isCroseDeliveryThreshold() {
        return this.getTotalPrice() >= this.deliveryThreshold;
    }
    isChoose(index) {
        return this.uiGoods[index].isChoose();
    }
}
// var ui = new UIData();

//整个界面
class UI {
    constructor() {
        this.uiData = new UIData();
        this.doms = {
            goodsContainer: document.querySelector(".goods-list"),
            deleveryPrice: document.querySelector(".footer-car-tip"),
            footerPay: document.querySelector(".footer-pay"),
            footerPayInnerSpan: document.querySelector(".footer-pay span"),
            totalPrice: document.querySelector(".footer-car-total"),
            car: document.querySelector(".footer-car"),
            badge: document.querySelector(".footer-car-badge"),
        };
        var carRect = this.doms.car.getBoundingClientRect();
        //目标地址如果不会变情况下就放在一开始
        var jumpTarget = {
            x: carRect.left + carRect.width / 2,
            y: carRect.top + carRect.height / 5,
        };
        this.jumpTarget = jumpTarget;
        this.createHTML();
        this.updataFooter();
        this.listenEvent();
    }

    //监听动画结束事件
    listenEvent() {
        //当动画完成之后取消这个动画css
        this.doms.car.addEventListener("animationend", function () {
            this.classList.remove("animate"); //this指向当前监听的元素
        });
    }

    //根据数据进行创建商品列表元素
    createHTML() {
        // 1.生成html字符串【执行效率低，开发效率高】、
        var html = "";
        for (var i = 0; i < this.uiData.uiGoods.length; i++) {
            var g = this.uiData.uiGoods[i];
            html += `<div class="goods-item">
      <img src="${g.data.pic}" alt="" class="goods-pic">
      <div class="goods-info">
        <h2 class="goods-title">${g.data.title}</h2>
        <p class="goods-desc">${g.data.desc}</p>
        <p class="goods-sell">
          <span>月售 ${g.data.sellNumber}</span>
          <span>好评率${g.data.favorRate}%</span>
        </p>
        <div class="goods-confirm">
          <p class="goods-price">
            <span class="goods-price-unit">￥</span>
            <span>${g.data.price}</span>
          </p>
          <div class="goods-btns">
            <i index="${i}" class="iconfont i-jianhao"></i>
            <span>${g.choose}</span>
            <i index="${i}" class="iconfont i-jiajianzujianjiahao"></i>
          </div>
        </div>
      </div>
    </div>`;
        }
        this.doms.goodsContainer.innerHTML = html;
        // 2.一个一个创建元素【执行效率高，开发效率低】
    }
    increase(index) {
        this.uiData.increase(index);
        this.updateGoodsItem(index);
        this.updataFooter();
        this.jump(index);
    }
    decrease(index) {
        this.uiData.decrease(index);
        this.updateGoodsItem(index);
        this.updataFooter();
    }
    // 更新某个商品的显示状态
    updateGoodsItem(index) {
        var goodsDOM = this.doms.goodsContainer.children[index];
        // console.log(goodsDOM);
        if (this.uiData.isChoose(index)) {
            goodsDOM.classList.add("active");
        } else {
            goodsDOM.classList.remove("active");
        }
        var span = goodsDOM.querySelector(".goods-btns span");
        span.textContent = this.uiData.uiGoods[index].choose;
    }

    //更新页脚
    updataFooter() {
        var total = this.uiData.getTotalPrice(); //总价

        //得到配送费和样式
        this.doms.deleveryPrice.textContent = `配送费为￥${this.uiData.deliveryPrice}`;
        if (this.uiData.isCroseDeliveryThreshold()) {
            //判断当前数据是否可以起送
            this.doms.footerPay.classList.add("active");
        } else {
            this.doms.footerPay.classList.remove("active");
            //如果没有到达总价还差多少
            var dis = this.uiData.deliveryThreshold - total;
            dis = Math.round(dis);
            this.doms.footerPayInnerSpan.textContent = `还差￥${dis}元起送`;
        }

        //总价
        this.doms.totalPrice.textContent = total;
        //购物车样式状态
        if (this.uiData.hasGoodsInCar()) {
            this.doms.car.classList.add("active");
        } else {
            this.doms.car.classList.remove("active");
        }
        //获取购物车数量
        this.doms.badge.textContent = this.uiData.getTotalChooseNumber();
    }

    //购物车函数
    carAnimate() {
        this.doms.car.classList.add("animate");
    }

    //抛物线
    jump(index) {
        //起始坐标的变化
        var btnAdd = this.doms.goodsContainer.children[index].querySelector(
            ".i-jiajianzujianjiahao"
        );
        var rect = btnAdd.getBoundingClientRect();
        var start = {
            x: rect.left,
            y: rect.top,
        };
        // 开始跳
        var div = document.createElement("div");
        div.className = "add-to-car";
        var i = document.createElement("i");
        i.className = "iconfont i-jiajianzujianjiahao";
        //设置初始位置
        div.style.transform = `translateX(${start.x}px)`;
        i.style.transform = `translateY(${start.y}px)`;
        div.appendChild(i);
        document.body.appendChild(div);
        //强行渲染
        div.clientWidth;

        //设置结束位置
        div.style.transform = `translateX(${this.jumpTarget.x}px`;
        i.style.transform = `translateY(${this.jumpTarget.y}px)`;

        // 过渡结束
        //事件冒泡i
        var that = this;
        div.addEventListener(
            "transitionend",
            function () {
                // console.log("过度结束");
                div.remove("div");
                that.carAnimate();
            },
            {
                once: true,
            }
        );
    }
}
var ui = new UI();

//事件
ui.doms.goodsContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("i-jiajianzujianjiahao")) {
        // console.log("加号");
        var index = +e.target.getAttribute("index");
        ui.increase(index);
    } else if (e.target.classList.contains("i-jianhao")) {
        console.log("减号");
        var index = +e.target.getAttribute("index");
        ui.decrease(index);
    }
});
