<template>
  <div class="report-page">
    <div class="report-page-card">
      <interval-picker></interval-picker>
      <!--      <date-range-picker></date-range-picker>-->
      <date-range-picker-and-last-year></date-range-picker-and-last-year>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
    <div class="report-page-card">
      <el-radio-group v-model="reportType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label='[1,"DateTime"]'>{{$t('time_group')}}</el-radio-button>
        <el-radio-button :label='[2,"DomainLabel_DateTime"]'>{{$t('location_time_group')}}</el-radio-button>
        <el-radio-button :label='[0,"DomainLabel"]'>{{$t('location_group')}}</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="chartType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label="'Enter'">{{$t('enter')}}</el-radio-button>
        <el-radio-button :label="'Exit'">{{$t('exit')}}</el-radio-button>
<!--        <el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>-->
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
                              :export-name="'site_traffic'">
      </traffice-bigdata-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import moment from 'moment'
import _ from 'underscore'
import theme from '../lib/theme'
import echartMethod from '../lib/echartMethod'

export default {
  data: () => ({
    data: null,
    reportType: [1, 'DateTime'],
    chartType: 'Enter',
    dateFields: ['Enter', 'Exit', 'HighTemp', 'LowTemp', 'WeatherName'],
    charTypes: ['Enter', 'Exit']
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let query = {}
      query['report'] = {
        dateFields: this.dateFields,
        groupBy: [
          // {domain: 'Mall'},
          {domain: 'Mall', period: 'All', timeFormatter: 'All'},
          {domain: 'All'},
          {domain: 'Mall'}
        ]
      }
      if (this.selectLastYear) {
        let dateRangeValue = this.dateRange
        let startDate = moment(dateRangeValue[0]).add(-1, 'year')
        let endDate = moment(dateRangeValue[1]).add(-1, 'year')
        query['lastYear'] = {
          dateFields: this.dateFields,
          groupBy: [
            // {domain: 'Mall'},
            {domain: 'Mall', period: 'All', timeFormatter: 'All'},
            {domain: 'All'},
            {domain: 'Mall'}
          ],
          st: startDate,
          et: endDate
        }
      }
      this.data = await this.query(query)
    }
  },
  computed: {
    ...mapState('app', {
      timeInterval: state => state.timeInterval,
      dateRange: state => state.dateRange,
      selectLastYear: state => state.selectLastYear
    }),
    fixedHeader () {
      return []
    },
    reportTypes () {
      return ['report']
    },
    columnsFixed () {
      let fixed = ['location']
      let period = this.timeInterval.key
      switch (this.reportType[1]) {
        case 'DomainLabel_DateTime':
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
        case 'DateTime':
          switch (period) {
            case '5m':
            case '10m':
            case '15m':
            case '30m':
            case '60m':
              fixed = fixed.concat(['type', 'date', 'total'])
              break
            default:
              fixed = fixed.concat(['type', 'total'])
          }
          break
      }
      return fixed
    },
    chartOption () {
      let that = this
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let avgName = this.$t('avg')
      let chartTypeName = that.$t(that.chartType)
      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      switch (this.reportType[1]) {
        case 'DateTime':
          let ySelector = (_) => _[this.chartType]
          let legendData = [chartTypeName]
          let xBar = []
          let xReport = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : []
          let yReport = this.data ? _.map(this.data['report'][dataArrayIndex], ySelector) : []
          let series = [{
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
            data: yReport
          }]
          if (this.data && this.data['lastYear']) {
            let xLastYearReport = this.data ? _.map(this.data['lastYear'][dataArrayIndex], xSelector) : []
            let yLastYearReport = this.data ? _.map(this.data['lastYear'][dataArrayIndex], ySelector) : []
            legendData.push(this.$t('last_year'))
            series.push({
              name: this.$t('last_year'),
              type: 'bar',
              stack: '',
              barGap: '-50%',
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
              data: yLastYearReport
            })
            for (let i = 0, len = xReport.length; i < len; i++) {
              xBar.push(xReport[i] + '/' + xLastYearReport[i])
            }
          } else {
            xBar = xReport
          }
          let bar = {
            color: theme.color,
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              data: legendData
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
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
            series: series
          }
          echartMethod.separate60M(this.timeInterval.key, bar, xBar)
          Object.freeze(bar)
          return bar
        case 'DomainLabel_DateTime':
          let groupByObj = _.groupBy(this.data['report'][dataArrayIndex], (_) => _['DomainLabel'])
          let legendLine = _.map(groupByObj, (value, key) => {
            return key
          })
          let xLine = legendLine.length > 0 ? _.map(groupByObj[legendLine[0]], (_) => _['DateTime']) : []
          let seriesLine = legendLine.length > 0 ? _.map(groupByObj, (value, key) => {
            let data = _.map(value, (_) => {
              return _[that.chartType]
            })
            return {name: key, type: 'line', data: data}
          }) : []
          let line = {
            color: theme.color,
            title: {
              text: ''
            },
            tooltip: {
              trigger: 'axis'
            },
            legend: {
              type: 'scroll',
              width: 600,
              data: legendLine
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '3%',
              containLabel: true
            },
            toolbox: {
              feature: {
                saveAsImage: {}
              }
            },
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: xLine,
              axisLabel: {
                rotate: 45
              }
            },
            yAxis: {
              type: 'value'
            },
            series: seriesLine
          }
          echartMethod.separate60M(this.timeInterval.key, line, xLine)
          Object.freeze(line)
          return line
        case 'DomainLabel':
          let legendPie = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : []
          let pieSeriesData = this.data ? _.map(this.data['report'][dataArrayIndex], function (it) {
            return {name: it[that.reportType[1]], value: it[that.chartType]}
          }) : []
          let pie = {
            color: theme.color,
            title: {
              text: '',
              x: 'center'
            },
            tooltip: {
              trigger: 'item',
              formatter: '{b}<br/>{a} : {c} ({d}%)'
            },
            legend: {
              orient: 'vertical',
              left: 'right',
              data: legendPie
            },
            series: [
              {
                name: chartTypeName,
                type: 'pie',
                radius: '80%',
                center: ['50%', '50%'],
                data: pieSeriesData,
                itemStyle: {
                  emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          }
          Object.freeze(pie)
          return pie
      }
    }
  },
  mounted () {
    this.onQuery()
  }
}
</script>
