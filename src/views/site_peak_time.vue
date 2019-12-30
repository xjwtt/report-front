<template>
  <div class="report-page">
    <div class="report-page-card">
      <interval-picker-day-w-m-y></interval-picker-day-w-m-y>
      <date-week-range-picker></date-week-range-picker>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
    <div class="report-page-card">
      <el-radio-group v-model="reportType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label='[0,"PeakGroup"]'>{{$t('peaktime_group')}}</el-radio-button>
        <el-radio-button :label='[1,"DailyGroup"]'>{{$t('daily_group')}}</el-radio-button>
        <el-radio-button :label='[2,"HourGroup"]'>{{$t('hour_group')}}</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="chartType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label="'Enter'">{{$t('enter')}}</el-radio-button>
        <el-radio-button :label="'Exit'">{{$t('exit')}}</el-radio-button>
        <el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>
      </el-radio-group>
      <chart style="width:100%;height: 600px"
             :autoResize="true"
             :options="chartOption"></chart>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import moment from 'moment'
import _ from 'underscore'
import i18n from '@/i18n'
import weekFun from '@/lib/weekFun'
import theme from '../lib/theme'
import IntervalPickerDayWMY from '../components/IntervalPickerDayWMY'

export default {
  components: {IntervalPickerDayWMY},
  data: () => ({
    data: null,
    reportType: [0, 'PeakGroup'],
    chartType: 'Enter',
    dateFields: ['Enter', 'Exit', 'Stay']
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let report = {
        'report': {
          st: this.peakTimeDateRange[0],
          et: this.peakTimeDateRange[1],
          dateFields: this.dateFields,
          groupBy: [
            // {domain: 'All', period: '60m', timeFormatter: 'yyyy-MM-dd HH:mm'}
            {domain: 'All', period: this.dayWMY.key, timeFormatter: this.dayWMY.timeFormatter},
            {domain: 'All', period: '1d', timeFormatter: 'yyyy-MM-dd'},
            {domain: 'All', period: '60m', timeFormatter: 'HH:mm'}
          ]
        }
      }
      switch (this.dayWMY.key) {
        case '60m':
          report.report.groupBy[1] = {domain: 'All', period: '1d', timeFormatter: 'yyyy-MM-dd'}
          break
        case 'WeekPeak':
          report.report.groupBy[1] = {domain: 'All', period: 'Week', timeFormatter: 'Week'}
          break
        case 'MonthPeak':
          report.report.groupBy[1] = {domain: 'All', period: 'Month', timeFormatter: 'yyyy-MM'}
          break
        case 'YearPeak':
          report.report.groupBy[1] = {domain: 'All', period: 'Year', timeFormatter: 'yyyy'}
          break
      }
      this.data = await this.query(report)
    }
  },
  computed: {
    ...mapState('app', {
      dayWMY: state => state.dayWMY,
      peakTimeDateRange: state => state.peakTimeDateRange
    }),
    chartOption () {
      let that = this
      const t = key => i18n.t(key)
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let avgName = this.$t('avg')
      let chartTypeName = that.$t(that.chartType)
      let dataArrayIndex = this.reportType[0]
      switch (this.reportType[1]) {
        case 'PeakGroup':
          let dateTimes = this.data ? _.map(this.data['report'][0], (_) => _['DateTime']) : []
          let min = 0
          let max = 10
          let daysObject = {}
          _.each(dateTimes, function (d) {
            let dm = moment(d)
            let date = dm.format('YYYY-MM-DD')
            let hour = dm.format('HH:mm')
            if (!daysObject[date]) {
              daysObject[date] = []
            }
            daysObject[date].push(hour)
          })
          let days = _.sortBy(Object.keys(daysObject), function (v) {
            return v
          })
          let hours = days.length > 0 ? daysObject[days[0]].reverse() : []

          let dataObject = {}
          if (this.data) {
            _.each(this.data['report'][0], function (v) {
              let key = moment(v['DateTime']).format('YYYY-MM-DD HH:mm')
              let value = v[that.chartType]
              min = min > value ? value : min
              max = value > max ? value : max
              dataObject[key] = value
            })
          }
          let series = []
          _.each(days, function (d, dIndex) {
            _.each(hours, function (h, hIndex) {
              let key = d + ' ' + h
              series.push([dIndex, hIndex, dataObject[key]])
            })
          })
          days = _.map(days, function (v) {
            switch (that.dayWMY.key) {
              case 'MonthPeak':
                return moment(v).format('YYYY-MM')
              case 'YearPeak':
                return moment(v).format('YYYY')
              default:
                return weekFun.GetDateWeek(t, v, 'YYYY-MM-DD', 'MM-DD')
            }
          })
          let heatmap = {
            tooltip: {
              position: 'top',
              formatter: function (p) {
                return days[p.data[0]] + ' ' + hours[p.data[1]] + '<br/>' + p.seriesName + ' : ' + p.data[2]
              }
            },
            textStyle: {
              color: '#000000'
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            animation: false,
            grid: [{
              height: '70%',
              y: '10%'
            }],
            xAxis: [{
              type: 'category',
              data: days,
              splitArea: {
                show: true
              },
              axisLabel: {
                rotate: 35
              }
            }],
            yAxis: [{
              type: 'category',
              data: hours,
              splitArea: {
                show: true
              }
            }],
            visualMap: [{
              min: min,
              max: max,
              calculable: true,
              orient: 'horizontal',
              left: 'center',
              inRange: {
                color: [
                  '#FFFFCC',
                  '#99CC33',
                  '#CC9900'
                ]
              }
            }],
            series: [{
              name: chartTypeName,
              type: 'heatmap',
              data: series,
              label: {
                normal: {
                  show: true
                }
              },
              itemStyle: {
                emphasis: {
                  shadowBlur: 100,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }]
          }
          Object.freeze(heatmap)
          return heatmap
        default:
          let xBar = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _['TimeLabel']) : []
          let yBar = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _[this.chartType]) : []
          let bar = {
            color: theme.color,
            title: {
              text: ''
            },
            tooltip: {
              trigger: 'axis'
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              height: '70%',
              containLabel: true
            },
            toolbox: {
              top: 20,
              showTitle: false,
              feature: {
                magicType: {type: ['line', 'bar']},
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: true,
              data: xBar,
              axisLabel: {
                rotate: 45
              }
            },
            yAxis: [{
              type: 'value',
              axisLabel: {
                formatter: '{value} '
              }
            }],
            series: [{
              name: chartTypeName,
              type: 'bar',
              stack: '',
              markPoint: {
                data: [{
                  type: 'max',
                  name: maxName
                }, {
                  type: 'min',
                  name: minName
                }]
              },
              markLine: {
                data: [{
                  type: 'average',
                  name: avgName
                }]
              },
              data: yBar
            }]
          }
          Object.freeze(bar)
          return bar
      }
    }
  },
  mounted () {
    this.onQuery()
  }
}
</script>

<style scoped>

</style>
