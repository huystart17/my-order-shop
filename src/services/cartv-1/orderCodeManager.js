/**
 * Created by huy on 4/17/17.
 */

function getDaycode() {
  let d = new Date();
  return `${d.getDate()}-${d.getMonth()+1}-${d.getYear()-100}-`;

};


let orderCodeManager = {
  storedCode: new Map(),
  makeOneCode: function () {
    let orderKey = getDaycode();

    if (orderCodeManager.storedCode.has(orderKey)) {
      let newCode = orderKey + (orderCodeManager.storedCode.get(orderKey).length+1);

      orderCodeManager.storedCode.get(orderKey).push(newCode);
      // console.log(newCode);
      return newCode;

    } else {
      let newCode = getDaycode() + 0;
      orderCodeManager.storedCode.set(getDaycode(), []);
      orderCodeManager.storedCode.get(getDaycode()).push(newCode);
      // console.log(newCode);
      // console.log(orderCodeManager.storedCode.get(getDaycode()));
      return newCode;
    }
  }

};

module.exports = orderCodeManager;
