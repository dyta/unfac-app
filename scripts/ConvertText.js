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
  }
};
