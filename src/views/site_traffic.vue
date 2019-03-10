<template>
  <div class="report-page">
    <div class="report-page-card">
      <interval-picker></interval-picker>
      <date-range-picker></date-range-picker>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
    <div class="report-page-card">
      {{$t('total_traffic_chart')}}
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
        <!--<el-radio-button :label="'Exit'">离开客流</el-radio-button>-->
        <!--<el-radio-button :label="'Stay'">滞留</el-radio-button>-->
      </el-radio-group>
      <chart style="width:100%"
             :autoResize="true"
             :options="chartOption"
             theme="light"></chart>

    </div>
    <div class="report-page-card">
      <traffice-table :columnsInit=columnsInit
                      :charTypes=charTypes
                      :tableType=tableType
                      :tableData=tableData>
      </traffice-table>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import _ from 'underscore'

export default {
  data: () => ({
    data: null,
    reportType: [1, 'TimeLabel'],
    chartType: 'Enter',
    dateFields: ['Enter'],
    charTypes: ['Enter']
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      this.data = await this.query({
        dateFields: this.dateFields,
        groupBy: [
          // {domain: 'Mall'},
          {domain: 'Mall', period: 'All', timeFormatter: 'All'},
          {domain: 'All'}
          // {domain: 'All', period: 'All', timeFormatter: 'All'}
        ]
      })
    }
  },
  computed: {
    columnsInit () {
      switch (this.reportType[1]) {
        case 'TimeLabel':
          return []
        case 'DomainLabel':
          return ['location']
      }
    },
    tableData () {
      let dataArrayIndex = this.reportType[0]
      return this.data ? this.data.Report[dataArrayIndex] : []
    },
    tableType () {
      return this.reportType[1]
    },
    chartOption () {
      let fields = ['Enter', 'Exit', 'Stay']
      if (this.data) {
        let table = []
        let grouped = _.groupBy(this.data.Report[0], (_) => _.DomainLabel)
        // _.each(grouped, _ => console.log(_))
        for (let mallName in grouped) {
          let mall = grouped[mallName]
          for (let fieldIndex in fields) {
            let field = fields[fieldIndex]
            let row = {mallName: mallName, metric: field}
            _.each(mall, (_) => {
              row[_['TimeLabel']] = _[field]
            })
            table.push(row)
          }
        }
      }

      let dataType = this.$t('进入客流')
      let yAxisName = this.$t('人次')
      let minName = this.$t('最小值')
      let maxName = this.$t('最大值')
      let avgName = this.$t('平均值')

      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      let ySelector = (_) => _[this.chartType]

      let xData = this.data ? _.map(this.data.Report[dataArrayIndex], xSelector) : []
      let yData = this.data ? _.map(this.data.Report[dataArrayIndex], ySelector) : []
      return {
        'title': {
          'text': ''
        },
        'tooltip': {
          'trigger': 'axis'
        },
        'grid': {
          'left': '3%',
          'right': '4%',
          'bottom': '3%',
          'containLabel': true
        },
        'toolbox': {
          'feature': {
            'saveAsImage': {}
          }
        },
        'xAxis': {
          'type': 'category',
          'boundaryGap': true,
          'data': xData,
          'axisLabel': {
            'rotate': 45
          }
        },
        'yAxis': [{
          'type': 'value',
          'name': yAxisName,
          'axisLabel': {
            'formatter': '{value} '
          }
        }],
        'series': [{
          'name': dataType,
          'type': 'bar',
          'stack': '',
          'markPoint': {
            'data': [{
              'type': 'max',
              'name': maxName
            }, {
              'type': 'min',
              'name': minName
            }]
          },
          'markLine': {
            'data': [{
              'type': 'average',
              'name': avgName
            }]
          },
          'data': yData
        }]
      }
    }
  },
  async created () {
    this.onQuery()
  }
}
</script>
