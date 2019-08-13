<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <zone-selector @executeQuery='executeQuery' :zone-types="zoneTypes" ref=zoneSelector></zone-selector>
      <interval-picker-day-w-m-y></interval-picker-day-w-m-y>
      <date-week-range-picker></date-week-range-picker>
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
        <el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>
      </el-radio-group>
      <chart style="width:100%;height: 500px"
             :autoResize="true"
             :options="chartOption"></chart>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import moment from 'moment'
import _ from 'underscore'
import i18n from '@/i18n'
import weekFun from '@/lib/weekFun'

export default {
  data: () => ({
    zoneTypes: ['Entrance', 'Corridor', 'Floor', 'Domain'],
    data: null,
    chartType: 'Enter',
    dateFields: ['Enter', 'Exit', 'Stay']
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let phyIds = this.$refs.zoneSelector.zoneIds
      this.executeQuery(phyIds)
    },
    async executeQuery (phyIds) {
      this.data = await this.query({
        'report': {
          st: this.peakTimeDateRange[0],
          et: this.peakTimeDateRange[1],
          dateFields: this.dateFields,
          groupBy: [
            // {domain: 'All', period: '60m', timeFormatter: 'yyyy-MM-dd HH:mm'}
            {domain: 'All', period: this.dayWMY.key, timeFormatter: this.dayWMY.timeFormatter}
          ],
          PhyIds: phyIds
        }
      })
    }
  },
  computed: {
    ...mapState('app', {
      dayWMY: state => state.dayWMY,
      peakTimeDateRange: state => state.peakTimeDateRange
    }),
    chartOption () {
      let that = this
      const t = key => i18n.t(key)
      let chartTypName = that.$t(that.chartType)
      let dateTimes = this.data ? _.map(this.data['report'][0], (_) => _['DateTime']) : []
      let min = 0
      let max = 10
      let daysObject = {}
      _.each(dateTimes, function (d) {
        let dm = moment(d)
        let date = dm.format('YYYY-MM-DD')
        let hour = dm.format('HH:mm')
        if (!daysObject[date]) {
          daysObject[date] = []
        }
        daysObject[date].push(hour)
      })
      let days = _.sortBy(Object.keys(daysObject), function (v) {
        return v
      })
      let hours = days.length > 0 ? daysObject[days[0]].reverse() : []

      let dataObject = {}
      if (this.data) {
        _.each(this.data['report'][0], function (v) {
          let key = moment(v['DateTime']).format('YYYY-MM-DD HH:mm')
          let value = v[that.chartType]
          min = min > value ? value : min
          max = value > max ? value : max
          dataObject[key] = value
        })
      }
      let series = []
      _.each(days, function (d, dIndex) {
        _.each(hours, function (h, hIndex) {
          let key = d + ' ' + h
          series.push([dIndex, hIndex, dataObject[key]])
        })
      })
      days = _.map(days, function (v) {
        switch (that.dayWMY.key) {
          case 'MonthPeak':
            return moment(v).format('YYYY-MM')
          case 'YearPeak':
            return moment(v).format('YYYY')
          default:
            return weekFun.GetDateWeek(t, v, 'YYYY-MM-DD', 'MM-DD')
        }
      })
      let option = {
        tooltip: {
          position: 'top',
          formatter: function (p) {
            return days[p.data[0]] + ' ' + hours[p.data[1]] + '<br/>' + p.seriesName + ' : ' + p.data[2]
          }
        },
        textStyle: {
          color: '#000000'
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        animation: false,
        grid: {
          height: '70%',
          y: '10%'
        },
        xAxis: {
          type: 'category',
          data: days,
          splitArea: {
            show: true
          },
          axisLabel: {
            rotate: 30
          }
        },
        yAxis: {
          type: 'category',
          data: hours,
          splitArea: {
            show: true
          }
        },
        visualMap: {
          min: min,
          max: max,
          calculable: true,
          orient: 'horizontal',
          left: 'center',
          inRange: {
            color: [
              '#FFFFCC',
              '#99CC33',
              '#CC9900'
            ]
          }
        },
        series: [{
          name: chartTypName,
          type: 'heatmap',
          data: series,
          label: {
            normal: {
              show: true
            }
          },
          itemStyle: {
            emphasis: {
              shadowBlur: 100,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }

      Object.freeze(option)
      return option
    }
  }
}
</script>

<style scoped>

</style>
