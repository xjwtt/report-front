<template>
  <div>
    <el-button @click="convertCSV">{{$t('export')}}</el-button>
    <div class="wraper">
      <bigdata-table
        ref="table"
        v-model="tableDataHandled"
        :row-num="20"
        :col-num="2"
        fixed
        stripe
        :col-width="220"
        :header-height="35"
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

export default {
  props: {
    columns: {
      type: Array,
      required: true
    },
    tableDataHandled: {
      type: Array,
      required: true
    },
    fixedCol: {
      type: Number,
      required: true
    },
    exportName: {
      type: String,
      default: 'report'
    }
  },
  computed: {},
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
    height: 500px;
    overflow: auto;
  }
</style>
