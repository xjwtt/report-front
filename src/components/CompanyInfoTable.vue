<template>
  <div style="width: 94%;margin-left: 3%">
    <el-button @click="convertCSV" style="margin-bottom: 5px">{{$t('export')}}</el-button>
    <el-upload
      class="upload-demo"
      action="business/uploadCompany.action"
      :show-file-list="false"
      :on-success="uploadSuccess"
      accept=".xls,.xlsx">
      <el-button type="primary">{{$t('import')}}</el-button>
    </el-upload>
    <el-table
      :data="tableData"
      border
      max-height="550">
      <el-table-column
        fixed
        prop="CompanyCode"
        width="180"
        :label="$t('company_code')">
      </el-table-column>
      <el-table-column
        fixed
        prop="Name"
        width="180"
        :label="$t('company_name')">
      </el-table-column>
      <el-table-column
        prop="Principal"
        width="160"
        :label="$t('principal')">
      </el-table-column>
      <el-table-column
        prop="PrincipalMail"
        width="200"
        :label="$t('principal_mail')">
      </el-table-column>
      <el-table-column
        prop="Type"
        :label="$t('distributor')">
      </el-table-column>
      <el-table-column
        prop="SiteCount"
        :label="$t('site_count')">
      </el-table-column>
      <!--      <el-table-column-->
      <!--        :label="$t('send_mail')"-->
      <!--        width="110">-->
      <!--        <template slot-scope="scope">-->
      <!--          <el-button-->
      <!--            @click.native.prevent=""-->
      <!--            type="text"-->
      <!--            size="small">-->
      <!--            {{$t('send')}}-->
      <!--          </el-button>-->
      <!--        </template>-->
      <!--      </el-table-column>-->
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
      let tableHeader = ['CompanyCode', 'Name', 'Principal', 'PrincipalMail', 'Type', 'SiteCount']
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
    uploadSuccess (res) {
      if (res.status === 1000) {
        this.$message({
          message: 'success',
          type: 'success'
        })
      } else {
        this.$message({
          message: res.showText,
          type: 'error'
        })
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

<style>
  .upload-demo {
    display: inline-block;
  }
  .el-upload__input {
    display: none !important;
  }
</style>
