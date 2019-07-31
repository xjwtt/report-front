<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select ref="mallSelect"></singel-mall-select>
      <interval-picker></interval-picker>
      <el-row>
        <el-col :span="6">
          <div>
            <span>{{ $t('date_range') }}：</span>
            <el-date-picker v-model="dateRangeValue"
                            type="daterange"
                            :placeholder="$t('selection_date')"
                            :range-separator="' - '"
                            :editable="false"
                            :clearable="false"
                            style="width:220px;"
                            size="small">
            </el-date-picker>
          </div>
        </el-col>
        <el-col :span="6">
          <div>
            <span>{{ $t('compare_date_range') }}：</span>
            <el-date-picker v-model="compareDateRangeValue"
                            type="daterange"
                            :placeholder="$t('selection_date')"
                            :range-separator="' - '"
                            :editable="false"
                            :clearable="false"
                            style="width:220px;"
                            size="small">
            </el-date-picker>
          </div>
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
<!--        <el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>-->
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
                                   :fixedHeader=fixedHeader
                                   :export-name="'site_time_compare'">
      </traffice-table-compare-fast>
    </div>
  </div>
</template>

<script>
import {mapState, mapActions} from 'vuex'
import _ from 'underscore'
import moment from 'moment'
import theme from '../lib/theme'
import echartMethod from '../lib/echartMethod'

export default {
  name: 'site_time_compare',
  data () {
    return {
      dateRangeValue: [],
      compareDateRangeValue: [],
      zoneTypes: ['Entrance', 'Corridor', 'Floor', 'Domain'],
      data: null,
      reportType: [0, 'DateTime'],
      chartType: 'Enter'
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

      let reportData = this.data ? this.data['report'][dataArrayIndex] : []
      let reportSeries = _.map(reportData, (_) => _[this.chartType])
      let compareData = this.data ? this.data['compare'][dataArrayIndex] : []
      let compareSeries = _.map(compareData, (_) => _[this.chartType])
      let legendData = [this.$t('date_range'), this.$t('compare_date_range')]
      let series
      let xBar
      switch (this.reportType[1]) {
        case 'DomainLabel':
          xBar = legendData
          series = []
          break
        default:
          xBar = []
          let datas = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _[this.reportType[1]]) : []
          let compareDatas = this.data ? _.map(this.data['compare'][dataArrayIndex], (_) => _[this.reportType[1]]) : []
          for (let i = 0, len = datas.length; i < len; i++) {
            xBar.push(datas[i] + '/' + compareDatas[i])
          }
          series = [{name: this.$t('date_range'), type: 'line', data: reportSeries}, {
            name: this.$t('compare_date_range'),
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
          data: legendData
        },
        grid: {
          left: '8%',
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
    }
  },
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let startDate = this.dateRangeValue[0]
      let endDate = this.dateRangeValue[1]
      let compareStartDate = this.compareDateRangeValue[0]
      let compareEndDate = this.compareDateRangeValue[1]
      let duration = moment.duration(moment(endDate).diff(startDate))
      let compareDuration = moment.duration(moment(compareEndDate).diff(compareStartDate))
      if (duration.asDays() === compareDuration.asDays()) {
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
  async mounted () {
    let d = moment().subtract(1, 'days')
    this.dateRangeValue = [d, d]
    let cd = moment().subtract(2, 'days')
    this.compareDateRangeValue = [cd, cd]
    this.onQuery()
  }
}
</script>

<style scoped>

</style>
