<template>
  <div class="report-page">
    <div class="report-page-card">
      <interval-picker-hourlyweek ref=intervalPickerHourlyweek></interval-picker-hourlyweek>
      <date-range-picker></date-range-picker>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
    <div class="report-page-card">
      <el-radio-group v-model="chartType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label="'Enter'">{{$t('enter')}}</el-radio-button>
        <el-radio-button :label="'Exit'">{{$t('exit')}}</el-radio-button>
        <!--<el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>-->
      </el-radio-group>
      <chart style="width:100%"
             :autoResize="true"
             :options="chartOption"
             theme="vintage"></chart>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import _ from 'underscore'
import moment from 'moment'
import weekFun from '@/lib/weekFun'

export default {
  name: 'peak_time',
  data: () => ({
    data: null,
    chartType: 'Enter',
    dateStyle: null
  }),
  methods: {
    ...mapActions('hourlyweek', ['query']),
    async onQuery () {
      this.dateStyle = this.$refs.intervalPickerHourlyweek.dateStyle
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
    chartOption () {
      let that = this
      let yAxisName = this.$t('man_time')
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let avgName = this.$t('avg')
      let allData = this.data ? this.data['report'][0] : []
      let mallData = this.data ? this.data['report'][1] : []
      let xDar = []
      let yBar = []
      switch (that.dateStyle) {
        case '60m':
          xDar = _.map(allData, function (v) {
            return moment(v.DateTime, 'YYYY-MM-DD HH:mm:ss').format('HH')
          })
          let domainLabelGroup = _.groupBy(allData, function (v) {
            return moment(v.DateTime, 'YYYY-MM-DD HH:mm:ss').format('HH')
          })
          _.each(xDar, function (k) {
            let d = domainLabelGroup[k]
            if (d) {
              let t = 0
              _.each(d, function (v) {
                t += v[that.chartType]
              })
              yBar.push(t)
            }
          })
          break
        case '1d':
          const t = key => this.$t(key)
          xDar = _.map(allData, function (v) {
            return weekFun.GetWeek(t, v.DateTime, 'YYYY-MM-DD HH:mm:ss')
          })
          console.log(allData)
      }
      debugger
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
          data: xDar,
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
    }
  }
}
</script>

<style scoped>

</style>
