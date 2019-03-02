const _ = require("lodash");

export default {
  package(value) {
    let text = 'Member'
    switch (value) {
      case 2:
        text = 'Silver'
        break;
      case 3:
        text = 'Gold'
        break;
      case 4:
        text = 'Platinum'
        break;
      default:
        break;
    }
    return text
  },
  notificationToBoolean(objects) {
    return _.map(objects, function (o) {
      o.disabled = o.disabled !== 3 ? true : false
      return o;
    });
  },
  notificationToBooleanForWorks(objects) {
    return _.map(objects, function (o) {
      o.workStatus = o.workStatus === 3 || o.workStatus === 3 ? false : true
      return o;
    });
  }
};
