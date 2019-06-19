<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <zone-selector :zone-types="zoneTypes" ref=zoneSelector></zone-selector>
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
        <el-radio-button :label="'GenderAge'">{{$t('genderage')}}</el-radio-button>
        <el-radio-button :label="'NewOldCustomer'">{{$t('newoldcustomer')}}</el-radio-button>
      </el-radio-group>
      <chart :options="chartOption"
             style="width:100%"
             :autoResize="true"></chart>
    </div>
  </div>
</template>

<script>
import {mapState} from 'vuex'
import moment from 'moment'
import theme from '../lib/theme'

const legendDefault = () => ({
  name: '',
  type: 'bar',
  tooltip: {
    trigger: 'item',
    formatter: '{b0}<br/>{a} : {c0}%'
  },
  data: []
})
const pieDefault = () => ({
  type: 'pie',
  radius: '55%',
  center: ['20%', '50%'],
  tooltip: {
    trgger: 'item',
    formatter: '{b} : {d}%'
  },
  data: []
})
export default {
  data: () => ({
    chartType: 'GenderAge',
    zoneTypes: ['Face'],
    dateRangeValue: [moment().subtract(7, 'days'), moment().subtract(1, 'days')]
  }),
  methods: {
    onQuery () {

    }
  },
  computed: {
    ...mapState('app', {
      weekMonthPickerOptions: state => state.weekMonthPickerOptions
    }),
    chartOption () {
      let categoryY = ['≥16', '16~30', '31~45', '46~60', '61≤']
      let title01
      let title02 = this.$t('age_ratio')
      let seriesData = []
      let legendData = []
      switch (this.chartType) {
        case 'GenderAge':
          title01 = this.$t('gender_ratio')
          legendData.push(this.$t('customer'))
          let customer = legendDefault()
          customer.name = this.$t('customer')
          customer.data = [10, 20, 50, 10, 10]
          seriesData.push(customer)
          let pie = pieDefault()
          pie.data = [{name: this.$t('male'), value: 50}, {name: this.$t('female'), value: 60}]
          seriesData.push(pie)
          break
        case 'NewOldCustomer':
          title01 = this.$t('new_old_customer_ratio')
          legendData = [this.$t('newcustomer'), this.$t('oldcustomer')]
          let nc = legendDefault()
          nc.name = this.$t('newcustomer')
          nc.data = [10, 20, 50, 10, 10]
          seriesData.push(nc)
          let oc = legendDefault()
          oc.name = this.$t('oldcustomer')
          oc.data = [5, 15, 45, 15, 5]
          seriesData.push(oc)
          let nopie = pieDefault()
          nopie.data = [{name: nc.name, value: 50}, {name: oc.name, value: 60}]
          seriesData.push(nopie)
          break
      }
      let chart = {
        color: theme.color,
        title: [
          {
            x: '20%',
            textAlign: 'center',
            text: title01
          },
          {
            x: '50%',
            textAlign: 'center',
            text: title02
          }
        ],
        tooltip: {},
        grid: [
          {right: '40%'},
          {left: '50%'}
        ],
        legend: {
          left: '60%',
          data: legendData
        },
        xAxis: [
          {
            gridIndex: 1,
            type: 'value',
            axisLabel: {
              formatter: '{value} %'
            },
            min: 0,
            max: 100
          }
        ],
        yAxis:
          [
            {
              gridIndex: 1,
              type: 'category',
              data: categoryY
            }
          ],
        series: seriesData
      }
      Object.freeze(chart)
      return chart
    }
  }
}
</script>

<style scoped>

</style>
