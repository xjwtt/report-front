<template>
  <div>
    <el-button @click="exportExcel">{{$t('export')}}</el-button>
    <el-table id="trafficeTable"
              :data="data"
              stripe
              border
              style="width: 100%"
              max-height="250"
              :span-method="objectSpanMethod">
      <el-table-column v-for="column in columns"
                       :key="column.Id"
                       :prop="column.prop"
                       :label="column.label"
                       :sortable="true"
                       :fixed="column.fixed"
                       :min-width="column.width">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'underscore'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'TrafficeTable',
  props: {
    columnsInit: {
      type: Array,
      required: true
    },
    charTypes: {
      type: Array,
      required: true
    },
    tableType: {
      type: String,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    }
  },
  methods: {
    exportExcel () {
      let fix = document.querySelector('.el-table__fixed')
      let id = '#trafficeTable'
      let wb
      if (fix) {
        wb = XLSX.utils.table_to_book(document.querySelector(id).removeChild(fix))
        document.querySelector(id).appendChild(fix)
      } else {
        /* generate workbook object from table */
        wb = XLSX.utils.table_to_book(document.querySelector(id))
      }
      /* get binary string as output */
      var wbout = XLSX.write(wb, {bookType: 'xlsx', bookSST: false, type: 'array'})
      try {
        FileSaver.saveAs(new Blob([wbout], {type: 'application/octet-stream'}), 'exportExcel.xlsx')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, wbout)
      }
      return wbout
    },
    objectSpanMethod ({row, column, rowIndex, columnIndex}) {
      if (columnIndex === 0) {
        if (this.spanArr[rowIndex]) {
          return {
            rowspan: this.spanArr[rowIndex],
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    }
  },
  computed: {
    spanArr () {
      let arr = []
      let contactDot = 0
      let tableData = this.data
      tableData.forEach((item, index) => {
        if (index === 0) {
          arr.push(1)
        } else {
          if (item.location === tableData[index - 1].location) {
            arr[contactDot] += 1
            arr.push(0)
          } else {
            contactDot = index
            arr.push(1)
          }
        }
      })
      return arr
    },
    columns () {
      let columns = this.columnsInit
      switch (this.tableType) {
        case 'TimeLabel':
          let xSelector = (_) => _[this.tableType]
          columns = columns.concat(['type', 'total'])
          columns = columns.concat(this.tableData ? _.map(this.tableData, xSelector) : [])
          break
        case 'DomainLabel':
          columns = columns.concat(this.charTypes)
          break
      }
      let that = this
      let result = _.map(columns, function (it) {
        let re = {
          prop: it,
          fixed: false,
          label: it,
          width: it.length * 12 < 100 ? 100 : it.length * 12,
          formatter: (row, col) => row[it]
        }
        switch (it) {
          case 'location':
          case 'type':
          case 'total':
            re.label = that.$t(it)
            re.fixed = true
            break
        }
        return re
      })
      return result
    },
    data () {
      let that = this
      let dataObjecy = {}
      switch (that.tableType) {
        case 'TimeLabel':
          _.each(that.tableData, function (d) {
            _.each(that.charTypes, function (t) {
              let timeLabel = d.TimeLabel
              let key = d.DomainLabel + '_' + t
              if (!dataObjecy[key]) {
                dataObjecy[key] = {'location': d.DomainLabel, 'type': that.$t(t)}
              }
              dataObjecy[key][timeLabel] = d[t]
            })
          })
          let data = _.values(dataObjecy)
          _.each(data, function (d) {
            let values = _.values(d)
            let total = 0
            _.each(values, function (v) {
              if (!isNaN(v)) {
                total += v
              }
              d['total'] = total
            })
          })
          console.log(data)
          return data
        case 'DomainLabel':
          _.each(that.tableData, function (d) {
            _.each(that.charTypes, function (t) {
              let key = d.DomainLabel
              if (!dataObjecy[key]) {
                dataObjecy[key] = {'location': d.DomainLabel}
              }
              dataObjecy[key][t] = d[t]
            })
          })
          return _.values(dataObjecy)
      }
    }
  }
}
</script>

<style scoped>

</style>
