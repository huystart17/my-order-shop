/**
 * Created by huy on 4/8/17.
 */
const orderCodeManager = require('./orderCodeManager');

//product prototype
let product = function (ordPrd) {
    this.shop = ordPrd.shop;

    this.itemId = ordPrd.itemId;
    this.itemName = ordPrd.itemName;
    this.itemLink = ordPrd.itemLink;
    this.itemImg = ordPrd.itemImg;
    this.itemPrc = ordPrd.itemPrc;
    this.itemQty = ordPrd.itemQty;

    this.msg = ordPrd.msg;

    this.itemDetail = ordPrd.itemDetail;

};


// cart prototype
let cartPrototype = function (c) {
    //Key field dùng để phân loại cart trong cache
    this.sessionId = c.sessionId;
    this.userId = c.userId || "";
    this.orderCode = orderCodeManager.makeOneCode();

    this.address = {};
    this.userName = "";
    this.phone = "";

    this.message = "";
    this.historyLog = "";
    this.isSubmited = false;
    this.payBy = "";

    this.products = [];

};

cartPrototype.prototype.update = function (cart) {
    Object.assign(this, cart);
}


let carts = {
    list: [],


    // thêm sản phẩm vào giỏ hàng theo session id
    add_to_cart: function (cart, ordPrd) {
        let currentCart
        if (cart.sessionId && carts.list.length > 0) {
            currentCart = carts.list.find((c) => (c.sessionId == cart.sessionId && c.isSubmited == false));
        }
        if (typeof (currentCart) != "undefined") {
            currentCart.products.push(new product(ordPrd))
        } else {
            let newCart = new cartPrototype(cart);
            newCart.products.push(new product(ordPrd));
            carts.list.push(newCart);
        }
    },

//cập nhập cart theo việc thay đổi quantity và xóa bỏ sản phẩm dữ liệu trả về lả cart đã đc sửa
    update_cart: function (cart) {
        let currentCart = carts.list.find((c) => (c.sessionId == cart.sessionId && c.isSubmited == false));
        if (typeof (currentCart) != "undefined") {
            currentCart.update(cart);
            return currentCart;
        } else {
            console.log("cant update because, we dont have this cart in memory");
            return "cant update because, we dont have this cart in memory"
        }
    },
    get_my_cart: function (sId) {

        let myCart = carts.list.find((c) => c.sessionId == sId && c.isSubmited == false);
        if (typeof (myCart) != 'undefined') {
            return myCart;
        } else {
            return "Your cart is empty";
        }
    },
    clean_cart: function () {
        let newList = []
        this.list.map(function (c) {
            if (c.isSubmited == false) {
                newList.push(c)
            }
        })
        this.list = newList
    },
    put_to_db: function (orderCode) {
        let cartSaved = this.list.find(c => c.orderCode == orderCode);
        cartSaved.isSubmited = true;
        this.clean_cart();

    }
};


module.exports = carts;
