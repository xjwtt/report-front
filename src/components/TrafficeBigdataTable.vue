<template>
  <div>
    <el-button @click="convertCSV">{{$t('export')}}</el-button>
    <div class="wraper" :style="{'height': wraperHeight}">
      <bigdata-table
        ref="table"
        v-model="tableDataHandled"
        :row-num="rowNum"
        :col-num="colNum"
        fixed
        stripe
        :row-height="rowHeight"
        :col-width="colWidth"
        :header-height="headerHeight"
        :at-right-cell-posi="20"
        :at-left-cell-posi="40"
        :columns="columns"
        :fixed-col="fixedCol"
        selectable
        paste
        :disabled-hover="false"
      ></bigdata-table>
    </div>
  </div>
</template>

<script>
import bigdataTable from '../lib/vue-bigdata-table'
import _ from 'underscore'
import FileSaver from 'file-saver'
import moment from 'moment'

export default {
  props: {
    reportType: {
      type: Array,
      required: true
    },
    period: {
      type: String,
      required: true
    },
    charTypes: {
      type: Array,
      required: true
    },
    fixedHeader: {
      type: Array,
      required: true
    },
    reportTypes: {
      type: Array,
      required: true
    },
    columnsFixed: {
      type: Array,
      required: true
    },
    data: {
      type: Object
    },
    exportName: {
      type: String,
      default: 'report'
    }
  },
  data () {
    return {
      rowNum: 20,
      colWidth: 160,
      headerHeight: 35,
      rowHeight: 35
    }
  },
  computed: {
    fixedCol () {
      return this.columnsFixed.length - 1
    },
    groupByData () {
      let result = {}
      let dataArrayIndex = this.reportType[0]
      _.each(this.reportTypes, (reportType) => {
        let data = this.data ? this.data[reportType][dataArrayIndex] : []
        let groupByData = {}
        switch (this.period) {
          case '5m':
          case '10m':
          case '15m':
          case '30m':
          case '60m':
            groupByData = _.groupBy(data, (v) => {
              return moment(v.TimeLabel).format('YYYY-MM-DD')
            })
            break
          default:
            groupByData['All'] = data
        }
        _.each(groupByData, (v, k) => {
          let domain = _.groupBy(v, (items) => {
            return items['DomainLabel']
          })
          _.each(domain, (d, dk) => {
            result[reportType + '_' + k + '_' + dk] = d
          })
        })
      })
      return result
    },
    columns () {
      let columns = [].concat(this.columnsFixed)
      _.each(columns, (value, index) => {
        columns[index] = this.$t(value)
      })
      let data = []
      switch (this.reportType[1]) {
        case 'DateTime':
        case 'DomainLabel_DateTime':
          let xSelector = (_) => _['DateTime']
          let keys = Object.keys(this.groupByData)
          if (keys.length > 0) {
            let temp = this.groupByData[keys[0]]
            data = _.map(temp, xSelector)
            if (this.period === '60m') {
              data = _.map(data, (v) => {
                return moment(v).format('HH:mm')
              })
            }
          }
          break
        case 'DomainLabel':
          data = _.map(this.charTypes, (v) => {
            return this.$t(v)
          })
          break
      }
      columns = columns.concat(data)
      return columns.map((title, col) => {
        return {
          title: title,
          align: 'center'
        }
      })
    },
    tableDataHandled () {
      let that = this
      let body = []
      switch (this.reportType[1]) {
        case 'DateTime':
        case 'DomainLabel_DateTime':
          let firstKeys = Object.keys(that.groupByData)
          if (firstKeys.length > 0) {
            let data = that.groupByData[firstKeys[0]]
            _.each(this.fixedHeader, (type) => {
              let row = ['', that.$t(type), '-']
              _.each(data, (v) => {
                switch (type) {
                  case 'Picture':
                    let p = ''
                    if (v['DayPictureUrl']) {
                      p = '<img style="width: 42px;height:30px" src="' + v['DayPictureUrl'] + '"/>'
                    }
                    row.push(p)
                    break
                  default:
                    row.push(v[type])
                }
              })
              body.push(row)
            })
          }
          _.each(that.groupByData, (v, k) => {
            let domainCount = []
            _.each(that.charTypes, (type) => {
              let row = []
              _.each(that.columnsFixed, (f) => {
                switch (f) {
                  case 'location':
                    row.push(v[0]['DomainLabel'])
                    break
                  case 'type':
                    row.push(this.$t(type))
                    break
                  case 'date':
                    row.push(moment(v[0]['TimeLabel']).format('YYYY-MM-DD'))
                    break
                  case 'total':
                    let temp = 0
                    switch (type) {
                      case 'EnteringRate':
                        if (domainCount.length >= 2) {
                          temp = domainCount[1] > 0 ? parseInt((domainCount[0] / domainCount[1]) * 10000) / 100 : 0
                        }
                        break
                      case 'Stay':
                        let enter = 0
                        let exit = 0
                        _.each(v, (item) => {
                          enter += item['Enter']
                          exit += item['Exit']
                        })
                        temp = enter - exit
                        domainCount.push(temp)
                        break
                      default:
                        _.each(v, (item) => {
                          temp += item[type]
                        })
                        domainCount.push(temp)
                    }
                    row.push(temp)
                    break
                  default:
                    row.push(v[0][f])
                    break
                }
              })
              _.each(v, (item) => {
                row.push(item[type])
              })
              body.push(row)
            })
          })
          break
        case 'DomainLabel':
          _.each(that.groupByData, (v, k) => {
            let row = [v[0]['DomainLabel']]
            _.each(that.charTypes, (type) => {
              _.each(v, (item) => {
                row.push(item[type])
              })
            })
            body.push(row)
          })
          break
      }
      return body
    },
    colNum () {
      if (this.columns > 7) {
        return 7
      } else {
        return this.columns.length
      }
    },
    wraperHeight () {
      let h = (this.tableDataHandled.length + 1) * this.rowHeight

      if (h > 400) {
        return '400px'
      } else {
        return (h + 50) + 'px'
      }
    }
  },
  methods: {
    convertCSV () {
      let csvData = []
      let titles = _.map(this.columns, (v) => {
        return v.title
      })
      csvData.push(titles.join())
      _.each(this.tableDataHandled, function (value, index) {
        csvData.push(value.join())
      })
      try {
        FileSaver.saveAs(new Blob([csvData.join('\n')], {type: 'text/plain;charset=utf-8'}), this.exportName + '.csv')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, csvData)
      }
    }
  },
  components: {
    bigdataTable
  }
}
</script>

<style scoped>
  .wraper {
    margin: 0px auto;
    width: 100%;
    overflow: auto;
  }
</style>
