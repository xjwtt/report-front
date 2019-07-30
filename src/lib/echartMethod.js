import _ from 'underscore'

const separate60M = function (period, Obj, xData) {
  if (period === '60m') {
    let xGroup = _.groupBy(xData, (v) => {
      return v.substring(0, 10)
    })
    let keys = Object.keys(xGroup)
    if (keys.length > 0) {
      let xGroupLen = xGroup[keys[0]].length
      Obj.xAxis['splitArea'] = {
        show: true,
        interval: xGroupLen - 1,
        areaStyle: {
          shadowColor: 'rgba(255,255,255,0.8)',
          shadowBlur: 10
        }
      }
      let space = function (number, num) {
        let re = number % xGroupLen
        if (re === 0) { // 每天的开始必须显示
          return true
        } else {
          let temp = parseInt(xGroupLen / num)
          if (re < (xGroupLen - 2)) { // 此处用于隔开和下一天的第一个
            for (let i = 0; i <= num; i++) {
              if (re === i * temp) {
                return true
              }
            }
          }
          return false
        }
      }
      if (keys.length === 1) {
        Obj.xAxis.axisLabel['interval'] = 0
      } else if (keys.length <= 8) {
        Obj.xAxis.axisLabel['interval'] = function (number, value) {
          return space(number, 4)
        }
      } else {
        Obj.xAxis.axisLabel['interval'] = function (number, value) {
          return space(number, 2)
        }
      }
    }
  }
}

const echartMethod = {separate60M: separate60M}

export default echartMethod
