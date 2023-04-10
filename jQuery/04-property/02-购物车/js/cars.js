$(function () {
    // 1.全选全不选功能
    // 把全选按钮的状态给三个复选框
    // 时间按可以使用change
    $('.checkall').change(function () {
        // console.log($(this).prop('checked'));
        // 多个复选框和总的选取框获得的就是总的复选框的属性值
        $('.j-checkbox , .checkall').prop('checked', $(this).prop('checked'))
        // -----------------------------------------------------------------
        // 8.点击变化背景色：使用类名修改
        if ($(this).prop('checked')) {
            // 所以商品添加类名
            $('.cart-item').addClass('check-cart-item');
        } else {
            $('.cart-item').removeClass('check-cart-item');
        }
    })

    // ---------------------------------

    // 2.通过复选框设置全选
    $('.j-checkbox').change(function () {
        /* if (被选取小的复选框的个数 === 3) {
            要选中全选框
        }else{
            不选中全选框
        } */
        // console.log($('.j-checkbox:checked').length);
        //  $('.j-checkbox').length所有复选框个数
        if ($('.j-checkbox:checked').length === $('.j-checkbox').length) {
            $('.checkall').prop('checked', true);
        }
        // 单选框背景色变换
        if ($(this).prop('checked')) {
            // 所以商品添加类名
            $(this).parents('.cart-item').addClass('check-cart-item');
        } else {
            $(this).parents('.cart-item').removeClass('check-cart-item');
        }
    });
    // -------------------------------------------
    // 3 .点击添加效果会出现数量上的变化
    // 添加
    $('.increment').click(function () {
        // 当前兄弟文本框的内容
        var n = $(this).siblings('.itxt').val();
        // console.log(n);
        n++;
        $(this).siblings('.itxt').val(n);
        
        // ---------------------------------------------------------------------
        // 4.点击之后的父亲的兄弟小计计算
        // 单价获取
        var p = $(this).parents('.p-num').siblings('.p-price').html();
        // console.log(p);
        p = p.substr(1);
        // console.log(p);
        // 总计计算此处使用小数点保留两位方法
        var price = (p * n).toFixed(2);
        $(this).parents('.p-num').siblings('.p-sum').html('￥' + price);
        getSum();
    })
    // 减少：注意判断是不是0
    $('.decrement').click(function () {
        // 当前兄弟文本框的内容
        var n = $(this).siblings('.itxt').val();
        // console.log(typeof n);//获得是字符串
        if (n == 1) {
            return n;
        }
        // 函数中出现return之后后面的执行函数就不执行
        n--;//隐式计算
        $(this).siblings('.itxt').val(n);
        // 4.点击之后的父亲的兄弟小计计算
        // 单价获取
        // var p = $(this).parent().parent().siblings('.p-price').html();
        var p = $(this).parents('.p-num').siblings('.p-price').html();
        // console.log(p);
        p = p.substr(1);
        // console.log(p);
        // 总计计算
        var price = (p * n).toFixed(2);
        $(this).parents('.p-num').siblings('.p-sum').html('￥' + price);
        getSum();
    })
    // ---------------------------------------------------------

    // 5. 用户修改文本框的值
    $('.itxt').change(function () {
        // 先得到当前文本框的值
        var n = $(this).val();
        // 当前商品的单价
        var p = $(this).parents('.p-num').siblings('.p-price').html();
        p = p.substr(1);
        var price = (p * n).toFixed(2);//保留两位小数
        $(this).parents('.p-num').siblings('.p-sum').html('￥' + price);
        // 用户修改执行以下修改总件数函数
        getSum();
    })
    // ---------------------------------------------------------
    // 6. 总计效果、总额效果
    getSum();//清除初始的总计总额值
    function getSum() {
        // 计算总件数
        var count = 0;
        // 计算总额
        var money = 0;
        $('.itxt').each(function (i, ele) {
            count += parseInt($(ele).val());//获取所有值遍历相加
        })
        $('.amount-sum em').text(count);
        $('.p-sum').each(function (i, ele) {
                money += parseFloat($(ele).text().substr(1));
            });
        $('.price-sum em').text('￥'+money.toFixed(2));
    }
    // ---------------------------------------------------------
    // 7.删除商品模块
    // 每次删除时候都得调用总计和总额函数
    // （1）商品后的删除键
    $('.p-action a').click(function () {
        // 删除当前商品，因为存在隐式迭代：不用循环直接使用
        $(this).parents('.cart-item').remove();//删除当前元素
        getSum();//删除之后计算一次
    })
    // （2）删除选中的商品
    $('.remove-batch').click(function () {
        // 删除的是小的复选框选中的：隐式迭代
        $('.j-checkbox:checked').parents('.cart-item').remove();
        getSum();//删除之后计算一次
    })
    // （3）清空购物车
    $('.clear-all').click(function () {
        // 清除所有(隐式迭代)
        $('.cart-item').remove();
        getSum();//删除之后计算一次
    })
   
    });