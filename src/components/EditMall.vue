<template>
  <el-dialog :title="$t('edit')"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="60%">
    <template>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form :model="modifyForm"
                   :rules="rules"
                   ref=modifyForm
                   label-width="150px"
                   size="small"
                   class="demo-modifyForm">
            <el-tabs v-model="activeName">
              <el-tab-pane :label="$t('base')" name="base">
                <el-form-item :label="$t('mall_name')"
                              prop="Name">
                  <el-input v-model.trim="modifyForm.Name"></el-input>
                </el-form-item>
                <el-form-item :label="$t('company_name')" prop="CompanyId">
                  <el-select v-model.trim="modifyForm.CompanyId"
                             filterable
                             placeholder="...">
                    <el-option v-for="item in companys"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('province')" prop="ProvinceId">
                  <el-select v-model.trim="modifyForm.ProvinceId"
                             filterable
                             placeholder="...">
                    <el-option v-for="item in provinces"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.Id">

                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('city')" prop="CityId">
                  <el-select v-model.trim="modifyForm.CityId"
                             filterable
                             placeholder="...">
                    <el-option v-for="item in citys"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.Id">

                    </el-option>
                  </el-select>
                </el-form-item>
                <!--            <el-form-item :label="$t('district')" prop="DistrictId">-->
                <!--              <el-select v-model.trim="modifyForm.DistrictId"-->
                <!--                         filterable-->
                <!--                         placeholder="...">-->
                <!--                <el-option v-for="item in districts"-->
                <!--                           :key="item.Id"-->
                <!--                           :label="item.Name"-->
                <!--                           :value="item.Id">-->

                <!--                </el-option>-->
                <!--              </el-select>-->
                <!--            </el-form-item>-->
                <el-form-item :label="$t('timezone')" prop="TimeZone">
                  <el-select v-model.trim="modifyForm.TimeZone"
                             filterable
                             placeholder="...">
                    <el-option v-for="item in timeZones"
                               :key="item.KeyName"
                               :label="item.Name"
                               :value="item.KeyName">

                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('ranked')"
                              prop="Ranked">
                  <el-input-number v-model.trim="modifyForm.Ranked"></el-input-number>
                </el-form-item>
                <el-form-item :label="$t('is_enabled')"
                              prop="Enabled">
                  <el-radio v-model="modifyForm.Enabled" :label="1">{{$t('start_using')}}</el-radio>
                  <el-radio v-model="modifyForm.Enabled" :label="-1">{{$t('block_up')}}</el-radio>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane :label="$t('otherMessage')" name="otherMessage">
                <el-form-item :label="$t('mall_code')"
                              prop="MallCode">
                  <el-input v-model.trim="modifyForm.MallCode"></el-input>
                </el-form-item>
                <el-form-item :label="$t('clerk_number')"
                              prop="ClerkNumber">
                  <el-input v-model.trim="modifyForm.ClerkNumber"></el-input>
                </el-form-item>
                <el-form-item :label="$t('operation_acreage')"
                              prop="OperationAcreage">
                  <el-input v-model.trim="modifyForm.OperationAcreage"></el-input>
                </el-form-item>
                <el-form-item :label="$t('address')" prop="Address">
                  <el-input v-model.trim="modifyForm.Address"></el-input>
                </el-form-item>
                <el-form-item :label="$t('principal')" prop="Principal">
                  <el-input v-model.trim="modifyForm.Principal"></el-input>
                </el-form-item>
                <el-form-item :label="$t('principal_tell')" prop="PrincipalTEll">
                  <el-input v-model.trim="modifyForm.PrincipalTEll"></el-input>
                </el-form-item>
                <el-form-item :label="$t('principal_mail')" prop="PrincipalMail">
                  <el-input v-model.trim="modifyForm.PrincipalMail"></el-input>
                </el-form-item>
                <el-form-item :label="$t('contract_period')"
                              prop="ContractEndDate">
                  <el-date-picker v-model="dateRange"
                                  type="daterange"
                                  :clearable="false"
                                  range-separator="-"
                                  :start-placeholder="$t('start_date')"
                                  :end-placeholder="$t('end_date')">
                  </el-date-picker>
                </el-form-item>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-col>
      </el-row>
    </template>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm('modifyForm')">{{$t('ok')}}</el-button>
      <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>

import moment from 'moment'

const defaultForm = () => {
  return {
    Name: '',
    CompanyId: '',
    ProvinceId: '',
    CityId: '',
    DistrictId: '',
    TimeZone: 'Etc/GMT-8',
    ClerkNumber: 0,
    OperationAcreage: 0,
    Ranked: 0,
    MallCode: '',
    Address: '',
    Principal: '',
    PrincipalMail: '',
    PrincipalTEll: '',
    ContractStartDate: null,
    ContractEndDate: null,
    Enabled: 1
  }
}
export default {
  name: 'EditCompany',
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      dateRange: [moment(), moment()],
      activeName: 'base',
      rules: {
        Name: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        CompanyId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        ProvinceId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        CityId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        TimeZone: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      timeZones: [],
      companys: [],
      provinces: [],
      citys: [],
      districts: []

    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.activeName = 'base'
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.selectCompany()
      this.parentIdLocation('-', 'province')
      if (form && !form.DistrictId) {
        form.DistrictId = ''
      }
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
      if (this.modifyForm.ContractStartDate && this.modifyForm.ContractEndDate) {
        this.dateRange = [moment(this.modifyForm.ContractStartDate), moment(this.modifyForm.ContractEndDate)]
      }
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.modifyForm.ContractStartDate = moment(this.dateRange[0]).format('YYYY-MM-DD')
          this.modifyForm.ContractEndDate = moment(this.dateRange[1]).format('YYYY-MM-DD')
          await this.$store.dispatch({type: 'mall/saveOrUpdateMall', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async selectCompany () {
      let rep = await this.$store.dispatch({type: 'company/selectCompany'})
      this.companys = rep
    },
    async parentIdLocation (parentId, type) {
      let rep = await this.$store.dispatch({
        type: 'location/parentIdLocation',
        data: {parentId: parentId}
      })
      switch (type) {
        case 'province':
          this.provinces = rep
          break
        case 'city':
          this.citys = rep
          break
        case 'district':
          this.districts = rep
          break
      }
      if (type === 'pro') {
        this.provinces = rep
      }
    },
    async selectCategoryByKeyName () {
      let rep = await this.$store.dispatch({type: 'category/selectCategoryByKeyName', data: {KeyName: 'timezone'}})
      this.timeZones = rep
    }
  },
  watch: {
    'modifyForm.ProvinceId': {
      handler: function (newValue, OldValue) {
        this.parentIdLocation(newValue, 'city')
      },
      deep: true
    },
    'modifyForm.CityId': {
      handler: function (newValue, OldValue) {
        this.parentIdLocation(newValue, 'district')
      },
      deep: true
    }
  },
  activated () {
    this.selectCategoryByKeyName()
  }
}
</script>

<style scoped>

</style>
