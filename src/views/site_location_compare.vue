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
<!--         <el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>-->
      </el-radio-group>
      <chart style="width:100%"
             :autoResize="true"
             :options="chartOption"></chart>

    </div>
    <div class="report-page-card">
      <traffice-table-fast :columnsInit=columnsInit
                           :charTypes=charTypes
                           :tableType=tableType
                           :tableData=tableData
                           :compareData=compareData
                           :headerData=headerData
                           :fixedHeader=fixedHeader
                           :export-name="'site_location_compare'">
      </traffice-table-fast>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
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
    fixedHeader () {
      let timeInterval = this.$store.state.app.timeInterval.key
      switch (timeInterval) {
        case '1d':
          return ['WeatherName', 'Temp']
        default:
          return []
      }
    },
    columnsInit () {
      return ['location']
    },
    charTypes () {
      return [this.chartType]
    },
    tableType () {
      return this.reportType[1]
    },
    tableData () {
      let dataArrayIndex = this.reportType[0]
      return this.data ? this.data['report'][dataArrayIndex] : []
    },
    compareData () {
      let dataArrayIndex = this.reportType[0]
      return this.data ? this.data['compare'][dataArrayIndex] : []
    },
    headerData () {
      let dataArrayIndex = this.reportType[0]
      return this.data ? this.data['report'][dataArrayIndex] : []
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
        default:
          xData = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _[this.reportType[1]]) : []
          series = [{name: legendData[0], type: 'bar', data: reportSeries}, {
            name: legendData[1],
            type: 'bar',
            stack: 'compare',
            data: compareSeries
          }]
          break
      }
      return {
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
    }
  },
  async mounted () {
    this.onQuery()
  }
}
</script>

<style scoped>

</style>
