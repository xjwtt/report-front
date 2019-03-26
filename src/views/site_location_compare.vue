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
        <el-radio-button :label='[1,"TimeLabel"]'>{{$t('time_group')}}</el-radio-button>
        <el-radio-button :label='[0,"DomainLabel"]'>{{$t('location_group')}}</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="chartType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label="'Enter'">{{$t('enter')}}</el-radio-button>
        <el-radio-button :label="'Exit'">{{$t('exit')}}</el-radio-button>
        <!-- <el-radio-button :label="'Stay'">滞留</el-radio-button> -->
      </el-radio-group>
      <chart style="width:100%"
             :autoResize="true"
             :options="chartOption"
             theme="light"></chart>

    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  name: 'site_location_compare',
  data () {
    return {
      reportType: [1, 'TimeLabel'],
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
            {domain: 'Zone'}
          ],
          mallIds: [this.$refs.mallSelect.mallId]
        },
        'compare': {
          dateFields: ['Enter', 'Exit', 'HighTemp', 'LowTemp', 'WeatherName'],
          groupBy: [
            {domain: 'Zone'}
          ],
          mallIds: [this.$refs.mallSelect.compareMallId]
        }
      })
    }
  },
  computed: {
    chartOption () {
      let yAxisNameLeft = this.$t('man_time')
      let legendData = ['直接访问', '邮件营销']
      let xData = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      return {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: legendData
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          data: xData
        },
        yAxis: [{
          type: 'value',
          name: yAxisNameLeft,
          axisLabel: {
            formatter: '{value} '
          }
        }]
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
