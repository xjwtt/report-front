<template>
  <div class="report-page">
    <div class="report-page-card">
      <compare-mall-select ref="mallSelect"></compare-mall-select>
      <interval-picker></interval-picker>
      <date-range-picker></date-range-picker>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
    <div class="report-page-card">
      <el-radio-group v-model="reportType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label='[0,"DateTime"]'>{{$t('time_group')}}</el-radio-button>
        <!--<el-radio-button :label='[1,"DomainLabel"]'>{{$t('location_group')}}</el-radio-button>-->
      </el-radio-group>
      <el-radio-group v-model="chartType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label="'Enter'">{{$t('enter')}}</el-radio-button>
        <el-radio-button :label="'Exit'">{{$t('exit')}}</el-radio-button>
        <el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>
      </el-radio-group>
      <chart style="width:100%"
             :autoResize="true"
             :options="chartOption"></chart>

    </div>
    <div class="report-page-card">
      <traffice-bigdata-table :report-type=reportType
                              :period=this.timeInterval.key
                              :char-types=charTypes
                              :fixed-header=fixedHeader
                              :report-types=reportTypes
                              :columns-fixed=columnsFixed
                              :data=this.data
                              :export-name="'site_location_compare'">
      </traffice-bigdata-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import _ from 'underscore'
import theme from '../lib/theme'

export default {
  name: 'site_location_compare',
  data () {
    return {
      data: null,
      reportType: [0, 'DateTime'],
      chartType: 'Enter'
    }
  },
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      this.data = await this.query({
        'report': {
          dateFields: ['Enter', 'Exit', 'HighTemp', 'LowTemp', 'WeatherName'],
          groupBy: [
            {domain: 'Mall'}
          ],
          mallIds: [this.$refs.mallSelect.mallId],
          startTime: '00:00:00',
          endTime: '23:59:59'
        },
        'compare': {
          dateFields: ['Enter', 'Exit', 'HighTemp', 'LowTemp', 'WeatherName'],
          groupBy: [
            {domain: 'Mall'}
          ],
          mallIds: [this.$refs.mallSelect.compareMallId],
          startTime: '00:00:00',
          endTime: '23:59:59'
        }
      })
    }
  },
  computed: {
    ...mapState('app', {
      timeInterval: state => state.timeInterval
    }),
    charTypes () {
      return [this.chartType]
    },
    fixedHeader () {
      let timeInterval = this.$store.state.app.timeInterval.key
      switch (timeInterval) {
        case '1d':
          return ['WeatherName', 'Temp']
        default:
          return []
      }
    },
    reportTypes () {
      return ['report', 'compare']
    },
    columnsFixed () {
      let fixed = ['location']
      let period = this.timeInterval.key
      switch (this.reportType[1]) {
        case 'DomainLabel_DateTime':
        case 'DateTime':
          switch (period) {
            case '5m':
            case '10m':
            case '15m':
            case '30m':
            case '60m':
              fixed = fixed.concat(['type', 'date', 'WeatherName', 'total'])
              break
            default:
              fixed = fixed.concat(['type', 'total'])
          }
          break
      }
      return fixed
    },
    chartOption () {
      let dataArrayIndex = this.reportType[0]
      let legendData = []

      let reportData = this.data ? this.data['report'][dataArrayIndex] : []
      if (reportData.length > 0) {
        legendData.push(reportData[0]['DomainLabel'])
      } else {
        legendData.push('')
      }
      let reportSeries = _.map(reportData, (_) => _[this.chartType])
      let compareData = this.data ? this.data['compare'][dataArrayIndex] : []
      if (compareData.length > 0) {
        legendData.push(compareData[0]['DomainLabel'] + ' ')
      } else {
        legendData.push('')
      }
      let compareSeries = _.map(compareData, (_) => _[this.chartType])
      let series
      let xData
      switch (this.reportType[1]) {
        case 'DomainLabel':
          xData = legendData
          series = []
          break
        case 'DateTime':
          xData = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _[this.reportType[1]]) : []
          series = [{name: legendData[0], type: 'line', data: reportSeries}, {
            name: legendData[1],
            type: 'line',
            stack: 'compare',
            data: compareSeries
          }]
          break
      }
      let bar = {
        color: theme.color,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          width: 600,
          data: legendData
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          showTitle: false,
          feature: {
            magicType: {type: ['line', 'bar']},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: xData,
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
        series: series
      }
      if (this.timeInterval.key === '60m') {
        let xGroup = _.groupBy(xData, (v) => {
          return v.substring(0, 10)
        })
        let keys = Object.keys(xGroup)
        if (keys.length > 0) {
          let xGroupLen = xGroup[keys[0]].length
          bar.xAxis['splitArea'] = {
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
            bar.xAxis.axisLabel['interval'] = 0
          } else if (keys.length <= 8) {
            bar.xAxis.axisLabel['interval'] = function (number, value) {
              return space(number, 4)
            }
          } else {
            bar.xAxis.axisLabel['interval'] = function (number, value) {
              return space(number, 2)
            }
          }
        }
      }
      Object.freeze(bar)
      return bar
    }
  },
  async mounted () {
    this.onQuery()
  }
}
</script>

<style scoped>

</style>
