<template>
  <div class="report-page">
    <div class="report-page-card">
      <tag-selector ref="tagSelector"></tag-selector>
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
      <!--      <traffice-table-fast :columnsInit=columnsInit-->
      <!--                           :charTypes=charTypes-->
      <!--                           :tableType=tableType-->
      <!--                           :tableData=tableData-->
      <!--                           :headerData=headerData-->
      <!--                           :fixedHeader=fixedHeader-->
      <!--                           :export-name="'tag_traffic'">-->
      <!--      </traffice-table-fast>-->
      <traffice-bigdata-table :columns=columns
                              :tableDataHandled=tableDataHandled
                              :fixedCol=this.columnsFixed.length-1
                              :export-name="'site_traffic'">
      </traffice-bigdata-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import TagSelector from '@/components/TagSelector'
import _ from 'underscore'
import theme from '../lib/theme'
import echartMethod from '../lib/echartMethod'
import moment from 'moment'

export default {
  data: () => ({
    data: null,
    reportType: [1, 'DateTime'],
    chartType: 'Enter',
    dateFields: ['Enter', 'Exit', 'Stay'],
    charTypes: ['Enter', 'Exit'],
    fixedHeader: []
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let checkedTagTypes = this.$refs.tagSelector.checkedTagTypes
      let mallIds = this.getMallIds(checkedTagTypes)
      this.data = await this.query({
        'report': {
          mallIds: mallIds,
          tagTypes: checkedTagTypes,
          dateFields: this.dateFields,
          groupBy: [
            {domain: 'Tag', period: 'All', timeFormatter: 'All'},
            {domain: 'All'},
            {domain: 'Tag'}
          ]
        }
      })
    },
    getMallIds (tagTypes) {
      if (tagTypes) {
        let set = new Set()
        _.each(tagTypes, function (v) {
          _.each(v.MallIds, function (id) {
            set.add(id)
          })
        })
        return Array.from(set)
      } else {
        return []
      }
    }
  },
  computed: {
    ...mapState('app', {
      timeInterval: state => state.timeInterval
    }),
    fixedHeader () {
      return []
    },
    groupByData () {
      let dataArrayIndex = this.reportType[0]
      let data = this.data ? this.data['report'][dataArrayIndex] : []
      let period = this.timeInterval.key
      let groupByData = {}
      switch (period) {
        case '5m':
        case '10m':
        case '15m':
        case '30m':
        case '60m':
          groupByData = _.groupBy(data, (v) => {
            return moment(v.TimeLabel).format('YYYY-MM-DD')
          })
          break
        default:
          groupByData['All'] = data
      }
      let result = {}
      _.each(groupByData, (v, k) => {
        let domain = _.groupBy(v, (items) => {
          return items['DomainLabel']
        })
        _.each(domain, (d, dk) => {
          result[k + '_' + dk] = d
        })
      })
      return result
    },
    columnsFixed () {
      let fixed = ['location']
      let period = this.timeInterval.key
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
      return fixed
    },
    columns () {
      let columns = [].concat(this.columnsFixed)
      _.each(columns, (value, index) => {
        columns[index] = this.$t(value)
      })
      let data = []
      switch (this.reportType[1]) {
        case 'DateTime':
        case 'DomainLabel_DateTime':
          let xSelector = (_) => _['DateTime']
          let keys = Object.keys(this.groupByData)
          if (keys.length > 0) {
            let temp = this.groupByData[keys[0]]
            data = _.map(temp, xSelector)
            if (this.timeInterval.key === '60m') {
              data = _.map(data, (v) => {
                return moment(v).format('HH:mm')
              })
            }
          }
          break
        case 'DomainLabel':
          data = _.map(this.charTypes, (v) => {
            return this.$t(v)
          })
          break
      }
      columns = columns.concat(data)
      return columns.map((title, col) => {
        return {
          title: title,
          align: 'center'
        }
      })
    },
    tableDataHandled () {
      let that = this
      let body = []
      switch (this.reportType[1]) {
        case 'DateTime':
        case 'DomainLabel_DateTime':
          let firstKeys = Object.keys(that.groupByData)
          if (firstKeys.length > 0) {
            let data = that.groupByData[firstKeys[0]]
            _.each(this.fixedHeader, (type) => {
              let row = ['', that.$t(type), '-']
              _.each(data, (v) => {
                switch (type) {
                  case 'Picture':
                    let p = ''
                    if (v['DayPictureUrl']) {
                      p = '<img style="width: 42px;height:30px" src="' + v['DayPictureUrl'] + '"/>'
                    }
                    row.push(p)
                    break
                  default:
                    row.push(v[type])
                }
              })
              body.push(row)
            })
          }
          _.each(that.groupByData, (v, k) => {
            _.each(that.charTypes, (type) => {
              let row = []
              _.each(that.columnsFixed, (f) => {
                switch (f) {
                  case 'location':
                    row.push(v[0]['DomainLabel'])
                    break
                  case 'type':
                    row.push(this.$t(type))
                    break
                  case 'date':
                    row.push(moment(v[0]['TimeLabel']).format('YYYY-MM-DD'))
                    break
                  case 'total':
                    let total = 0
                    _.each(v, (item) => {
                      total += item[type]
                    })
                    row.push(total)
                    break
                  default:
                    row.push(v[0][f])
                    break
                }
              })
              _.each(v, (item) => {
                row.push(item[type])
              })
              body.push(row)
            })
          })
          break
        case 'DomainLabel':
          _.each(that.groupByData, (v, k) => {
            let row = [v[0]['DomainLabel']]
            _.each(that.charTypes, (type) => {
              _.each(v, (item) => {
                row.push(item[type])
              })
            })
            body.push(row)
          })
          break
      }
      return body
    },
    columnsInit () {
      return ['location']
    },
    tableData () {
      let dataArrayIndex = this.reportType[0]
      return this.data ? this.data['report'][dataArrayIndex] : []
    },
    headerData () {
      let dataArrayIndex = this.reportType[0]
      switch (dataArrayIndex) {
        case 1:
        case 2:
          dataArrayIndex = 1
          break
        default:
          break
      }
      return this.data ? this.data['report'][dataArrayIndex] : []
    },
    tableType () {
      switch (this.reportType[1]) {
        case 'DomainLabel_DateTime':
          return 'DateTime'
        default:
          return this.reportType[1]
      }
    },
    chartOption () {
      let that = this
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let avgName = this.$t('avg')
      let chartTypName = that.$t(that.chartType)
      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      switch (this.reportType[1]) {
        case 'DateTime':
          let ySelector = (_) => _[this.chartType]
          let xBar = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : []
          let yBar = this.data ? _.map(this.data['report'][dataArrayIndex], ySelector) : []
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
            series: [{
              name: chartTypName,
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
                name: chartTypName,
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
  },
  components: {
    TagSelector
  }
}
</script>

<style scoped>

</style>
