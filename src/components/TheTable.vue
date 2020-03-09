<template>
  <div>
    <el-button @click="exportExcel" style="margin-bottom: 5px">{{$t('export')}}</el-button>
    <el-table id="table"
              :data="data"
              :max-height="maxHeight"
              stripe
              border
              style="width: 100%">
      <el-table-column v-for="column in fields"
                       :width="column.width?column.width:120"
                       :key="column.Id"
                       :prop="column.prop"
                       :fixed="column.fixed"
                       :label="column.label"
                       :sortable="column.sortable"
                       :formatter="column.formatter">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import FileSaver from 'file-saver'
import _ from 'underscore'
import moment from 'moment'

export default {
  props: {
    fields: {
      type: Array,
      required: true
    },
    data: {
      type: Array
    },
    defaultSort: {
      type: Object
    },
    maxHeight: {
      type: Number,
      required: true
    },
    exportName: {
      type: String,
      required: true
    }
  },
  methods: {
    exportExcel () {
      let tableHeader = []
      let tableHeaderKey = []
      let csvData = []
      _.each(this.fields, function (value) {
        tableHeader.push(value.label)
        tableHeaderKey.push(value.prop)
      })
      csvData.push(tableHeader)
      _.each(this.data, function (value) {
        let d = []
        _.each(tableHeaderKey, function (key) {
          d.push(value[key])
        })
        csvData.push(d)
      })
      try {
        FileSaver.saveAs(new Blob([csvData.join('\n')], {type: 'text/plain;charset=utf-8'}), this.exportName + moment().format('YYYYMMDDHHmmss') + '.csv')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e)
      }
    }
  }
}
</script>
