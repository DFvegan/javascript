$(function () {
    // 当点击li不需要执行页面滚动的li的背景改变
    // 节流阀（互斥锁）的使用
    var flag = true;
    // 1.电梯导航显示：滚动到指定位置就会显示侧边栏导航
    // 刷新：bug：滚动出现的导航又隐藏了-- 所以进行封装 
    var reTop = $('.recommend').offset().top;
    toggleTool();//此处位置注意预解析
    function toggleTool() {
        if ($(document).scrollTop() >= reTop){
            $('.fixedtool').fadeIn();
            } else {
                $('.fixedtool').fadeOut();
        };
    }
    $(window).scroll(function () {
        toggleTool();
    // 3.滚动页面左侧的li就会添加一个类名
    // 判断卷上去的距离是不是大于指定子元素距离
        if (flag) {
            $('.floor .w').each(function (i, ele) {
                if ($(document).scrollTop() >= $(ele).offset().top) {
                    $('.fixedtool li').eq(i).addClass('current').siblings().removeClass();
                }
            })
        } 
    })
    // 2.电梯导航点击显示指定位置
    $('.fixedtool li').click(function () {
        // 每次点击之后关闭节流阀
        flag = false;
        // 给每一个li都设置点击事件
        // console.log($(this).index());
        // 设置每次点击要去往的位置
       var current =  $('.floor .w').eq($(this).index()).offset().top;//指定位置就是将要去的位置
        // 页面滚动
        $('body,html').stop().animate({
            scrollTop: current
        }, function () {
            flag = true;
        })
        // 点击之后让当前的li设置背景色：current
        $(this).addClass('current').siblings().removeClass();
    })
   
})