<template>
  <el-dialog :title="$t('edit')"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%">
    <template>
      <el-row :gutter="20">
        <el-col :span="14">
          <el-form :model="modifyForm"
                   :rules="rules"
                   ref=modifyForm
                   label-width="150px"
                   class="demo-modifyForm">
            <el-form-item :label="$t('user_code')"
                          prop="UserCode">
              <el-input :disabled="true" v-model.trim="modifyForm.UserCode"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user_name')"
                          prop="Name">
              <el-input :disabled="true" v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user_password')"
                          prop="UserPwd">
              <el-input type="password" v-model.trim="modifyForm.UserPwd"></el-input>
            </el-form-item>
            <el-form-item :label="$t('user_conpassword')"
                          prop="conUserPwd">
              <el-input type="password" v-model.trim="modifyForm.conUserPwd"></el-input>
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
    UserCode: '',
    Name: '',
    UserPwd: '',
    conUserPwd: ''
  }
}
export default {
  name: 'ResetPassword',
  data () {
    return {
      dialogVisible: false,
      modifyForm: defaultForm(),
      userId: null,
      rules: {
        UserPwd: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        conUserPwd: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.userId = form.Id
      this.modifyForm.UserCode = form.UserCode
      this.modifyForm.Name = form.Name
      this.$nextTick(() => {
        this.$refs.modifyForm.resetFields()
      })
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.modifyForm.conUserPwd && (this.modifyForm.UserPwd !== this.modifyForm.conUserPwd)) {
            this.$message.error(this.$t('two_passwords_are_different'))
          } else {
            await this.$store.dispatch({
              type: 'user/resetPassword',
              data: {Id: this.userId, Password: this.modifyForm.UserPwd}
            })
            this.dialogVisible = false
          }
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    }
  }
}
</script>
