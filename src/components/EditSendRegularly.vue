<template>
  <el-dialog :title="$t('edit')"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="60%">
    <template>
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('basics_config')" name="basics">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form :model="modifyForm"
                       :rules="rules"
                       ref=modifyForm
                       label-width="150px"
                       size="small"
                       class="demo-modifyForm">
                <el-form-item :label="$t('company_name')"
                              prop="CompanyId">
                  <el-select v-model.trim="modifyForm.CompanyId" filterable placeholder="...">
                    <el-option v-for="item in companys"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('cron_type')"
                              prop="CronType">
                  <el-select v-model.trim="modifyForm.CronType">
                    <el-option v-for="item in CronTypes"
                               :key="item.Id"
                               :label="item.Id"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('description')"
                              prop="Description">
                  <el-input v-model.trim="modifyForm.Description"></el-input>
                </el-form-item>
                <el-form-item :label="$t('is_enabled')"
                              prop="Enabled">
                  <el-radio v-model="modifyForm.Enabled" :label="1">{{$t('start_using')}}</el-radio>
                  <el-radio v-model="modifyForm.Enabled" :label="-1">{{$t('block_up')}}</el-radio>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane :label="$t('server_config')" name="server">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form :model="serverConfig"
                       :rules="rules"
                       ref=modifyForm
                       label-width="150px"
                       class="demo-modifyForm">
                <el-form-item :label="$t('server_type')"
                              prop="ServerType">
                  <el-select v-model.trim="serverConfig.ServerType" filterable placeholder="...">
                    <el-option v-for="item in ServerTypes"
                               :key="item.Id"
                               :label="item.Id"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('file_type')"
                              prop="ServerType" v-if="serverConfig.ServerType !=='HTTP' ">
                  <el-select v-model.trim="serverConfig.FileType" filterable placeholder="...">
                    <el-option v-for="item in FileTypes"
                               :key="item.Id"
                               :label="item.Id"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="host"
                              prop="Host">
                  <el-input v-model.trim="serverConfig.Host"></el-input>
                </el-form-item>
                <el-form-item label="Port"
                              prop="Port">
                  <el-input v-model.trim="serverConfig.Port"></el-input>
                </el-form-item>
                <el-form-item v-if="serverConfig.ServerType === 'HTTP'"
                              label="Path"
                              prop="Path">
                  <el-input v-model.trim="serverConfig.Path"></el-input>
                </el-form-item>
                <el-form-item v-if="serverConfig.ServerType !== 'HTTP'"
                              :label="$t('username')"
                              prop="UserName">
                  <el-input v-model.trim="serverConfig.UserName"></el-input>
                </el-form-item>
                <el-form-item v-if="serverConfig.ServerType !== 'HTTP'"
                              :label="$t('password')"
                              prop="Password">
                  <el-input v-model.trim="serverConfig.Password"></el-input>
                </el-form-item>
                <el-form-item v-if="serverConfig.ServerType === 'SFTP'"
                              :label="$t('privateKey')"
                              prop="privateKey">
                  <el-input v-model.trim="serverConfig.PrivateKey"></el-input>
                </el-form-item>
                <el-form-item v-if="serverConfig.ServerType !== 'HTTP'"
                              :label="$t('directory')"
                              prop="Directory">
                  <el-input v-model.trim="serverConfig.directory"></el-input>
                </el-form-item>
              </el-form>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
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
    CompanyId: '',
    CronType: '',
    Enabled: 1,
    Description: ''
  }
}
const cronTypes = () => {
  return [{Id: '5m'}, {Id: '10m'}, {Id: '15m'}, {Id: '30m'}, {Id: '1h'}, {Id: '1d'}]
}
const defaultServerConfig = () => {
  return {ServerType: 'HTTP'}
}
const serverTypes = () => {
  return [{Id: 'HTTP'}, {Id: 'FTP'}, {Id: 'FTPS'}, {Id: 'SFTP'}]
}
const fileTypes = () => {
  return [{Id: 'csv'}, {Id: 'txt'}]
}
export default {
  name: 'EditUser',
  data () {
    return {
      activeName: 'basics',
      // form
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        CompanyId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        CronType: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Enabled: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Description: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      companys: [],
      roles: [],
      CronTypes: cronTypes(),
      ServerTypes: serverTypes(),
      FileTypes: fileTypes(),
      serverConfig: null
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.activeName = 'basics'
      this.selectCompanyByUser()
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
      if (this.modifyForm.ConfigureMessage) {
        this.serverConfig = JSON.parse(this.modifyForm.ConfigureMessage)
      } else {
        this.serverConfig = defaultServerConfig()
      }
    },
    async selectCompanyByUser () {
      let rep = await this.$store.dispatch({type: 'company/selectCompany'})
      this.companys = rep
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.modifyForm.ConfigureMessage = JSON.stringify(this.serverConfig)

          await this.$store.dispatch({type: 'senddataregularly/saveOrUpdateSendRegularly', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    }
  },
  watch: {
    'serverConfig.ServerType': {
      handler: function (newValue, OldValue) {
        // console.log(newValue)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
