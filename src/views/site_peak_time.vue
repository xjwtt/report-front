<template>
  <div class="report-page">
    <div class="report-page-card">
      <interval-picker-hourlyweek></interval-picker-hourlyweek>
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
        <el-radio-button :label='[0,"TimeLabel"]'>{{$t('time_group')}}</el-radio-button>
        <el-radio-button :label='[1,"DomainLabel_TimeLabel"]'>{{$t('location_time_group')}}</el-radio-button>
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
             :options="chartOption"
             theme="vintage"></chart>
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

export default {
  name: 'peak_time',
  data: () => ({
    data: null,
    chartType: 'Enter',
    reportType: [0, 'TimeLabel'],
    charTypes: ['Enter', 'Exit', 'Stay'],
    fixedHeader: []
  }),
  methods: {
    ...mapActions('hourlyweek', ['query']),
    async onQuery () {
      this.data = await this.query({
        'report': {
          dateFields: this.dateFields,
          groupBy: [
            {domain: 'All'},
            {domain: 'Mall'}
          ]
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
      return this.data ? this.data['report'][0] : []
    },
    tableType () {
      switch (this.reportType[1]) {
        case 'DomainLabel_TimeLabel':
          return 'TimeLabel'
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
      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      switch (that.reportType[1]) {
        case 'TimeLabel':
          let ySelector = (_) => _[this.chartType]
          let xBar = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : []
          let yBar = this.data ? _.map(this.data['report'][dataArrayIndex], ySelector) : []
          let bar = {
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
              name: yAxisName,
              axisLabel: {
                formatter: '{value} '
              }
            }],
            series: [{
              name: that.chartType,
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
        case 'DomainLabel_TimeLabel':
          let groupByObj = _.groupBy(this.data['report'][dataArrayIndex], (_) => _['DomainLabel'])
          let legendLine = _.map(groupByObj, (value, key) => {
            return key
          })
          let xLine = legendLine.length > 0 ? _.map(groupByObj[legendLine[0]], (_) => _['TimeLabel']) : []
          let seriesLine = legendLine.length > 0 ? _.map(groupByObj, (value, key) => {
            let data = _.map(value, (_) => {
              return _[that.chartType]
            })
            return {name: key, type: 'line', stack: that.chartType, data: data}
          }) : []
          let line = {
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
      }
    }
  }
}
</script>

<style scoped>

</style>
