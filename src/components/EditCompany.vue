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
            <el-form-item :label="$t('company_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('company_address')" prop="CompanyAddress">
              <el-input v-model.trim="modifyForm.CompanyAddress"></el-input>
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
            <el-form-item :label="$t('contract_end_date')"
                          prop="ContractEndDate">
              <el-date-picker v-model="dateRange"
                              type="daterange"
                              :clearable="false"
                              range-separator="-"
                              :start-placeholder="$t('start_date')"
                              :end-placeholder="$t('end_date')">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('type')" prop="ShowLogo">
              <el-input v-model.trim="modifyForm.Type"></el-input>
            </el-form-item>
            <el-form-item :label="$t('logo')" prop="ShowLogo">
              <el-input v-model.trim="modifyForm.ShowLogo"></el-input>
            </el-form-item>
            <el-form-item :label="$t('secondary_domain')" prop="SecondaryDomain">
              <el-input v-model.trim="modifyForm.SecondaryDomain"></el-input>
            </el-form-item>
            <el-form-item :label="$t('background_image')" prop="BackgroundImg">
              <el-input v-model.trim="modifyForm.BackgroundImg"></el-input>
            </el-form-item>
            <el-form-item :label="$t('is_enabled')"
                          prop="Status">
              <el-radio v-model="modifyForm.Status" :label="1">{{$t('start_using')}}</el-radio>
              <el-radio v-model="modifyForm.Status" :label="-1">{{$t('block_up')}}</el-radio>
            </el-form-item>
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
    Status: 1,
    CompanyAddress: '',
    Principal: '',
    PrincipalMail: '',
    PrincipalTEll: '',
    ContractStartDate: null,
    ContractEndDate: null,
    Type: '',
    ShowLogo: '',
    BackgroundImg: '',
    SecondaryDomain: ''
  }
}
export default {
  name: 'EditCompany',
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      dateRange: [moment(), moment()],
      rules: {
        Name: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
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
          await this.$store.dispatch({type: 'company/saveOrUpdateCompany', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
