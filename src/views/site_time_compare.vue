<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select ref="mallSelect"></singel-mall-select>
      <interval-picker></interval-picker>
      <el-row>
        <el-col :span="6">
          <date-range ref="dateRange"></date-range>
        </el-col>
        <el-col :span="6">
          <date-range ref="compareDateRange" titleName="compare_date_range"></date-range>
        </el-col>
      </el-row>
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
      <traffice-table-compare-fast :columnsInit=columnsInit
                                   :charTypes=charTypes
                                   :tableType=tableType
                                   :tableData=tableData
                                   :compareData=compareData
                                   :fixedHeader=fixedHeader>
      </traffice-table-compare-fast>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import _ from 'underscore'
import moment from 'moment'
import theme from '../lib/theme'

export default {
  name: 'site_time_compare',
  data () {
    return {
      zoneTypes: ['Entrance', 'Domain', 'Floor', 'Corridor'],
      data: null,
      reportType: [0, 'DateTime'],
      chartType: 'Enter',
      fixedHeader: ['WeatherName', 'Temp']
    }
  },
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let startDate = this.$refs.dateRange.dateRangeValue[0]
      let endDate = this.$refs.dateRange.dateRangeValue[1]
      let compareStartDate = this.$refs.compareDateRange.dateRangeValue[0]
      let compareEndDate = this.$refs.compareDateRange.dateRangeValue[1]
      let duration = moment.duration(moment(endDate).diff(startDate))
      let compareDuration = moment.duration(moment(compareEndDate).diff(compareStartDate))
      if (duration.asMinutes() === compareDuration.asMinutes()) {
        this.data = await this.query({
          'report': {
            dateFields: ['Enter', 'Exit', 'HighTemp', 'LowTemp', 'WeatherName'],
            groupBy: [
              {domain: 'Mall'}
              // {domain: 'Mall', period: 'All', timeFormatter: 'All'}
            ],
            mallIds: [this.$refs.mallSelect.mallId],
            st: startDate,
            et: endDate
          },
          'compare': {
            dateFields: ['Enter', 'Exit', 'HighTemp', 'LowTemp', 'WeatherName'],
            groupBy: [
              {domain: 'Mall'}
              // {domain: 'Mall', period: 'All', timeFormatter: 'All'}
            ],
            mallIds: [this.$refs.mallSelect.mallId],
            st: compareStartDate,
            et: compareEndDate
          }
        })
      } else {
        this.$message.error(this.$t('time_interval_must_be_the_same'))
      }
    }
  },
  computed: {
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

      let reportData = this.data ? this.data['report'][dataArrayIndex] : []
      let reportSeries = _.map(reportData, (_) => _[this.chartType])
      let compareData = this.data ? this.data['compare'][dataArrayIndex] : []
      let compareSeries = _.map(compareData, (_) => _[this.chartType])
      let legendData = [this.$t('date_range'), this.$t('compare_date_range')]
      let series
      let xData
      switch (this.reportType[1]) {
        case 'DomainLabel':
          xData = legendData
          series = []
          break
        default:
          xData = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _[this.reportType[1]]) : []
          series = [{name: this.$t('date_range'), type: 'bar', data: reportSeries}, {
            name: this.$t('compare_date_range'),
            type: 'bar',
            stack: 'compare',
            data: compareSeries
          }]
          break
      }
      let yAxisNameLeft = this.$t('man_time')
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
          name: yAxisNameLeft,
          axisLabel: {
            formatter: '{value} '
          }
        }],
        series: series
      }
    }
  }
}
</script>

<style scoped>

</style>
