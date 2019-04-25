import moment from 'moment'

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const getWeek = function (day, format) {
  let m = null
  if (format) {
    m = moment(day, format)
  }
  return m.format('YYYY-MM-DD') + ' ' + weekFun.weeks[m.weekday()]
}
const weekFun = {weeks: weeks, GetWeek: getWeek}

export default weekFun
