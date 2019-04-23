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
             :autoResize="true"
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
      let result = []
      switch (dataArrayIndex) {
        case 0:
          result = this.data ? this.data['report'][dataArrayIndex] : []
          break
        case 1:
          result = this.data ? this.data['report'][2] : []
          break
      }
      Object.freeze(result)
      return result
    },
    headerData () {
      let dataArrayIndex = this.reportType[0]
      return this.data ? this.data['report'][dataArrayIndex] : []
    },
    tableType () {
      return this.reportType[1]
    },
    chartOption () {
      let dataType = this.$t('enter')
      let yAxisName = this.$t('man_time')
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let avgName = this.$t('avg')

      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      let ySelector = (_) => _[this.chartType]

      let xData = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : null
      let yData = this.data ? _.map(this.data['report'][dataArrayIndex], ySelector) : null

      let result = {
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
          name: dataType,
          type: 'bar',
          stack: '',
          large: true,
          silent: true,
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
      Object.freeze(result)
      return result
    }
  },
  async mounted () {
    this.onQuery()
  }
}
</script>
