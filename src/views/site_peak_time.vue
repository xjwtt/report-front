<template>
  <div class="report-page">
    <div class="report-page-card">
      <div>
        <span>{{ $t('date_range') }}：</span>
        <el-date-picker v-model="dateRangeValue"
                        type="daterange"
                        :placeholder="$t('selection_date')"
                        :range-separator="' - '"
                        :editable="false"
                        :clearable="false"
                        style="width:220px;"
                        size="small"
                        :picker-options="weekMonthPickerOptions">
        </el-date-picker>
      </div>
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

export default {
  data: () => ({
    data: null,
    dateRangeValue: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
    chartType: 'Enter',
    dateFields: ['Enter', 'Exit', 'Stay']
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      this.data = await this.query({
        'report': {
          st: this.dateRangeValue[0],
          et: this.dateRangeValue[1],
          dateFields: this.dateFields,
          groupBy: [
            {domain: 'All', period: '60m', timeFormatter: 'yyyy-MM-dd HH:mm'}
          ]
        }
      })
    }
  },
  computed: {
    ...mapState('app', {
      weekMonthPickerOptions: state => state.weekMonthPickerOptions
    }),
    chartOption () {
      let that = this
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
        return moment(v).format('MM-DD')
      })
      debugger
      let option = {
        tooltip: {
          position: 'top',
          formatter: function (p) {
            return days[p.data[0]] + ' ' + hours[p.data[1]] + '<br/>' + p.seriesName + ' : ' + p.data[2]
          }
        },
        animation: false,
        grid: {
          height: '75%',
          y: '10%'
        },
        xAxis: {
          type: 'category',
          data: days,
          splitArea: {
            show: true
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
              '#c1e9e6',
              '#74add1',
              '#4575b4',
              '#313695']
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
  },
  async mounted () {
    this.onQuery()
  }
}
</script>

<style scoped>

</style>
