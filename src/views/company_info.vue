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
                         :camera-device-types="this.cameraDeviceTypes"
                         :camera-type-counts="this.cameraTypeCounts"
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
import _ from 'underscore'
import axios from 'axios'
import ajax from '../lib/ajax'
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
    cameraDeviceTypes: [],
    malls: null,
    users: null,
    cameraTypeCounts: null
  }),
  methods: {
    async companyInfo () {
      let result = await this.$store.dispatch({type: 'company/companyInfo'})
      this.tableData = result
    },
    async showSiteInfo (company) {
      this.company = [company]
      let that = this
      axios.all([
        ajax.post('/system/selectCategoryByKeyName.action', {KeyName: 'CameraDeviceType'}),
        ajax.post('/business/selectMallByCompanyId.action', {companyId: company.Id}),
        ajax.post('/business/getCameraTypeCount.action', {companyId: company.Id})
      ]).then(axios.spread(function (cdt, malls, ctc) {
        if (cdt.length > 0) {
          let ctcObject = {}
          _.each(ctc, (v) => {
            let key = v.MallId + '_' + v.DeviceType
            ctcObject[key] = v.Count
          })
          _.each(malls, (v) => {
            _.each(cdt, (dt) => {
              let key = v.Id + '_' + dt.Data
              let count = ctcObject[key] ? ctcObject[key] : 0
              v[dt.Data] = count
            })
          })
        }
        that.cameraDeviceTypes = cdt
        that.malls = malls
        that.companyInfoShow = false
        that.siteInfoShow = true
      }))
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
