<template>
  <div>
    <el-button @click="exportExcel">{{$t('export')}}</el-button>
    <el-table id="table"
              :data="data"
              :default-sort=sort
              stripe
              border
              style="width: 100%">
      <el-table-column v-for="column in columns"
                       :key="column.Id"
                       :prop="column.prop"
                       :label="column.label"
                       :sortable="column.sortable"
                       :formatter="column.formatter">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import fm from '@/lib/fieldsManager'
import FileSaver from 'file-saver'
import _ from 'underscore'

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
    }
  },
  methods: {
    exportExcel () {
      let tableHeader = []
      let tableHeaderKey = []
      let csvData = []
      _.each(this.columns, function (value) {
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
        FileSaver.saveAs(new Blob([csvData.join('\n')], {type: 'text/plain;charset=utf-8'}), 'storeReport.csv')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e)
      }
    }
  },
  computed: {
    columns () {
      let locale = this.$i18n.locale
      let columns = [{
        prop: 'DomainLabel',
        label: this.$t('store'),
        sortable: false,
        formatter: (row, col) => row['DomainLabel']
      }]
      for (let index = 0; index < this.fields.length; index++) {
        let fieldName = this.fields[index]
        let field = fm[fieldName]
        if (field) {
          columns.push({
            prop: fieldName,
            label: this.$t(field.displayI18Key),
            sortable: field.sortable ? field.sortable : false,
            formatter: (row, col) => field.tableDisplayFunc ? field.tableDisplayFunc(row[fieldName], locale) : row[fieldName]
          })
        }
      }
      return columns
    },
    sort () {
      if (this.defaultSort && this.defaultSort.prop && this.defaultSort.order && fm[this.defaultSort.prop]) {
        return {
          prop: this.defaultSort.prop,
          order: this.defaultSort.order
        }
      } else {
        return null
      }
    }
  }
}
</script>
