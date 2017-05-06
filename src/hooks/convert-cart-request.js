'use strict';

// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

module.exports = function (options = {}) { // eslint-disable-line no-unused-vars
  return function (hook) {
    // Hooks can either return nothing or a promise
    // that resolves with the `hook` object for asynchronous operations
    let ordPrd = hook.data;
    //console.log(hook.data);
    let prd = {
      shop: ordPrd.seller_id,

      itemId: ordPrd.item_id,
      itemName: ordPrd.item_title,
      itemLink: ordPrd.item_link,
      itemImg: ordPrd.item_image,
      itemPrc: ordPrd.item_price,
      itemQty: ordPrd.quantity,

      msg: ordPrd.comment,

      itemDetail: ordPrd


    };

    let cart = {
      sessionId: hook.params.mySid,
      //userId: "",

      userId : "",
      prd: [],
    };
    hook.data={
      prd : prd,
      cart : cart
    };

    hook.convertCartRequest = true;

    return Promise.resolve(hook);
  };
};
