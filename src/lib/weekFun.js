import moment from 'moment'

const weeks = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const getWeek = function (t, day, format) {
  let m = null
  if (format) {
    m = moment(day, format)
  } else {
    m = moment(day)
  }
  return m.format('YYYY-MM-DD') + ' ' + t(weeks[m.weekday()])
}
const weekFun = {weeks: weeks, GetWeek: getWeek}

export default weekFun
