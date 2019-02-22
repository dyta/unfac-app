const _ = require("lodash");

export default {
  SeparateByStatus(objects, key, condition) {
    return _.filter(objects, function (o) {
      if (o[key] === condition) return o;
    });
  },
  SummaryByVolume(objects) {
    return _.sumBy(objects, 'rwVolume');
  },
  sortByActivity(objects) {
    return _.orderBy(objects, 'time', 'desc');
  }
};
