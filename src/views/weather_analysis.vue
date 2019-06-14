<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <zone-selector :zone-types="zoneTypes" ref=zoneSelector></zone-selector>
      <div>
        <span>{{$t('types_of_analysis')}}</span>
        <el-radio-group v-model="analysisType"
                        style="vertical-align: middle;"
                        size="mini">
          <el-radio-button :label="'WeatherName'">{{$t('weatherName')}}</el-radio-button>
          <el-radio-button :label="'Pm25'">{{$t('pm25')}}</el-radio-button>
          <el-radio-button :label="'HighTemp'">{{$t('highTemp')}}</el-radio-button>
          <el-radio-button :label="'LowTemp'">{{$t('lowTemp')}}</el-radio-button>
        </el-radio-group>
      </div>
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
        <!--<el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>-->
      </el-radio-group>
      <chart style="width:100%;"
             :autoResize="true"
             :options="chartOption"></chart>
    </div>
    <div class="report-page-card">
      <the-table :fields=columnsFields
                 :data=columnsData
                 :maxHeight="240"
                 :excel-name="'WeatherAnalysis'"></the-table>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import moment from 'moment'
import _ from 'underscore'
import theme from '../lib/theme'

export default {
  data: () => ({
    data: null,
    zoneTypes: ['Entrance', 'Domain', 'Floor', 'Corridor'],
    dateRangeValue: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
    analysisType: 'WeatherName',
    chartType: 'Enter',
    dateFields: ['Enter', 'Exit', 'WeatherName'],
    columnsData: []
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
            {domain: 'Zone', period: '1d', timeFormatter: 'yyyy-MM-dd'}
          ],
          PhyIds: this.$refs.zoneSelector.zoneIds
        }
      })
    }
  },
  computed: {
    ...mapState('app', {
      weekMonthPickerOptions: state => state.weekMonthPickerOptions
    }),
    columnsFields () {
      let chartTypeName = this.$t(this.chartType)
      let dailyAverage = this.$t('daily_average') + chartTypeName
      let columns = [
        {
          width: 150,
          prop: 'Key',
          fixed: true,
          label: this.$t(this.analysisType),
          sortable: false,
          formatter: (row, col) => row['Key']
        },
        {
          width: 100,
          prop: 'Days',
          fixed: true,
          label: this.$t('days'),
          sortable: false,
          formatter: (row, col) => row['Days']
        },
        {
          width: 120,
          prop: 'Data',
          fixed: true,
          label: chartTypeName,
          sortable: false,
          formatter: (row, col) => row['Data']
        },
        {
          width: 120,
          prop: 'AvgData',
          fixed: true,
          label: dailyAverage,
          sortable: false,
          formatter: (row, col) => row['AvgData']
        }
      ]
      return columns
    },
    chartOption () {
      let that = this
      that.columnsData = []
      let yAxisName = that.$t('man_time')
      let minName = that.$t('min')
      let maxName = that.$t('max')
      let chartTypeName = that.$t(that.chartType)
      let dailyAverage = that.$t('daily_average') + chartTypeName
      let data = that.data ? that.data['report'][0] : []
      let xData = []
      let y1Data = []
      let y2Data = []
      switch (that.analysisType) {
        case 'WeatherName':
          let groupBy = _.groupBy(data, (_) => _[that.analysisType])
          _.each(groupBy, function (value, key) {
            let w = {'Key': key, 'Days': 0, 'Data': 0, 'AvgData': 0}
            _.each(value, function (v) {
              w.Days += 1
              w.Data = v[that.chartType]
            })
            xData.push(key)
            y1Data.push(w.Data)
            if (w.Days > 0) {
              w.AvgData = Math.round(w.Data / w.Days)
            }
            y2Data.push(w.AvgData)
            that.columnsData.push(w)
          })
          break
        case 'Pm25':
        case 'HighTemp':
        case 'LowTemp':
          let range = 3
          if (that.analysisType === 'Pm25') {
            range = 10
          }
          let min = 0
          let max = 0
          // 查找出最大值和最小值
          _.each(data, function (value, index) {
            let v = value[that.analysisType]
            if (index === 0) {
              min = v
              max = v
            } else {
              if (min > v) {
                min = v
              }
              if (max < v) {
                max = v
              }
            }
          })
          do {
            let Min = min
            let Max = min + range - 1
            let key = Min + '-' + Max
            let w = {'Key': key, 'Days': 0, 'Data': 0, 'AvgData': 0, 'Min': Min, 'Max': Max}
            that.columnsData.push(w)
            min = min + range
          } while (min <= max)
          _.each(that.columnsData, function (w) {
            _.each(data, function (d) {
              let v = d[that.analysisType]
              if (v >= w['Min'] && v <= w['Max']) {
                w['Days'] += 1
                w['Data'] += d[that.chartType]
              }
            })
            xData.push(w['Key'])
            y1Data.push(w['Data'])
            if (w.Days > 0) {
              w.AvgData = Math.round(w.Data / w.Days)
            }
            y2Data.push(w.AvgData)
          })
          break
      }

      let bar = {
        color: theme.color,
        title: {
          text: ''
        },
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: [chartTypeName, dailyAverage]
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
            formatter: '{value}'
          }
        }],
        series: [{
          name: chartTypeName,
          type: 'bar',
          stack: '',
          data: y1Data,
          markPoint: {
            data: [{
              type: 'max',
              name: maxName
            }, {
              type: 'min',
              name: minName
            }]
          }
        }, {
          name: dailyAverage,
          type: 'line',
          data: y2Data
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
