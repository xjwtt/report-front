<template>
  <div class="report-page">
    <div class="report-page-card">
      <interval-picker ref=intervalPicker></interval-picker>
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
        <el-radio-button :label='[1,"DateTime"]'>{{$t('time_group')}}</el-radio-button>
        <el-radio-button :label='[0,"DomainLabel"]'>{{$t('location_group')}}</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="chartType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label="'Enter'">{{$t('enter')}}</el-radio-button>
        <!--<el-radio-button :label="'Exit'">{{$t('exit')}}</el-radio-button>-->
        <!--<el-radio-button :label="'Stay'">{{$t('stay')}}</el-radio-button>-->
      </el-radio-group>
      <chart style="width:100%"
             :autoResize="true"
             :options="chartOption"
             theme="light"></chart>

    </div>
    <div class="report-page-card">
      <traffice-table-fast :columnsInit=columnsInit
                           :charTypes=charTypes
                           :tableType=tableType
                           :tableData=tableData
                           :headerData=headerData
                           :fixedHeader=fixedHeader>
      </traffice-table-fast>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import _ from 'underscore'
import weekFun from '@/lib/weekFun'

export default {
  data: () => ({
    data: null,
    reportType: [1, 'DateTime'],
    chartType: 'Enter',
    dateFields: ['Enter'],
    charTypes: ['Enter', 'Exit'],
    fixedHeader: [],
    dateStyle: null
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      this.dateStyle = this.$refs.intervalPicker.dateStyle
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
    }
  },
  computed: {
    columnsInit () {
      return ['location']
    },
    tableData () {
      let dataArrayIndex = this.reportType[0]
      return this.data ? this.data['report'][dataArrayIndex] : []
    },
    headerData () {
      let dataArrayIndex = this.reportType[0]
      let data = this.data ? this.data['report'][dataArrayIndex] : []
      let type = this.reportType[1]
      if (this.dateStyle === '1d' && type === 'DateTime') {
        _.each(data, function (value) {
          value[type] = weekFun.GetWeek(value[type], 'YYYY-MM-DD HH:mm:ss')
        })
      }
      return data
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
      let result = {
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
          data: xData,
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
          name: dataType,
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
          data: yData
        }]
      }
      switch (dataType) {
        case 'DomainLabel':
          result.toolbox = {
            show: true,
            feature: {
              dataZoom: {
                yAxisIndex: 'none'
              },
              dataView: {readOnly: false},
              magicType: {type: ['line', 'bar']},
              restore: {},
              saveAsImage: {}
            }
          }
      }
      Object.freeze(result)
      return result
    }
  },
  async mounted () {
    this.onQuery()
  }
}
</script>
