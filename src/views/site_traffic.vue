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
      <traffice-table02 :columnsInit=columnsInit
                      :charTypes=charTypes
                      :tableType=tableType
                      :tableData=tableData>
      </traffice-table02>
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
        'report': {
          dateFields: this.dateFields,
          groupBy: [
            // {domain: 'Mall'},
            {domain: 'Mall', period: 'All', timeFormatter: 'All'},
            {domain: 'All'}
            // {domain: 'All', period: 'All', timeFormatter: 'All'}
          ]
        }
      })
    },
    updateCharts () {
      let dataType = this.$t('enter')
      let yAxisName = this.$t('man_time')
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let avgName = this.$t('avg')

      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      let ySelector = (_) => _[this.chartType]

      let xData = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : []
      let yData = this.data ? _.map(this.data['report'][dataArrayIndex], ySelector) : []
      let result = {
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
      Object.freeze(result)
      this.$refs.chart.mergeOptions(result)
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
      return this.data ? this.data['report'][dataArrayIndex] : []
    },
    tableType () {
      return this.reportType[1]
    },
    chartOption () {
      let dataType = this.$t('enter')
      let yAxisName = this.$t('man_time')
      let minName = this.$t('min')
      let maxName = this.$t('max')
      let avgName = this.$t('avg')

      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      let ySelector = (_) => _[this.chartType]

      let xData = this.data ? _.map(this.data['report'][dataArrayIndex], xSelector) : []
      let yData = this.data ? _.map(this.data['report'][dataArrayIndex], ySelector) : []
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
  },
  async mounted () {
    let watched = ['reportType', 'data']
    watched.forEach(prop => {
      this.$watch(prop, () => {
        this.updateCharts()
      }, {immediate: true})
    })
  }
}
</script>
