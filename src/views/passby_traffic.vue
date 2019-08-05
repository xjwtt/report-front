<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <zone-selector @executeQuery='executeQuery' :zoneTypes="zoneTypes" ref=zoneSelector></zone-selector>
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
      <el-radio-group
        style="vertical-align: middle;"
        size="mini">
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
                              :export-name="'passby_traffic'">
      </traffice-bigdata-table>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import _ from 'underscore'
import theme from '../lib/theme'
import echartMethod from '../lib/echartMethod'

export default {
  name: 'passby_traffic',
  data () {
    return {
      data: null,
      charTypes: ['Enter', 'Passby', 'EnteringRate'],
      zoneTypes: ['MallShop'],
      reportType: [1, 'DateTime']
    }
  },
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let phyIds = this.$refs.zoneSelector.zoneIds
      this.executeQuery(phyIds)
    },
    async executeQuery (phyIds) {
      this.data = await this.query({
        'report': {
          dateFields: ['Passby', 'EnteringRate', 'HighTemp', 'LowTemp', 'WeatherName'],
          groupBy: [
            {domain: 'Zone', period: 'All', timeFormatter: 'All'},
            {domain: 'All'},
            {domain: 'Zone'}
            // { domain: 'All', period: 'All', timeFormatter: 'All' }
          ],
          PhyIds: phyIds
        }
      })
    }
  },
  computed: {
    ...mapState('app', {
      timeInterval: state => state.timeInterval
    }),
    fixedHeader () {
      let timeInterval = this.$store.state.app.timeInterval.key
      switch (timeInterval) {
        case '1d':
          return ['Picture', 'WeatherName', 'Temp']
        default:
          return []
      }
    },
    reportTypes () {
      return ['report']
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
      let yAxisNameRight = this.$t('percent')
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let passby = this.$t('passby')
      let enter = this.$t('enter')
      let enteringRate = this.$t('enteringRate')

      let dataArrayIndex = this.reportType[0]
      let type = this.reportType[1]
      switch (type) {
        case 'DomainLabel_DateTime':
          type = 'DateTime'
          dataArrayIndex = 1
          break
      }
      let xData = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _[type]) : []
      let yEnter = this.data ? _.map(this.data['report'][dataArrayIndex], (it) => it.Enter) : []
      let yPassBy = this.data ? _.map(this.data['report'][dataArrayIndex], (it) => it.Passby) : []
      let yEnteringRate = this.data ? _.map(this.data['report'][dataArrayIndex], (it) => it.EnteringRate) : []

      let bar = {
        color: theme.color,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [enter, passby, enteringRate]
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
        }, {
          type: 'value',
          name: yAxisNameRight,
          axisLabel: {
            'formatter': '{value}% '
          }
        }],
        series: [{
          name: passby,
          type: 'bar',
          barGap: '-50%',
          large: true,
          silent: true,
          data: yPassBy
        }, {
          name: enter,
          /* z值小的图形会被z值大的图形覆盖 */
          z: 10,
          type: 'bar',
          large: true,
          silent: true,
          data: yEnter
        }, {
          name: enteringRate,
          z: 11,
          type: 'line',
          silent: true,
          yAxisIndex: 1,
          data: yEnteringRate,
          markPoint: {
            data: [{
              type: 'max',
              name: maxName
            }, {
              type: 'min',
              name: minName
            }]
          }
        }]
      }
      echartMethod.separate60M(this.timeInterval.key, bar, xData)
      Object.freeze(bar)
      return bar
    }
  }
}
</script>
