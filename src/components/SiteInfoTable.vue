<template>
  <div>
    <div>
      <el-button type="primary" plain @click="goBack()">{{$t('go_back')}}</el-button>
    </div>
    <div style="margin: 0 auto;width: 721px">
      <el-table
        :data="company"
        border>
        <el-table-column v-for="column in companyTable"
                         :fixed="column.fixed?column.fixed:false"
                         :width="column.width?column.width:180"
                         :key="column.prop"
                         :prop="column.prop"
                         :label="column.label">
        </el-table-column>
      </el-table>
    </div>
    <div>
      <el-button @click="exportExcel" style="margin-bottom: 5px">{{$t('export')}}</el-button>
      <el-button @click="exportLicense" style="margin-bottom: 5px">{{$t('export_license')}}</el-button>
      <el-table id="table"
                ref="table"
                :data="this.malls"
                :max-height="500"
                stripe
                border
                style="width: 100%">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
        <el-table-column v-for="column in tableHeader"
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
  </div>
</template>

<script>
import _ from 'underscore'
import FileSaver from 'file-saver'
import moment from 'moment'
import axios from 'axios'

export default {
  props: {
    company: {
      type: Array
    },
    malls: {
      type: Array
    },
    cameraDeviceTypes: {
      type: Array
    }
  },
  data () {
    return {
      companyTable: [{'prop': 'CompanyCode', 'label': this.$t('company_code'), 'fixed': true, 'width': 180},
        {'prop': 'Name', 'label': this.$t('company_name'), 'width': 180},
        {'prop': 'Principal', 'label': this.$t('principal'), 'width': 160},
        {'prop': 'PrincipalMail', 'label': this.$t('principal_mail'), 'width': 200}]
    }
  },
  computed: {
    tableHeader () {
      let headers = [{
        width: 200,
        prop: 'MallCode',
        fixed: true,
        label: this.$t('mall_code'),
        sortable: false,
        formatter: (row, col) => row['MallCode']
      }, {
        width: 200,
        prop: 'Name',
        fixed: true,
        label: this.$t('mall_name'),
        sortable: false,
        formatter: (row, col) => row['Name']
      }, {
        width: 120,
        prop: 'ContractStartDate',
        label: this.$t('contract_start_date'),
        sortable: false,
        formatter: (row, col) => row['ContractStartDate']
      }, {
        width: 120,
        prop: 'ContractEndDate',
        label: this.$t('contract_end_date'),
        sortable: false,
        formatter: (row, col) => row['ContractEndDate']
      }]
      _.each(this.cameraDeviceTypes, (v) => {
        headers.push({
          width: 100,
          prop: v.Data,
          label: v.Data,
          sortable: false,
          formatter: (row, col) => row[v.Data]
        })
      })
      return headers
    }
  },
  methods: {
    goBack () {
      this.$emit('goBack')
    },
    exportLicense () {
      let select = this.$refs.table.selection
      if (select.length > 0) {
        let companyName = this.company.length > 0 ? this.company[0].Name : ''
        // ajax.post('/business/download.action', {CompanyName: companyName, malls: select})
        axios.post('/business/download.action',
          {CompanyName: companyName, malls: select},
          {responseType: 'blob'}).then(res => {
          let blob = res.data
          let reader = new FileReader()
          reader.readAsDataURL(blob)
          reader.onload = (e) => {
            let a = document.createElement('a')
            a.download = companyName + moment().format('YYYYMMDDHHmmss') + '.zip'
            a.href = e.target.result
            document.body.appendChild(a)
            a.click()
            document.body.removeChild(a)
          }
        })
      } else {
        this.$message.error(this.$t('hava_to_choose_a_site'))
      }
    },
    exportExcel () {
      let csvData = []
      let companyHeader = []
      let companyValue = []
      _.each(this.companyTable, function (v) {
        companyHeader.push(v.label)
      })
      _.each(this.company, (c) => {
        _.each(this.companyTable, (v) => {
          companyValue.push(c[v.prop])
        })
      })
      csvData.push(companyHeader)
      csvData.push(companyValue)
      csvData.push([])
      let tableHeaderKey = []
      let tableHeader = []
      _.each(this.tableHeader, function (value) {
        tableHeader.push(value.label)
        tableHeaderKey.push(value.prop)
      })
      csvData.push(tableHeader)
      _.each(this.malls, function (value) {
        let d = []
        _.each(tableHeaderKey, function (key) {
          d.push(value[key])
        })
        csvData.push(d)
      })
      try {
        FileSaver.saveAs(new Blob([csvData.join('\n')], {type: 'text/plain;charset=utf-8'}), 'site_info' + moment().format('YYYYMMDDHHmmss') + '.csv')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e)
      }
    }
  }

}
</script>

<style scoped>

</style>
