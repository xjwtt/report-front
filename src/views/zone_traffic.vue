<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <zone-selector :zone-types="zoneTypes" ref=zoneSelector></zone-selector>
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
        <el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>
      </el-radio-group>
      <chart :options="chartOption"
             style="width:100%"
             :autoResize="true"></chart>
    </div>
    <div class="report-page-card">
      <traffice-table-fast :columnsInit=columnsInit
                           :charTypes=charTypes
                           :tableType=tableType
                           :tableData=tableData
                           :headerData=headerData
                           :fixedHeader=fixedHeader>
      </traffice-table-fast>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import _ from 'underscore'
import theme from '../lib/theme'

export default {
  data: () => ({
    zoneTypes: ['Entrance', 'Domain', 'Floor', 'Corridor'],
    data: null,
    reportType: [1, 'DateTime'],
    chartType: 'Enter',
    charTypes: ['Enter', 'Exit', 'Stay'],
    fixedHeader: ['Picture', 'WeatherName', 'Temp']
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      console.log(this.$refs.zoneSelector.zoneIds)
      this.data = await this.query({
        'report': {
          dateFields: ['Enter', 'Exit', 'Stay', 'HighTemp', 'LowTemp', 'WeatherName'],
          groupBy: [
            {domain: 'Zone', period: 'All', timeFormatter: 'All'},
            {domain: 'All'},
            {domain: 'Zone'}
            // { domain: 'All', period: 'All', timeFormatter: 'All' }
          ],
          PhyIds: this.$refs.zoneSelector.zoneIds
        }
      })
    }
  },
  computed: {
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
      let yAxisName = this.$t('man_time')
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let avgName = this.$t('avg')
      let chartTypeName = that.$t(that.chartType)
      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      switch (this.reportType[1]) {
        case 'DateTime':
          let ySelector = (_) => _[this.chartType]
          let xData = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : []
          let yData = this.data ? _.map(this.data['report'][dataArrayIndex], ySelector) : []

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
              data: xData,
              axisLabel: {
                rotate: 45
              }
            },
            yAxis: [{
              type: 'value',
              name: yAxisName,
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
              data: yData
            }]
          }
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
              data: xLine
            },
            yAxis: {
              type: 'value'
            },
            series: seriesLine
          }
          Object.freeze(line)
          return line
        case 'DomainLabel':
          let legendData = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : []
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
              data: legendData
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
  async mounted () {
    this.onQuery()
  }
}
</script>
