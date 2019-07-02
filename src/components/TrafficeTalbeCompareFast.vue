<template>
  <div>
    <el-button @click="convertCSV">{{$t('export')}}</el-button>
    <div class="vue-fast-table" :class="scrollDirection">
      <div class="table-body" :style="{marginLeft:leftFixedWidth,height:leftFixedHeight}" @scroll="tableScroll">
        <div v-for="(item, index) in bodyData" :key="index">
          <table cellspacing="0" cellpadding="0"
                 v-for="(p_item, p_index) in item.data"
                 :key="p_index"
                 :style="{'width':(tdWidth*p_item.length)+'px'}">
            <tbody>
            <tr>
              <td v-for="(d_item, d_index) in p_item" :key="d_index"
                  :style="{'width':tdWidth+'px',height:tdHeight+'px'}">
               <span v-if="d_item&&typeof d_item==='string'&&d_item.indexOf('<')>-1">
                  <span v-html="d_item"></span>
                </span>
                <span v-else>
                  {{d_item}}
                </span>
              </td>
            </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div class="table-fix-cloumns" :style="{height:leftFixedHeight,'padding-top':tdHeight+'px'}">
        <div class="fix-left-top">
          <div :style="{ transform: 'translateY(' + scrollTop + 'px)' }">
            <table :width="leftFixedWidth" cellspacing="0" cellpadding="0">
              <thead>
              <tr v-for="(data, index) in leftFixed.data" :key="index">
                <td v-for="(item,d_index) in  data" :key="d_index"
                    :style="{'width':(d_index===0?(tdWidth+60):tdWidth)+'px',height:tdHeight+'px'}">
                  {{item}}
                </td>
              </tr>
              </thead>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'underscore'
import FileSaver from 'file-saver'

export default {
  name: 'TrafficeTalbeCompareFast',
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
      type: Array
    },
    compareData: {
      type: Array
    },
    fixedHeader: {
      type: Array,
      required: true
    },
    exportName: {
      type: String,
      default: 'report'
    }
  },
  data () {
    return {
      scrollLeft: 0,
      scrollTop: 0,
      scrollDirection: '',
      leftFixedWidth: '300px',
      leftFixedHeight: '70px',
      tdWidth: 160,
      tdHeight: 35,
      separateNumber: 30
    }
  },
  methods: {
    convertCSV () {
      let bodyData = this.bodyData
      let csvData = []
      _.each(this.leftFixed.data, function (value, index) {
        let bodyD = [].concat(value)
        _.each(bodyData, function (bd) {
          bodyD = bodyD.concat(bd.data[index])
        })
        csvData.push(bodyD.join())
      })
      try {
        FileSaver.saveAs(new Blob([csvData.join('\n')], {type: 'text/plain;charset=utf-8'}), this.exportName + '.csv')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, csvData)
      }
    },
    tableScroll (e) {
      const scrollLeft = e.target.scrollLeft
      const scrollTop = e.target.scrollTop
      if (scrollLeft === this.scrollLeft) {
        this.scrollDirection = 'vertical'
      } else {
        this.scrollDirection = 'horizontal'
      }
      this.scrollLeft = -scrollLeft
      this.scrollTop = -scrollTop
    },
    groupByData (data) {
      let dataObject = {}
      _.each(data, function (value, index) {
        let domainLabel = value.DomainLabel
        if (!dataObject[domainLabel]) {
          dataObject[domainLabel] = []
        }
        dataObject[domainLabel].push(value)
      })
      return dataObject
    },
    computedBodyData (data) {
      let result = []
      let that = this
      switch (that.tableType) {
        case 'DateTime':
        case 'TimeLabel':
          let num = this.separateNumber || 30
          let separateTableData = []
          _.each(data, function (item, index) {
            let key = parseInt(index / num)
            if (index % num === 0) {
              separateTableData.push({separate: key, data: []})
            }
            separateTableData[key].data.push(item)
          })
          _.each(separateTableData, function (data, key) {
            let groupBy = that.groupByData(data.data)
            let bodyData = {separate: key, data: []}
            // 时间
            let w = []
            _.each(Object.values(groupBy)[0], function (values) {
              w.push(values['DateTime'])
            })
            bodyData.data.push(w)
            _.each(that.fixedHeader, function (fh) {
              let w = []
              switch (fh) {
                case 'Temp':
                  _.each(Object.values(groupBy)[0], function (values) {
                    w.push(values['LowTemp'] + '~' + values['HighTemp'] + '℃/' + values['Pm25'])
                  })
                  break
                case 'Picture':
                  _.each(Object.values(groupBy)[0], function (values) {
                    w.push('<img src="' + values['DayPictureUrl'] + '"/>&nbsp;&nbsp;<img src="' + values['NightPictureUrl'] + '"/>')
                  })
                  break
                default:
                  _.each(Object.values(groupBy)[0], function (values) {
                    w.push(values[fh])
                  })
                  break
              }

              bodyData.data.push(w)
            })
            _.each(groupBy, function (d) {
              _.each(that.charTypes, function (t) {
                let timeData = []
                _.each(d, function (value) {
                  timeData.push(value[t])
                })
                bodyData.data.push(timeData)
              })
            })
            result.push(bodyData)
          })
          break
        case 'DomainLabel':
          let groupBy = that.groupByData(data)
          let bodyData = {separate: '0', data: []}
          _.each(groupBy, function (d) {
            let charTypesData = []
            _.each(d, function (value) {
              _.each(that.charTypes, function (t) {
                charTypesData.push(value[t])
              })
              bodyData.data.push(charTypesData)
            })
          })
          result.push(bodyData)
      }
      return result
    },
    computedLeftFixed (data) {
      let that = this
      let result = []
      let domainLabelObject = {}
      _.each(data, function (d) {
        let domainLabel = d.DomainLabel
        if (!domainLabelObject[domainLabel]) {
          domainLabelObject[domainLabel] = []
        }
        domainLabelObject[domainLabel].push(d)
      })

      switch (that.tableType) {
        case 'DateTime':
        case 'TimeLabel':
          _.each(that.fixedHeader, function (v) {
            let fixedData = ['', that.$t(v), '-']
            result.push(fixedData)
          })
          _.each(domainLabelObject, function (values, key) {
            let domainCount = []
            _.each(that.charTypes, function (t) {
              let charTypesData = [key, that.$t(t)]
              switch (t) {
                case 'Enter':
                case 'Exit':
                case 'Passby':
                  let total = 0
                  let timeData = []
                  _.each(values, function (value) {
                    total += value[t]
                    timeData.push(value[t])
                  })
                  domainCount.push(total)
                  charTypesData.push(total)
                  break
                case 'EnteringRate':
                  if (domainCount.length >= 2) {
                    let enteringRate = domainCount[1] > 0 ? parseInt((domainCount[0] / domainCount[1]) * 10000) / 100 : 0
                    charTypesData.push(enteringRate)
                  } else {
                    charTypesData.push(0)
                  }
                  break
              }
              result.push(charTypesData)
            })
          })
          break
        case 'DomainLabel':
          _.each(domainLabelObject, function (values, key) {
            result.push([key])
          })
      }
      return result
    }
  },
  computed: {
    bodyData () {
      let result = this.computedBodyData(this.tableData)
      if (this.compareData) {
        let compare = this.computedBodyData(this.compareData)
        _.each(result, function (value) {
          _.each(compare, function (compare) {
            if (value.separate === compare.separate) {
              value.data = value.data.concat(compare.data)
            }
          })
        })
      }
      return Object.freeze(result)
    },
    leftFixed () {
      let that = this
      let columns = this.columnsInit
      switch (this.tableType) {
        case 'DateTime':
        case 'TimeLabel':
          columns = columns.concat(['type', 'total'])
          break
      }
      _.each(columns, function (value, index) {
        columns[index] = that.$t(value)
      })
      let data = [columns]
      data = data.concat(this.computedLeftFixed(this.tableData))
      if (this.compareData) {
        data.push(['', '', '-'])
        data = data.concat(this.computedLeftFixed(this.compareData))
      }
      /* 计算左边固定表格的宽度 */
      that.leftFixedWidth = (columns.length * this.tdWidth + 60) + 'px'
      if (data.length > 0) {
        let h = (data.length + 1) * that.tdHeight
        if (h > 340) {
          that.leftFixedHeight = '340px'
        } else {
          that.leftFixedHeight = h + 'px'
        }
      }
      return {
        'header': columns,
        'data': data
      }
    }
  }
}
</script>

<style scoped>
  .vue-fast-table {
    overflow: hidden;
    position: relative;
  }

  .vue-fast-table td {
    background: #fff;
  }

  .vue-fast-table .vertical .table-head {
    z-index: 1
  }

  .table-head {
    position: relative;
    display: -webkit-box;
  }

  .table-head td {
    text-align: center;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .table-head td:first-child {
    border-left: none;
  }

  .table-body {
    display: -webkit-box;
    overflow: scroll;
  }

  .table-body td {
    text-align: center;
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
  }

  /*.table-body table:first-child tr:first-child td {*/
  /*  border-top: none;*/
  /*}*/

  .table-body table:last-child tr:last-child {
    border-bottom: 1px solid #cccc;
  }

  .table-fix-cloumns {
    position: absolute;
    top: 0;
    left: 0;
  }

  .fix-left-top {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  .fix-left-top td {
    text-align: center;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }

  .fix-left-body td {
    text-align: center;
    border-top: 1px solid #ccc;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    box-sizing: border-box;
  }

  .fix-left-body table:first-child tr:first-child td {
    border-top: none;
  }

  .fix-left-body table:last-child tr:last-child {
    border-bottom: 1px solid #cccc;
  }
</style>
