<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
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
      <the-table :fields=columnsFields
                 :data=columnsData
                 :max-height="300"
                 :export-name="'showCase_table'"></the-table>
    </div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import moment from 'moment'
import fm from '@/lib/fieldsManager'
import _ from 'underscore'
import theme from '../lib/theme'

export default {
  data: () => ({
    zoneTypes: ['Shelf'],
    data: [],
    dateRangeValue: [moment().subtract(7, 'days'), moment().subtract(1, 'days')],
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
          st: this.dateRangeValue[0],
          et: this.dateRangeValue[1],
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
      weekMonthPickerOptions: state => state.weekMonthPickerOptions,
      selectedMall: state => state.selectedMall
    }),
    columnsData () {
      return this.data['report'] ? this.data['report'][0] : []
    },
    columnsFields () {
      let locale = this.$i18n.locale
      let columns = [{
        width: 200,
        prop: 'DomainLabel',
        fixed: true,
        label: this.$t('location_of_show_case'),
        sortable: false,
        formatter: (row, col) => row['DomainLabel']
      }]
      for (let index = 0; index < this.dateFields.length; index++) {
        let fieldName = this.dateFields[index]
        let field = fm[fieldName]
        if (field) {
          columns.push({
            width: 150,
            prop: fieldName,
            fixed: false,
            label: this.$t(field.displayI18Key),
            sortable: false,
            formatter: (row, col) => field.tableDisplayFunc ? field.tableDisplayFunc(row[fieldName], locale) : row[fieldName]
          })
        }
      }
      return columns
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
        // let result = await this.$store.dispatch({
        //   type: 'zone/selectPZZTByMallIdZoneTypeEnable',
        //   data: {MallIds: [newValue.Id], ZoneTypes: this.zoneTypes}
        // })
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
