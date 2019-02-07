import moment from 'moment'

import 'moment/locale/th'

export default (ctx, inject) => {
  ctx.$moment = moment
  inject('moment', moment)
}
