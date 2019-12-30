<template>
  <div style="width: 94%;margin-left: 3%">
    <el-button @click="convertCSV" style="margin-bottom: 5px">{{$t('export')}}</el-button>
    <el-table
      :data="tableData"
      border
      max-height="550">
      <el-table-column
        fixed
        prop="Name"
        width="180"
        :label="$t('company_name')">
      </el-table-column>
      <el-table-column
        prop="CompanyAddress"
        width="260"
        :label="$t('company_address')">
      </el-table-column>
      <el-table-column
        prop="Principal"
        width="160"
        :label="$t('principal')">
      </el-table-column>
      <el-table-column
        prop="PrincipalTEll"
        width="140"
        :label="$t('principal_tell')">
      </el-table-column>
      <el-table-column
        prop="PrincipalMail"
        width="200"
        :label="$t('principal_mail')">
      </el-table-column>
      <el-table-column
        prop="ContractStartDate"
        width="110"
        :label="$t('contract_start_date')">
      </el-table-column>
      <el-table-column
        prop="ContractEndDate"
        width="110"
        :label="$t('contract_end_date')">
      </el-table-column>
      <el-table-column
        prop="Type"
        :label="$t('type')">
      </el-table-column>
      <el-table-column
        prop="SiteCount"
        :label="$t('site_count')">
      </el-table-column>
      <el-table-column
        :label="$t('send_mail')"
        width="110">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent=""
            type="text"
            size="small">
            {{$t('send')}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        fixed="right"
        align="center"
        :label="$t('operation')"
        width="200">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="showSiteInfo(scope.row)"
            type="text"
            size="small">
            {{$t('site_list')}}
          </el-button>
          <el-button
            @click.native.prevent="showUserInfo(scope.row)"
            type="text"
            size="small">
            {{$t('account_list')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import _ from 'underscore'
import FileSaver from 'file-saver'

export default {
  props: {
    tableData: {
      type: Array
    },
    exportName: {
      type: String,
      default: 'export'
    }
  },
  methods: {
    convertCSV () {
      let tableHeader = ['Name', 'CompanyAddress', 'Principal', 'PrincipalTELL', 'PrincipalMail', 'ContractStartDate', 'ContractEndDate', 'Type', 'SiteCount']
      let csvData = []
      csvData.push(tableHeader)
      _.each(this.tableData, function (v) {
        let d = []
        _.each(tableHeader, function (k) {
          d.push(v[k])
        })
        csvData.push(d)
      })
      try {
        FileSaver.saveAs(new Blob([csvData.join('\n')], {type: 'text/plain;charset=utf-8'}), this.exportName + '.csv')
      } catch (e) {
        if (typeof console !== 'undefined') console.log(e)
      }
    },
    showSiteInfo (row) {
      this.$emit('showSiteInfo', row)
    },
    showUserInfo (row) {
      this.$emit('showUserInfo', row)
    }
  }
}
</script>

<style scoped>

</style>
