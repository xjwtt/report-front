<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
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
        <el-radio-button :label="'GenderAge'">{{$t('genderage')}}</el-radio-button>
        <!--        <el-radio-button :label="'NewOldCustomer'">{{$t('newoldcustomer')}}</el-radio-button>-->
      </el-radio-group>
      <chart :options="chartOption"
             style="width:100%"
             :autoResize="true"></chart>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import moment from 'moment'
import theme from '../lib/theme'
import _ from 'underscore'

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
    data: null,
    chartType: 'GenderAge',
    dateRangeValue: [moment().subtract(7, 'days'), moment().subtract(1, 'days')]
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      this.data = await this.query({
        'report': {
          dateFields: ['Gender', 'AgeType'],
          groupBy: [
            {domain: 'All', period: 'All', timeFormatter: 'All'}
          ],
          mallIds: [this.selectedMall.Id]
        }
      })
    }
  },
  computed: {
    ...mapState('app', {
      selectedMall: state => state.selectedMall
    }),
    chartOption () {
      let categoryY = ['0-18', '19-35', '36-55', '56+']
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
          customer.data = []
          let ageRatio = this.data ? this.data.report[0][0].AgeRatio : {}
          let total = 0
          _.each(ageRatio, (v) => {
            total += v
          })
          _.forEach(categoryY, (v) => {
            let n = ageRatio[v] ? ageRatio[v] : 0
            let ratio = total !== 0 ? Math.round(n * 100 / total) : 0
            customer.data.push(ratio)
          })
          seriesData.push(customer)
          let pie = pieDefault()
          let male = this.data ? this.data.report[0][0].Male : 0
          let female = this.data ? this.data.report[0][0].Female : 0
          pie.data = [{name: this.$t('male'), value: male}, {name: this.$t('female'), value: female}]
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
  },
  mounted () {
    this.onQuery()
  }
}
</script>

<style scoped>

</style>
