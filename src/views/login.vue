<template>
  <div class="login">
    <!--<div class="logo"></div>-->
    <div class="loginForm">
      <el-form :model="loginForm"
               ref="loginForm"
               :rules="loginRules">
        <el-form-item prop="UserName">
          <el-input v-model="loginForm.UserName"
                    placeholder="UserName"></el-input>
        </el-form-item>
        <el-form-item prop="UserPass">
          <el-input type="password"
                    v-model="loginForm.UserPass"
                    placeholder="UserPass"
                    @keyup.enter.native="submitForm('loginForm')"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('loginForm')">Login
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
        UserName: '',
        UserPass: ''
      },
      loginRules: {
        UserName: [
          {required: true, message: 'UserName', trigger: 'blur'}
        ],
        UserPass: [
          {required: true, message: 'PassWorld', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async submitForm (formName) {
      let loading = this.$loading({fullscreen: true})
      if (await this.$store.dispatch({type: 'app/login', data: this.loginForm})) {
        await this.$store.dispatch({type: 'app/getUserInfo', data: this.loginForm})
        this.$router.replace('/')
      }
      loading.close()
      // var that = this
      // let params = this.loginForm
      // this.$refs[formName].validate((valid) => {
      //   if (valid) {
      //     var that = this
      //     login(this.loginForm).then(function (data) {
      //       that.setUser().then(() => {
      //         that.$router.push({path: '/briefs'})
      //       })
      //     }, function (data) {})
      //   } else {
      //     this.$message.error('请填写用户名和密码')
      //     return false
      //   }
      // })
    }
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
    width: 300px;
    height: 200px;
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
