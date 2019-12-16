<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('company_info')}}</span>
      </div>
      <div v-show="companyInfoShow">
        <company-info-table
          :tableData="tableData"
          :exportName="'companyInfo'"
          @showSiteInfo="showSiteInfo"
          @showUserInfo="showUserInfo"></company-info-table>
      </div>
      <div v-if="siteInfoShow">
        <site-info-table :company="this.company"
                         :malls="this.malls"
                         @goBack="goBack"></site-info-table>
      </div>
      <div v-if="userInfoShow">
        <user-info-table :company="this.company"
                         :users="this.users"
                         @goBack="goBack"></user-info-table>
      </div>
    </el-card>
  </div>
</template>

<script>

import companyInfoTable from '../components/CompanyInfoTable'
import SiteInfoTable from '../components/SiteInfoTable'
import UserInfoTable from '../components/UserInfoTable'

export default {
  components: {
    companyInfoTable,
    SiteInfoTable,
    UserInfoTable
  },
  data: () => ({
    tableData: [],
    companyInfoShow: true,
    siteInfoShow: false,
    userInfoShow: false,
    company: [],
    malls: null,
    users: null
  }),
  methods: {
    async companyInfo () {
      let result = await this.$store.dispatch({type: 'company/companyInfo'})
      this.tableData = result
    },
    async showSiteInfo (company) {
      this.company = [company]
      let result = await this.$store.dispatch({type: 'mall/selectMallByCompanyId', data: {companyId: company.Id}})
      this.malls = result
      this.companyInfoShow = false
      this.siteInfoShow = true
    },
    async showUserInfo (company) {
      this.company = [company]
      let result = await this.$store.dispatch({type: 'user/selectUserByCompanyId', data: {companyId: company.Id}})
      this.users = result
      this.companyInfoShow = false
      this.userInfoShow = true
    },
    goBack () {
      this.companyInfoShow = true
      this.siteInfoShow = false
      this.userInfoShow = false
    }
  },
  activated () {
    this.companyInfo()
  }
}
</script>

<style scoped>

</style>
