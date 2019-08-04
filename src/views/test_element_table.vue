<template>
  <div>

    <div class="wraper">

    </div>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'underscore'
import FileSaver from 'file-saver'

export default {
  data () {
    return {
      columns: [],
      tableDataHandled: [],
      number: 62
    }
  },
  computed: {},
  methods: {
    convertCSV () {
      let csvData = []
      csvData.push(this.columns.join())
      _.each(this.tableDataHandled, function (value, index) {
        csvData.push(value.join())
      })
      try {
        FileSaver.saveAs(new Blob([csvData.join('\n')], {type: 'text/plain;charset=utf-8'}), this.exportName + '.csv')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e, csvData)
      }
    },
    changeData (rowLen) {
      let dataArr = []
      for (let i = 0; i < rowLen; i++) {
        let arr = []
        for (let a = 0; a < this.number; a++) {
          if (a === 0) {
            arr.push('S025 -（北京）巴沟华联万柳店')
          } else {
            arr.push(i + '_' + a)
          }
        }
        dataArr.push(arr)
      }
      this.tableDataHandled = dataArr
    }
  },
  mounted () {
    this.changeData(200)
    // let headers = ['这是数字', '这是字符1列', '这是纬度', '这是数字', '这是经度', '这是字符2列', '这是时间'];
    let headers = []
    for (let a = 0; a < this.number; a++) {
      headers.push('aa')
    }
    let columns = headers.map((title, col) => {
      return {
        title: title,
        align: 'center'
      }
    })
    this.columns = columns
    console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
  }
}
</script>

<style scoped>
  .wraper {
    margin: 0px auto;
    padding: 40px;
    width: 90%;
    height: 500px;
    overflow: auto;
  }
</style>
