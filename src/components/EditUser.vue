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
            <el-form-item :label="$t('user_code')"
                          prop="UserCode">
              <el-input v-model.trim="modifyForm.UserCode"></el-input>
            </el-form-item>
            <el-form-item :label="$t('company_name')"
                          prop="CompanyId">
              <el-select v-model.trim="modifyForm.CompanyId" filterable placeholder="...">
                <el-option v-for="company in companys"
                           :key="company.Id"
                           :label="company.Name"
                           :value="company.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('user_name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('role_name')"
                          prop="RoleId">
              <el-select v-model.trim="modifyForm.RoleId" filterable placeholder="...">
                <el-option v-for="role in roles"
                           :key="role.Id"
                           :label="role.Name"
                           :value="role.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('language')"
                          prop="Language">
              <el-select v-model.trim="modifyForm.Language">
                <el-option v-for="item in languageTypes"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.KeyName">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="pwdShow" :label="$t('user_password')"
                          prop="UserPwd">
              <el-input type="password" v-model.trim="modifyForm.UserPwd"></el-input>
            </el-form-item>
            <el-form-item v-if="pwdShow" :label="$t('user_conpassword')"
                          prop="conUserPwd">
              <el-input type="password" v-model.trim="modifyForm.conUserPwd"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user_email')"
                          prop="Email">
              <el-input v-model.trim="modifyForm.Email"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user_telephone')"
                          prop="Telephone">
              <el-input v-model.trim="modifyForm.Telephone"></el-input>
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
const defaultForm = () => {
  return {
    Id: '',
    UserCode: '',
    CompanyId: '',
    Name: '',
    ParentId: '',
    RoleId: '',
    UserPwd: '',
    Language: 'zh-cn',
    Telephone: '',
    Email: ''
  }
}
export default {
  name: 'EditUser',
  data () {
    return {
      // form
      dialogVisible: false,
      modifyForm: defaultForm(),
      pwdShow: true,
      rules: {
        UserCode: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        CompanyId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Name: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        RoleId: [
          {required: true, message: ``, trigger: 'blur'}
        ],
        UserPwd: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        conUserPwd: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Language: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      companys: [],
      roles: [],
      languageTypes: []
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.selectCompanyByUser()
      this.selectRole()
      this.selectCategoryByKeyName()
      // this.selectUserByParentId()
      if (form) {
        this.pwdShow = false
        this.modifyForm = Object.assign({}, form)
      } else {
        this.pwdShow = true
        this.modifyForm = defaultForm()
      }
    },
    // async selectUserByParentId () {
    //   let rep = await this.$store.dispatch({type: 'user/selectUserByParentId'})
    //   this.users = rep
    // },
    async selectCompanyByUser () {
      let rep = await this.$store.dispatch({type: 'company/selectCompany'})
      this.companys = rep
    },
    async selectRole () {
      let rep = await this.$store.dispatch({type: 'role/selectRole'})
      this.roles = rep
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.modifyForm.conUserPwd && (this.modifyForm.UserPwd !== this.modifyForm.conUserPwd)) {
            this.$message.error(this.$t('two_passwords_are_different'))
          } else {
            await this.$store.dispatch({type: 'user/saveOrUpdateUser', data: this.modifyForm})
            this.dialogVisible = false
          }
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async selectCategoryByKeyName () {
      let rep = await this.$store.dispatch({type: 'category/selectCategoryByKeyName', data: {KeyName: 'LanguageType'}})
      rep.forEach((v) => {
        v.Name = this.$t(v.Name)
      })
      this.languageTypes = rep
    }
  }
}
</script>

<style scoped>

</style>
