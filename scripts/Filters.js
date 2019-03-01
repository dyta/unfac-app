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
  },
  events(objects) {
    return _.filter(objects, function (o) {
      o['title'] = "#" + o['id'] + " - " + o['title'] + " - " + o['customer']
      switch (o['backgroundColor']) {
        case 5:
          o['backgroundColor'] = 'orange'
          break;
        case 4:
          o['backgroundColor'] = 'red'
          break;
        case 3:
          o['backgroundColor'] = 'blue'
          break;
        case 2:
          o['backgroundColor'] = 'gray'
          break;
        case 1:
          o['backgroundColor'] = 'green'
          break;
        default:
          o['backgroundColor'] = 'white'
          o['textColor'] = 'black'
          break;
      }
      return o;
    });
  },
  reportSum(objects) {
    return _.sumBy(objects, function (o) {
      return o.maxVolume * o.workEarn;
    });
  },
  reportIncome(objects) {
    return _.sumBy(objects, function (o) {
      return o.maxVolume * o.workEarn;
    });
  },
  reportIncomeAll(objects, tex) {
    return _.sumBy(objects, function (o) {
      return o.workVolume * o.workEarn * (tex / 100);
    });
  },
  reportIncomeReal(objects, tex) {
    return _.sumBy(objects, function (o) {
      return o.maxVolume * o.workEarn * (tex / 100);
    });
  },
  reportCountWorks(objects) {
    return _.chain(objects)
      .groupBy("workId")
      .map(function (currentItem, i) {
        return i
      })
      .value().length;
  }
};
