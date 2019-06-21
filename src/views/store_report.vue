<template>
  <div class="report-page">
    <div class="report-page-card">
      <el-date-picker v-model="dateRange"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="-"
                      :start-placeholder="$t('start_date')"
                      :end-placeholder="$t('end_date')"
                      :picker-options="pickerOptions">
      </el-date-picker>

      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
    <div>

    </div>
    <div class="report-page-card">
      <el-radio-group v-model="selectedFieldIndex"
                      size="small">
        <el-radio-button v-for="(field,key) in fieldsOptions"
                         :key="key"
                         :label="key">{{$t(field.displayI18Key)}}
        </el-radio-button>
      </el-radio-group>
      <chart :style="{width:'100%',height: chartOptions.height+'px'}"
             :autoResize="true"
             :options="chartOptions"
             :height="chartOptions.height"></chart>
    </div>
    <div class="report-page-card">
      <the-table :fields=columnsFields
                 :data=columnsData
                 :maxHeight="500"
                 :excel-name="'Store_Report'"></the-table>
    </div>
  </div>
</template>

<script>
import {mapActions} from 'vuex'
import moment from 'moment'
import fm from '@/lib/fieldsManager'
import _ from 'underscore'

export default {
  data () {
    return {
      selectedFieldIndex: 0,
      data: [],
      dateRange: [moment(), moment()],
      dateFields: ['Enter', 'EnteringRate',
        'Fitting', 'FittingRate',
        'ConvertRate', 'Sales', 'Receipts', 'Pieces', 'PricePerCustomer', 'PiecePerCustomer', 'PricePerReceipt', 'PiecePerReceipt', 'PricePerPiece',
        'Clerk', 'ClerkRatio', 'Acreage'
      ]
    }
  },
  methods: {
    ...mapActions('report', ['query']),
    async onQuery () {
      let result = await this.query({
        'report': {
          st: this.dateRange[0],
          et: this.dateRange[1],
          dateFields: this.dateFields,
          groupBy: [
            {domain: 'Mall', period: 'All', timeFormatter: 'All'}
          ]
        }
      })
      this.data = result['report'][0]
    }
  },
  async mounted () {
    await this.onQuery()
  },
  computed: {
    columnsData () {
      return _.sortBy(this.data, function (v) {
        return v.Enter
      }).reverse()
    },
    columnsFields () {
      let locale = this.$i18n.locale
      let columns = [{
        width: 200,
        prop: 'DomainLabel',
        fixed: true,
        label: this.$t('store'),
        sortable: false,
        formatter: (row, col) => row['DomainLabel']
      }]
      for (let index = 0; index < this.dateFields.length; index++) {
        let fieldName = this.dateFields[index]
        let field = fm[fieldName]
        if (field) {
          columns.push({
            width: 120,
            prop: fieldName,
            fixed: false,
            label: this.$t(field.displayI18Key),
            sortable: field.sortable ? field.sortable : false,
            formatter: (row, col) => field.tableDisplayFunc ? field.tableDisplayFunc(row[fieldName], locale) : row[fieldName]
          })
        }
      }
      return columns
    },
    chartOptions () {
      const titleHeight = 35
      const selectedFieldKey = this.dateFields[this.selectedFieldIndex]
      const selectedField = fm[selectedFieldKey]
      const sortData = selectedField.sortable ? _.sortBy(this.data, value => value[selectedFieldKey]) : this.data

      const ydata = _.map(sortData, value => value.DomainLabel)
      const xdata = _.map(sortData, value => value[this.dateFields[this.selectedFieldIndex]])
      const option = {
        color: ['#3398DB'],
        height: this.data.length * 45 + titleHeight + 15,
        title: {
          text: `${this.$t(selectedField.displayI18Key)} ${this.$t('chart')}`,
          x: 'center',
          y: 'top'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: titleHeight,
          left: '3%',
          right: '3%',
          height: this.data.length * 45,
          containLabel: true
        },
        xAxis: {
          type: 'value',
          name: selectedField.unitI18Key,
          nameLocation: 'center'
        },
        yAxis: {
          type: 'category',
          data: ydata,
          axisLabel: {
            interval: 0,
            rotate: -15
          }
        },
        series: [
          {
            type: 'bar',
            data: xdata
          }
        ]
      }
      return option
    },
    fieldsOptions () {
      return _.map(this.dateFields, value => fm[value])
    },
    pickerOptions () {
      return {
        shortcuts: [{
          text: this.$t('today'),
          onClick (picker) {
            let start = moment().subtract(0, 'days')
            picker.$emit('pick', [start, start])
          }
        }, {
          text: this.$t('yesterday'),
          onClick (picker) {
            let start = moment().subtract(1, 'days')
            picker.$emit('pick', [start, start])
          }
        }, {
          text: this.$t('week'),
          onClick (picker) {
            let end = moment().subtract(0, 'days')
            let start = moment().startOf('week')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('month'),
          onClick (picker) {
            let end = moment().subtract(0, 'days')
            let start = moment().startOf('month')
            picker.$emit('pick', [start, end])
          }
        }, {
          text: this.$t('year'),
          onClick (picker) {
            let end = moment().subtract(0, 'days')
            let start = moment().startOf('year')
            picker.$emit('pick', [start, end])
          }
        }
        ]
      }
    }
  }
}
</script>
