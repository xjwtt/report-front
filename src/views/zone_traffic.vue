<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <zone-selector ref=zoneSelector></zone-selector>
      <interval-picker></interval-picker>
      <date-range-picker></date-range-picker>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">查询</el-button>
    </div>
    <div class="report-page-card">
      总出入客流分时图
      <el-radio-group v-model="reportType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label='[2,"TimeLabel"]'>分时</el-radio-button>
        <el-radio-button :label='[1,"DomainLabel"]'>分布</el-radio-button>
      </el-radio-group>
      <el-radio-group v-model="chartType"
                      style="vertical-align: middle;"
                      size="mini">
        <el-radio-button :label="'Enter'">{{$t('客流数')}}</el-radio-button>
        <!-- <el-radio-button :label="'Exit'">离开客流</el-radio-button> -->
        <!-- <el-radio-button :label="'Stay'">滞留</el-radio-button> -->
      </el-radio-group>
      <chart style="width:100%"
             :autoResize="true"
             :options="chartOption"
             theme="light"></chart>

    </div>
    <div class="report-page-card">
      <v-table :width="1000"
               :columns="columns"
               :table-data="tableData"
               :show-vertical-border="false"></v-table>

    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import _ from 'underscore'
export default {
  data: () => ({
    data: null,
    reportType: [2, 'TimeLabel'],
    chartType: 'Enter',
    tableData: [
      { 'name': '赵伟', 'tel': '156*****1987', 'hobby': '钢琴、书法、唱歌', 'address': '上海市黄浦区金陵东路569号17楼' },
      { 'name': '李伟', 'tel': '182*****1538', 'hobby': '钢琴、书法、唱歌', 'address': '上海市奉贤区南桥镇立新路12号2楼' },
      { 'name': '孙伟', 'tel': '161*****0097', 'hobby': '钢琴、书法、唱歌', 'address': '上海市崇明县城桥镇八一路739号' },
      { 'name': '周伟', 'tel': '197*****1123', 'hobby': '钢琴、书法、唱歌', 'address': '上海市青浦区青浦镇章浜路24号' },
      { 'name': '吴伟', 'tel': '183*****6678', 'hobby': '钢琴、书法、唱歌', 'address': '上海市松江区乐都西路867-871号' }
    ],
    columns: [
      { field: 'name', title: '姓名', width: 100, titleAlign: 'center', columnAlign: 'center' },
      { field: 'tel', title: '手机号码', width: 260, titleAlign: 'center', columnAlign: 'center' },
      { field: 'hobby', title: '爱好', width: 330, titleAlign: 'center', columnAlign: 'center' },
      { field: 'address', title: '地址', titleAlign: 'center', columnAlign: 'left' }
    ]
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      this.data = await this.query({
        dateFields: ['Enter', 'Exit', 'Stay', 'ConvertRate', 'HighTemp', 'LowTemp', 'WeatherName', 'WeatherImages'],
        groupBy: [
          { domain: 'Zone' },
          { domain: 'Zone', period: 'All', timeFormatter: 'All' },
          { domain: 'All' },
          { domain: 'All', period: 'All', timeFormatter: 'All' }
        ],
        PhyIds: this.$refs.zoneSelector.zoneIds
      })
    }
  },
  computed: {
    chartOption () {
      let fields = ['Enter', 'Exit', 'Stay']
      if (this.data) {
        let table = []
        let grouped = _.groupBy(this.data.Report[0], (_) => _.DomainLabel)
        for (let mallName in grouped) {
          let mall = grouped[mallName]
          for (let fieldIndex in fields) {
            let field = fields[fieldIndex]
            let row = { mallName: mallName, metric: field }
            _.each(mall, (_) => {
              row[_['TimeLabel']] = _[field]
            })
            table.push(row)
          }
        }
      }

      let dataType = this.$t('客流数')
      let yAxisName = this.$t('人次')
      let minName = this.$t('最小值')
      let maxName = this.$t('最大值')
      let avgName = this.$t('平均值')

      let dataArrayIndex = this.reportType[0]
      let xSelector = (_) => _[this.reportType[1]]
      let ySelector = (_) => _[this.chartType]

      let xData = this.data ? _.map(this.data.Report[dataArrayIndex], xSelector) : null
      let yData = this.data ? _.map(this.data.Report[dataArrayIndex], ySelector) : null

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
  async mounted () {
    this.onQuery()
  }
}
</script>
