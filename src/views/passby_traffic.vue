<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <zone-selector :zoneTypes="zoneTypes" ref=zoneSelector></zone-selector>
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
        <el-radio-button :label='[1,"TimeLabel"]'>{{$t('time_group')}}</el-radio-button>
        <el-radio-button :label='[0,"DomainLabel"]'>{{$t('location_group')}}</el-radio-button>
      </el-radio-group>
      <el-radio-group
        style="vertical-align: middle;"
        size="mini">
      </el-radio-group>
      <chart style="width:100%"
             :autoResize="true"
             :options="chartOption"
             theme="light"></chart>
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
  name: 'passby_traffic',
  data () {
    return {
      data: null,
      charTypes: ['Enter', 'Passby', 'EnteringRate'],
      zoneTypes: ['MallShop'],
      reportType: [1, 'TimeLabel'],
      fixedHeader: []
    }
  },
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      this.data = await this.query({
        'report': {
          dateFields: ['Passby', 'EnteringRate'],
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
      switch (dataArrayIndex) {
        case 0:
          return this.data ? this.data['report'][dataArrayIndex] : []
        case 1:
          return this.data ? this.data['report'][2] : []
      }
    },
    tableType () {
      return this.reportType[1]
    },
    headerData () {
      let dataArrayIndex = this.reportType[0]
      return this.data ? this.data['report'][dataArrayIndex] : []
    },
    chartOption () {
      let yAxisNameLeft = this.$t('man_time')
      let yAxisNameRight = this.$t('percent')
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let passby = this.$t('passby')
      let enter = this.$t('enter')
      let enteringRate = this.$t('enteringRate')

      let dataArrayIndex = this.reportType[0]

      let xData = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _[this.reportType[1]]) : []
      let yEnter = this.data ? _.map(this.data['report'][dataArrayIndex], (it) => it.Enter) : []
      let yPassBy = this.data ? _.map(this.data['report'][dataArrayIndex], (it) => it.Passby) : []
      let yEnteringRate = this.data ? _.map(this.data['report'][dataArrayIndex], (it) => it.EnteringRate) : []

      return {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [enter, passby, enteringRate]
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: [{
          type: 'value',
          name: yAxisNameLeft,
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
          itemStyle: {
            normal: {
              color: '#d87c7c'
            }
          },
          data: yPassBy
        }, {
          name: enter,
          /* z值小的图形会被z值大的图形覆盖 */
          z: 10,
          type: 'bar',
          large: true,
          silent: true,
          itemStyle: {
            normal: {
              color: '#61a0a8'
            }
          },
          data: yEnter
        }, {
          name: enteringRate,
          z: 11,
          type: 'line',
          silent: true,
          yAxisIndex: 1,
          itemStyle: {
            normal: {
              color: '#724e58'
            }
          },
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
    }
  },
  async mounted () {
    this.onQuery()
  }
}
</script>
