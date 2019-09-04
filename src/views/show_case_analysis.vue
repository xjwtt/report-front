<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <date-week-range-picker></date-week-range-picker>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
    <div class="report-page-card">
      <div>
        <el-select v-model="selectZone" placeholder="...">
          <el-option
            v-for="item in allZones"
            :key="item.Name"
            :label="item.Name"
            :value="item.Name">
          </el-option>
        </el-select>
      </div>
      <chart :options="chartOption"
             style="width:100%"
             :autoResize="true"></chart>
    </div>
    <div class="report-page-card">
      <base-bigdata-table :fixed-col="0"
                          :header="header"
                          :table-data-handled="tableDataHandled"
                          :export-name="'show_case_analysis'"></base-bigdata-table>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import fm from '@/lib/fieldsManager'
import _ from 'underscore'
import theme from '../lib/theme'

export default {
  data: () => ({
    zoneTypes: ['Shelf'],
    data: [],
    dateFields: ['EntranceCount', 'PassCount', 'DisplayRate', 'StayCount', 'AttractionRate', 'AverageStay'],
    allZones: [],
    zoneIds: [],
    selectZone: ''
  }),
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      this.data = await this.query({
        'report': {
          st: this.peakTimeDateRange[0],
          et: this.peakTimeDateRange[1],
          dateFields: this.dateFields,
          groupBy: [
            {domain: 'Zone', period: 'All', timeFormatter: 'All'},
            {domain: 'Zone', period: '1d', timeFormatter: 'yyyy-MM-dd'}
          ],
          PhyIds: this.zoneIds
        }
      })
    }
  },
  computed: {
    ...mapState('app', {
      peakTimeDateRange: state => state.peakTimeDateRange,
      selectedMall: state => state.selectedMall
    }),
    header () {
      return this.headerTitle[0]
    },
    headerTitle () {
      let header = [this.$t('location_of_show_case')]
      let title = [['DomainLabel', {}]]
      for (let index = 0; index < this.dateFields.length; index++) {
        let fieldName = this.dateFields[index]
        let field = fm[fieldName]
        if (field) {
          header.push(this.$t(field.displayI18Key))
          title.push([fieldName, field])
        }
      }
      let result = [header, title]
      return result
    },
    tableDataHandled () {
      let that = this
      let data = this.data['report'] ? this.data['report'][0] : []
      let result = []
      _.each(data, (d) => {
        let temp = []
        _.each(that.headerTitle[1], (v) => {
          let value = d[v[0]]
          if (v[1] && v[1].tableDisplayFunc) {
            value = v[1].tableDisplayFunc(value)
          }
          temp.push(value)
        })
        result.push(temp)
      })
      return result
    },
    chartOption () {
      let yAxisNameRight = this.$t('percent')
      let entranceCountName = this.$t('entranceCount')
      let passCountName = this.$t('passCount')
      let stayCountName = this.$t('stayCount')
      let attractionRateName = this.$t('attractionRate')
      let minName = this.$t('min')
      let maxName = this.$t('max')

      let legendData = [passCountName, stayCountName, attractionRateName]
      let report = this.data['report'] ? this.data['report'] : []
      let report1 = _.filter(report[1], (it) => it.DomainLabel === this.selectZone)
      let xData = _.map(report1, (it) => it.TimeLabel)
      let passCount = _.map(report1, (it) => it.PassCount)
      let stayCount = _.map(report1, (it) => it.StayCount)
      let attractionRate = _.map(report1, (it) => it.AttractionRate)

      let funnelData = []
      let report0 = _.filter(report[0], (it) => it.DomainLabel === this.selectZone)
      if (report0[0]) {
        funnelData = [
          {value: report0[0].EntranceCount, name: entranceCountName},
          {value: report0[0].PassCount, name: passCountName},
          {value: report0[0].StayCount, name: stayCountName}]
      }

      let chart = {
        color: theme.color,
        title: [],
        tooltip: {
          trigger: 'axis'
        },
        grid: [
          {right: '70%'},
          {left: '30%'}
        ],
        legend: {
          left: '40%',
          data: legendData
        },
        xAxis: [
          {
            gridIndex: 1,
            type: 'category',
            boundaryGap: true,
            data: xData,
            axisLabel: {
              rotate: 45
            }
          }
        ],
        yAxis: [{
          gridIndex: 1,
          type: 'value',
          axisLabel: {
            formatter: '{value} '
          }
        }, {
          gridIndex: 1,
          type: 'value',
          name: yAxisNameRight,
          axisLabel: {
            'formatter': '{value}% '
          }
        }],
        series: [{
          name: passCountName,
          type: 'bar',
          barGap: '-50%',
          large: true,
          silent: true,
          data: passCount
        }, {
          name: stayCountName,
          /* z值小的图形会被z值大的图形覆盖 */
          z: 10,
          type: 'bar',
          large: true,
          silent: true,
          data: stayCount
        }, {
          name: attractionRateName,
          z: 11,
          type: 'line',
          silent: true,
          yAxisIndex: 1,
          data: attractionRate,
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
          type: 'funnel',
          left: '0%',
          width: '20%',
          sort: 'none',
          label: {
            show: true,
            position: 'right',
            formatter: '{b} {c}'
          },
          data: funnelData
        }
        ]
      }
      Object.freeze(chart)
      return chart
    }
  },
  watch: {
    selectedMall: {
      async handler (newValue) {
        let tempMap = _.groupBy(newValue.PhysicalZones, (v) => v.ZoneTypeName)
        let result = []
        for (let i = 0, len = this.zoneTypes.length; i < len; i++) {
          let key = this.zoneTypes[i]
          let temp = tempMap[key]
          if (temp) {
            result = temp
          }
        }
        this.selectZone = ''
        this.allZones = []
        this.zoneIds = []
        _.each(result, (v) => {
          this.zoneIds.push(v.Id)
          this.allZones.push({'Name': v.Name})
        })
        if (this.allZones.length > 0) {
          this.selectZone = this.allZones[0].Name
        }
        if (this.zoneIds.length > 0) {
          this.onQuery()
        } else {
          this.data = []
        }
      },
      immediate: true
    }
  }
}
</script>

<style scoped>

</style>
