<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('company_info')}}</span>
      </div>
      <div>
        <el-table
          :data="tableData"
          border
          style="width: 94%;margin-left: 3%"
          max-height="550">
          <el-table-column
            fixed
            prop="Name"
            :label="$t('company_name')">
          </el-table-column>
          <el-table-column
            prop="CompanyAddress"
            :label="$t('company_address')">
          </el-table-column>
          <el-table-column
            prop="Principal"
            :label="$t('principal')">
          </el-table-column>
          <el-table-column
            prop="PrincipalTEll"
            :label="$t('principal_tell')">
          </el-table-column>
          <el-table-column
            prop="PrincipalMail"
            :label="$t('principal_mail')">
          </el-table-column>
          <el-table-column
            prop="ContractStartDate"
            :label="$t('contract_start_date')">
          </el-table-column>
          <el-table-column
            prop="ContractEndDate"
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
            fixed="right"
            :label="$t('operation')"
            width="140">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent=""
                type="text"
                size="small">
                {{$t('site_list')}}
              </el-button>
              <el-button
                @click.native.prevent=""
                type="text"
                size="small">
                {{$t('account_list')}}
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>

export default {
  data: () => ({
    tableData: []
  }),
  methods: {
    async companyInfo () {
      let result = await this.$store.dispatch({type: 'company/companyInfo'})
      this.tableData = result
    }
  },
  activated () {
    this.companyInfo()
  }
}
</script>

<style scoped>

</style>
