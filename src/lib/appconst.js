import moment from 'moment'
import _ from 'underscore'

const disabledDate = function (time) {
  return time.getTime() > Date.now()
}

const week = parseInt(moment().format('d'))
const mouth = moment().format('MM')
const year = moment().format('YYYY')

const shortcutsMin = [
  {
    text: 'today',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(0, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: 'yesterday',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(1, 'days'),
        moment().subtract(1, 'days')
      ])
    }
  },
  {
    text: 'before_yesterday',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(2, 'days'),
        moment().subtract(2, 'days')
      ])
    }
  },
  {
    text: 'last_week_today',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(7, 'days'),
        moment().subtract(7, 'days')
      ])
    }
  },
  {
    text: 'last_month_today',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(1, 'months'),
        moment().subtract(1, 'months')
      ])
    }
  },
  {
    text: 'last_year_today',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(1, 'years'),
        moment().subtract(1, 'years')
      ])
    }
  }
]
const shortcuts60Min = [
  {
    text: 'this_week',
    onClick (picker) {
      picker.$emit('pick', [moment().startOf('week').add(1, 'd'), moment().endOf('week')])
    }
  },
  {
    text: 'last_week',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(6 + week, 'days'),
        moment().subtract(week, 'days')
      ])
    }
  },
  {
    text: 'today',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(0, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: 'yesterday',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(1, 'days'),
        moment().subtract(1, 'days')
      ])
    }
  },
  {
    text: 'before_yesterday',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(2, 'days'),
        moment().subtract(2, 'days')
      ])
    }
  },
  {
    text: 'last_week_today',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(7, 'days'),
        moment().subtract(7, 'days')
      ])
    }
  },
  {
    text: 'last_month_today',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(1, 'months'),
        moment().subtract(1, 'months')
      ])
    }
  },
  {
    text: 'last_year_today',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(1, 'years'),
        moment().subtract(1, 'years')
      ])
    }
  }
]

const shortcutsDay = [
  {
    text: 'this_week',
    onClick (picker) {
      picker.$emit('pick', [moment().startOf('week'), moment().endOf('week')])
    }
  },
  {
    text: 'last_week',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(6 + week, 'days'),
        moment().subtract(week, 'days')
      ])
    }
  },
  {
    text: 'this_month',
    onClick (picker) {
      picker.$emit('pick', [moment().startOf('month'), moment().endOf('month')])
    }
  },
  {
    text: 'last_momnt',
    onClick (picker) {
      picker.$emit('pick', [
        moment()
          .month(mouth - 2)
          .date(1),
        moment()
          .month(mouth - 2)
          .date(31)
      ])
    }
  },
  {
    text: 'last_two_weeks',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(14, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: 'last_three_weeks',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(21, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: 'last_30_days',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(30, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: 'last_60_days',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(60, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  }
]

const shortcutsWeek = [
  {
    text: 'last_two_weeks',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(14, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: 'last_three_weeks',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(21, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: 'last_four_weeks',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(28, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: 'last_five_weeks',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(35, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  }
]
const shortcutsMonth = [
  {
    text: 'this_year',
    onClick (picker) {
      picker.$emit('pick', [moment().startOf('years'), moment().endOf('years')])
    }
  },
  {
    text: 'last_year',
    onClick (picker) {
      picker.$emit('pick', [
        moment()
          .year(year - 1)
          .month(0)
          .date(1),
        moment()
          .year(year - 1)
          .month(11)
          .date(31)
      ])
    }
  },
  {
    text: 'last_half_year',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(6, 'months'),
        moment().subtract(0, 'months')
      ])
    }
  }
]
const shortcutsYear = [
  {
    text: 'three_years',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(3, 'years'),
        moment().subtract(0, 'years')
      ])
    }
  },
  {
    text: 'five_years',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(5, 'years'),
        moment().subtract(0, 'years')
      ])
    }
  }
]

const timeIntervals = [
  {
    key: '5m',
    timeFormatter: 'yyyy-MM-dd HH:mm',
    text: '5Min',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsMin
    }
  },
  {
    key: '10m',
    timeFormatter: 'yyyy-MM-dd HH:mm',
    text: '10Min',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsMin
    }
  },
  {
    key: '15m',
    timeFormatter: 'yyyy-MM-dd HH:mm',
    text: '15Min',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsMin
    }
  },
  {
    key: '30m',
    timeFormatter: 'yyyy-MM-dd HH:mm',
    text: '30Min',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsMin
    }
  },
  {
    key: '60m',
    timeFormatter: 'yyyy-MM-dd HH',
    text: '60Min',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcuts60Min
    }
  },
  {
    key: '1d',
    timeFormatter: 'yyyy-MM-dd',
    text: 'Day',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsDay
    }
  },
  {
    key: '7d',
    timeFormatter: 'yyyy-MM-dd',
    text: 'Week',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsWeek
    }
  },
  {
    key: 'Month',
    timeFormatter: 'yyyy-MM',
    text: 'Month',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsMonth
    }
  },
  {
    key: 'Year',
    timeFormatter: 'yyyy',
    text: 'Year',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsYear
    }
  }
]

const hourlyWeeks = [
  {
    key: 'Hourly',
    timeFormatter: 'HH',
    text: 'Hourly',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcuts60Min
    }
  },
  {
    key: 'Weekday',
    timeFormatter: 'Weekday',
    text: 'WeekDay',
    pickerOptions: {
      disabledDate: disabledDate,
      shortcuts: shortcutsDay
    }
  }
]
const getDefaultTimeInterval = function (t) {
  let ti = timeIntervals[4]
  _.each(ti.pickerOptions.shortcuts, function (value) {
    value.text = t(value.text)
  })
  return ti
}
const getTimeIntervals = function (t) {
  _.each(timeIntervals, function (v) {
    _.each(v.pickerOptions.shortcuts, function (p) {
      p.text = t(p.text)
    })
  })
  return timeIntervals
}
const getDefaultHourlyWeek = function (t) {
  let hw = hourlyWeeks[0]
  _.each(hw.pickerOptions.shortcuts, function (value) {
    value.text = t(value.text)
  })
  return hw
}
const getHourlyWeeks = function (t) {
  _.each(hourlyWeeks, function (v) {
    _.each(v.pickerOptions.shortcuts, function (p) {
      p.text = t(p.text)
    })
  })
  return hourlyWeeks
}
const appconst = {
  defaultDateRange: [moment(), moment()],
  defaultTimeInterval: getDefaultTimeInterval,
  timeIntervals: getTimeIntervals,
  defaultHourlyWeek: getDefaultHourlyWeek,
  hourlyWeeks: getHourlyWeeks
}
export default appconst
