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
    fixedCol: {
      type: Number,
      required: true
    },
    header: {
      type: Array,
      required: true
    },
    tableDataHandled: {
      type: Array,
      required: true
    },
    exportName: {
      type: String,
      required: true
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
    columns () {
      return this.header.map((title, col) => {
        return {
          title: title,
          align: 'center'
        }
      })
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
        FileSaver.saveAs(new Blob([csvData.join('\n')], {type: 'text/plain;charset=utf-8'}), this.exportName + moment().format('YYYYMMDDHHmmss') + '.csv')
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

</style>
