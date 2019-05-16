<template>
  <canvas-datagrid ref="a1" v-bind.prop='data'></canvas-datagrid>
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
    },
    computedFieldTotal () {

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
          // prop: it,
          // fixed: false,
          name: it
          // editable: false,
          // title: it,
          // dataTypeName: it
          // label: it,
          // width: it.length * 12 < 120 ? 120 : it.length * 12,
          // formatter: (row, col) => row[it]
        }
        switch (it) {
          case 'location':
          case 'type':
          case 'total':
            re.title = that.$t(it)
            // re.label = that.$t(it)
            // re.fixed = true
            break
        }
        return re
      })
      return result
    },
    bigData () {
      let that = this
      let dataObject = {}
      _.each(that.tableData, function (d) {
        let domainLabel = d.DomainLabel
        if (!dataObject[domainLabel]) {
          dataObject[domainLabel] = []
        }
        dataObject[domainLabel].push(d)
      })
      let data = []
      switch (that.tableType) {
        case 'TimeLabel':
          _.each(dataObject, function (values, key) {
            _.each(that.charTypes, function (t) {
              let charTypesData = [key, t]
              switch (t) {
                case 'Enter':
                case 'Exit':
                  let total = 0
                  let timeData = []
                  _.each(values, function (value) {
                    total += value[t]
                    timeData.push(value[t])
                  })
                  charTypesData.push(total)
                  charTypesData = charTypesData.concat(timeData)
                  break
              }
              data.push(charTypesData)
            })
          })
          return {'data': data, 'schema': this.columns}
        case 'DomainLabel':
          _.each(dataObject, function (values, key) {
            let charTypesData = [key]
            _.each(values, function (value) {
              _.each(that.charTypes, function (t) {
                charTypesData.push(value[t])
              })
              data.push(charTypesData)
            })
          })
          return {'data': data}
      }
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
                dataObjecy[key] = {'location': d.DomainLabel, 'type': that.$t(t), 'key': t}
              }
              dataObjecy[key][timeLabel] = d[t]
            })
          })
          let data = _.values(dataObjecy)
          _.each(data, function (d) {
            d.editable = false
            switch (d.key) {
              case 'EnteringRate':
                d['total'] = ''
                break
              default:
                let values = _.values(d)
                let total = 0
                _.each(values, function (v) {
                  if (!isNaN(v)) {
                    total += v
                  }
                  d['total'] = parseInt(total * 100) / 100
                })
            }
          })
          return {'data': data, 'schema': this.columns}
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
          return {'data': _.values(dataObjecy), 'schema': this.columns}
      }
    }
  },
  mounted () {
    this.$refs.a1.style.width = '100%'
    this.$refs.a1.filters = {}
    this.$refs.a1.attributes.editable = false
    this.$refs.a1.attributes.columnHeaderClickBehavior = 'none'
    this.$refs.a1.attributes.showColumnSelector = false
    this.$refs.a1.attributes.showFilter = false
    this.$refs.a1.attributes.showOrderByOption = false
    this.$refs.a1.attributes.showClearSettingsOption = false
    this.$refs.a1.attributes.showRowNumbers = false
    this.$refs.a1.attributes.showRowHeaders = false
    // this.$refs.a1.editable = false
    // this.$refs.a1.style.height="500px"
    // this.$refs.a1.style.height="500px"
  }
}
</script>

<style scoped>
</style>
