<template>
  <div class="login">
    <!--<div class="logo"></div>-->
    <div class="loginForm">
      <el-form :model="loginForm"
               ref="loginForm"
               :rules="loginRules">
        <el-form-item prop="CompanyName">
          <el-input v-model="loginForm.CompanyName"
                    :placeholder="$t('company_name')"></el-input>
        </el-form-item>
        <el-form-item prop="UserName">
          <el-input v-model="loginForm.UserName"
                    :placeholder="$t('user_name')"></el-input>
        </el-form-item>
        <el-form-item prop="UserPass">
          <el-input type="password"
                    v-model="loginForm.UserPass"
                    :placeholder="$t('user_pass')"
                    @keyup.enter.native="submitForm('loginForm')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('loginForm')">{{$t('login')}}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      loginForm: {
        CompanyName: '',
        UserName: '',
        UserPass: ''
      },
      loginRules: {
        CompanyName: [
          {required: true, message: this.$t('company_name'), trigger: 'blur'}
        ],
        UserName: [
          {required: true, message: this.$t('user_name'), trigger: 'blur'}
        ],
        UserPass: [
          {required: true, message: this.$t('user_pass'), trigger: 'blur'}
        ]
      },
      loginStyle: {}
    }
  },
  methods: {
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let loading = this.$loading({fullscreen: true})
          this.loginForm['loginType'] = 'Company'
          if (await this.$store.dispatch({type: 'app/login', data: this.loginForm})) {
            await this.$store.dispatch({type: 'app/getUserInfo', data: this.loginForm})
            this.$router.replace('/')
          }
          loading.close()
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async loginOtherMsg () {
      let href = window.location.href
      let temp = href.substr(href.indexOf('//') + 2)
      let result = temp.substr(0, temp.indexOf('/'))
      let urls = result.split('.')
      if (urls.length > 0) {
        let company = await this.$store.dispatch({type: 'app/loginOtherMsg', name: urls[0]})
        if (company) {
          if (company.Name) {
            this.loginForm.CompanyName = company.Name
          }
          if (company.BackgroundImg && company.BackgroundImg.index('data:') >= 0) {
            this.loginStyle.background = 'url(' + company.BackgroundImg + ') no-repeat'
          }
        }
      }
    }
  },
  async created () {
    await this.loginOtherMsg()
  }
}
</script>

<style>
  .login .el-button--primary {
    width: 100%;
  }
</style>

<style scoped>
  .login {
    width: 100%;
    height: 100%;
    background: url('../assets/images/background.jpg') no-repeat;
    background-size: 100% 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .content {
    margin-top: 0;
  }

  .loginForm {
    width: 350px;
    height: 300px;
    padding: 30px 30px 0 30px;
    margin-top: 50px;
    text-align: center;
    background-color: hsla(0, 0%, 100%, 0.5);
  }

  .logo {
    width: 200px;
    height: 80px;
    background: url('../assets/images/logo.png') no-repeat;
    background-size: 100% 100%;
  }
</style>
