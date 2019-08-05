<template>
  <div class="report-page">
    <div class="report-page-card">
      <!--      <compare-mall-select ref="mallSelect"></compare-mall-select>-->
      <div>
        <el-row :gutter="20">
          <el-col :span="6">
            <span> {{$t('select_site')}}：</span>
            <el-select v-model="selectMalls"
                       multiple
                       filterable
                       collapse-tags
                       placeholder="...">
              <el-option v-for="mall in selectedMalls"
                         :key="mall.Id"
                         :label="mall.Name"
                         :value="mall.Id">
              </el-option>
            </el-select>
          </el-col>
        </el-row>
      </div>
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
                              :export-name="'sites_location_compare'">
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
  name: 'site_location_compare',
  data () {
    return {
      data: null,
      selectMalls: [],
      compareKey: [],
      reportType: [0, 'DateTime'],
      chartType: 'Enter'
    }
  },
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let queryObject = {
        'report': {
          dateFields: ['Enter', 'Exit', 'HighTemp', 'LowTemp', 'WeatherName'],
          groupBy: [
            {domain: 'Mall'}
          ],
          mallIds: this.selectMalls[0],
          startTime: '00:00:00',
          endTime: '23:59:59'
        }
      }
      if (this.selectMalls.length > 1) {
        this.compareKey = []
        for (let i = 1; i < this.selectMalls.length; i++) {
          let key = 'compare_' + i
          this.compareKey.push(key)
          queryObject[key] = {
            dateFields: ['Enter', 'Exit', 'HighTemp', 'LowTemp', 'WeatherName'],
            groupBy: [
              {domain: 'Mall'}
            ],
            mallIds: [this.selectMalls[i]],
            startTime: '00:00:00',
            endTime: '23:59:59'
          }
        }
      }
      // 触发改变
      this.data = null
      this.data = await this.query(queryObject)
    }
  },
  computed: {
    ...mapState('app', {
      timeInterval: state => state.timeInterval,
      selectedMall: state => state.selectedMall,
      selectedMalls: state => state.selectedMalls
    }),
    charTypes () {
      return [this.chartType]
    },
    fixedHeader () {
      let timeInterval = this.$store.state.app.timeInterval.key
      switch (timeInterval) {
        case '1d':
          return ['WeatherName', 'Temp']
        default:
          return []
      }
    },
    reportTypes () {
      return ['report'].concat(this.compareKey)
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
      let dataArrayIndex = this.reportType[0]
      let legendData = []

      let reportData = this.data ? this.data['report'][dataArrayIndex] : []
      if (reportData.length > 0) {
        legendData.push(reportData[0]['DomainLabel'])
      } else {
        legendData.push('')
      }
      let reportSeries = _.map(reportData, (_) => _[this.chartType])
      let compareDatas = []
      if (this.data && this.compareKey.length > 0) {
        _.each(this.compareKey, (v) => {
          let data = this.data[v] ? this.data[v][dataArrayIndex] : []
          legendData.push(data[0]['DomainLabel'] + ' ')
          let filter = _.map(data, (_) => _[this.chartType])
          compareDatas.push(filter)
        })
      }
      let series
      let xBar
      switch (this.reportType[1]) {
        case 'DomainLabel':
          xBar = legendData
          series = []
          break
        case 'DateTime':
          // let compareSeries = _.map(compareData, (_) => _[this.chartType])
          xBar = this.data ? _.map(this.data['report'][dataArrayIndex], (_) => _[this.reportType[1]]) : []
          series = [{name: legendData[0], type: 'line', data: reportSeries}]
          if (compareDatas.length > 0) {
            for (let i = 0; i < compareDatas.length - 1; i++) {
              series.push({
                name: legendData[i + 1],
                type: 'line',
                data: compareDatas[i]
              })
            }
            series.push({
              name: legendData[compareDatas.length],
              type: 'line',
              stack: 'compare',
              data: compareDatas[compareDatas.length - 1]
            })
          }
          break
      }
      let bar = {
        color: theme.color,
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          type: 'scroll',
          width: 600,
          data: legendData
        },
        grid: {
          left: '3%',
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
  async mounted () {
    this.selectMalls.push(this.selectedMall.Id)
    this.onQuery()
  }
}
</script>

<style scoped>

</style>
