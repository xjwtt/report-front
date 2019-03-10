import moment from 'moment'
import i18n from '../i18n'

const disabledDate = function (time) {
  return time.getTime() > Date.now()
}

const week = parseInt(moment().format('d'))
const mouth = moment().format('MM')
const year = moment().format('YYYY')

const shortcutsMin = [
  {
    text: i18n.t('today'),
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(0, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: i18n.t('yesterday'),
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(1, 'days'),
        moment().subtract(1, 'days')
      ])
    }
  },
  {
    text: i18n.t('before_yesterday'),
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(2, 'days'),
        moment().subtract(2, 'days')
      ])
    }
  },
  {
    text: i18n.t('last_week_today'),
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(7, 'days'),
        moment().subtract(7, 'days')
      ])
    }
  },
  {
    text: i18n.t('last_month_today'),
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(1, 'months'),
        moment().subtract(1, 'months')
      ])
    }
  },
  {
    text: i18n.t('last_year_today'),
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
    text: i18n.t('this_week'),
    onClick (picker) {
      picker.$emit('pick', [moment().startOf('week'), moment().endOf('week')])
    }
  },
  {
    text: i18n.t('last_week'),
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(6 + week, 'days'),
        moment().subtract(week, 'days')
      ])
    }
  },
  {
    text: i18n.t('last_two_weeks'),
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(14, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: i18n.t('last_three_weeks'),
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(21, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: i18n.t('this_month'),
    onClick (picker) {
      picker.$emit('pick', [moment().startOf('month'), moment().endOf('month')])
    }
  },
  {
    text: '上月',
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
    text: '最近30天',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(30, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: '最近60天',
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
    text: '最近2周',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(14, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: '最近3周',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(21, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: '最近4周',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(28, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: '最近5周',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(35, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: '最近6周',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(42, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: '最近7周',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(49, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  },
  {
    text: '最近8周',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(56, 'days'),
        moment().subtract(0, 'days')
      ])
    }
  }
]

const shortcutsMonth = [
  {
    text: '今年',
    onClick (picker) {
      picker.$emit('pick', [moment().startOf('years'), moment().endOf('years')])
    }
  },
  {
    text: '去年',
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
    text: '前年',
    onClick (picker) {
      picker.$emit('pick', [
        moment()
          .year(year - 2)
          .month(0)
          .date(1),
        moment()
          .year(year - 2)
          .month(11)
          .date(31)
      ])
    }
  },
  {
    text: '最近半年',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(6, 'months'),
        moment().subtract(0, 'months')
      ])
    }
  },
  {
    text: '最近1年',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(12, 'months'),
        moment().subtract(0, 'months')
      ])
    }
  }
]

const shortcutsYear = [
  {
    text: '3年',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(3, 'years'),
        moment().subtract(0, 'years')
      ])
    }
  },
  {
    text: '5年',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(5, 'years'),
        moment().subtract(0, 'years')
      ])
    }
  },
  {
    text: '8年',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(8, 'years'),
        moment().subtract(0, 'years')
      ])
    }
  },
  {
    text: '10年',
    onClick (picker) {
      picker.$emit('pick', [
        moment().subtract(10, 'years'),
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
      shortcuts: shortcutsMin
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

const appconst = {
  defaultDateRange: [moment(), moment()],
  defaultTimeInterval: timeIntervals[5],

  timeIntervals: timeIntervals
}
export default appconst
