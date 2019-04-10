$(function () {
    $('.special.cards .image').dimmer({
        on: 'hover'
    });
    $('.ui.accordion').accordion();
    var cartItems = 0;
    //add Product to cart
    $('.add.product.button').click(function () {
        var snack = JSON.parse($(this).attr('data-product'));
        snack.qty = 1;
        let cart = {};
        if (localStorage['cart']) {
            cart = JSON.parse(localStorage['cart']);
            if (cart[snack.id]) {
                cart[snack.id].qty += 1;
                localStorage["cart"] = JSON.stringify(cart);
            } else {
                cart[snack.id] = snack;
                localStorage["cart"] = JSON.stringify(cart);
            }
            console.log(localStorage["cart"])
        } else {
            cart[snack.id] = snack;
            localStorage['cart'] = JSON.stringify(cart);
        }

        if (!$('.green.corner.circle').length) {
            $('.cart.item .icons').append(`<i class="top right green corner circle icon">1</i>`);
        } else {
            var snackCnt = parseInt($('.cart.item .icons .green.circle.icon').html()) + 1;
            $('.cart.item .icons .green.circle.icon').html(snackCnt);
        }

    });
    $('.cart.item').click(function () {
        if (localStorage['cart']) {
            var cart = JSON.parse(localStorage['cart']);
            var total = 0;
            $('.snack.list').html(template);
            for (var key in cart) {
                if (cart.hasOwnProperty(key)) {
                    var template = `
                    <div class="item">
                        <img class="ui avatar image" src="${cart[key].img}">
                        <div class="content">
                            <a class="header">${cart[key].name}</a>
                            <div class="description">${cart[key].qty} @ $${cart[key].price}</div>
                        </div>
                        <div class="right floated content">
                            <div class="ui green horizontal label">$${cart[key].price*cart[key].qty}</div>
                        </div>
                    </div> `;
                    $('.snack.list').append(template);
                }
                total += (cart[key].qty * cart[key].price);
            }
            $('.green.total.label').html("$" + total)
            $('.ui.modal').modal('show');
        }
    })
    $('.cancel.button').click(function () {
        localStorage.clear();
        $('.cart.item .icons .green.circle.icon').remove();
        $('.snack.list').html("");
    });
    $('.ui.form').form({
        fields: {
            id: {
                identifier: 'id',
                rules: [{
                    type: 'empty',
                    prompt: 'Enter your ID'
                }]
            },
            name: {
                identifier: 'name',
                rules: [{
                    type: 'empty',
                    prompt: 'Please your name'
                }]
            },
            location: {
                identifier: 'location',
                rules: [{
                    type: 'empty',
                    prompt: 'Please enter your location'
                }]
            }
        },
        onSuccess: function (event, fields) {
            console.log("Successful Form Submission");
            $('.submit.button').addClass("loading");
            var cart = JSON.parse(localStorage['cart']);
            var order = {
                cart: cart,
                customer: fields
            }
            purchase(order)
            return false;
        },
        onFailure: function (event, fields) {
            console.log("Unsuccessful Form Submission");
            return false;
        }
    });

    function cart() {
        if (localStorage['cart']) {
            var cart = JSON.parse(localStorage['cart']);
            var productQty = 0;
            for (var key in cart) {
                if (cart.hasOwnProperty(key)) {
                    console.log(key + " -> " + cart[key].qty);
                }
                console.log(cart[key].qty)
                productQty += parseInt(cart[key].qty);
            }
            if (productQty) {
                $('.cart.item .icons').append(`<i class="top right green corner circle icon">${productQty}</i>`);
            }
        }
    }
    cart();

    function purchase(order) {
        console.log(order.customer)
        $.ajax({
            type: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            url: "./order",
            data: JSON.stringify(order),
            success: function (data) {
                $('.submit.button').removeClass("loading");
                localStorage.clear();
                $('.ui.modal').modal('hide');
                $('.ui.form').form("clear");
                $('.cart.item .icons .green.circle.icon').remove();
                $('.snack.list').html("");
                console.log(data);
            },
            error: function (err) {
                $('.submit.button').removeClass("loading");
                $('.ui.modal').modal('hide');
                console.log(err)
            },
            dataType: "JSON"
        });
    }
});