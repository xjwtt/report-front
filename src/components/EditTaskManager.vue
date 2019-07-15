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
            <el-tabs v-model="activeName">
              <el-tab-pane :label="$t('base')" name="base">
                <el-form-item :label="$t('job_group')" prop="jobGroup">
                  <el-input v-model.trim="modifyForm.jobGroup"></el-input>
                </el-form-item>
                <el-form-item :label="$t('job_name')" prop="jobName">
                  <el-input v-model.trim="modifyForm.jobName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('method_name')" prop="methodName">
                  <el-input v-model.trim="modifyForm.methodName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('cron_expression')" prop="cron">
                  <el-input v-model.trim="modifyForm.cron"></el-input>
                </el-form-item>
                <el-form-item :label="$t('SpringId')" prop="springId">
                  <el-input v-model.trim="modifyForm.springId"></el-input>
                </el-form-item>
                <el-form-item :label="$t('description')" prop="description">
                  <el-input type="textarea" v-model.trim="modifyForm.description"></el-input>
                </el-form-item>
                <el-form-item :label="$t('status')"
                              prop="status">
                  <el-radio v-model="modifyForm.status" :label="1">{{$t('normal')}}</el-radio>
                  <el-radio v-model="modifyForm.status" :label="0">{{$t('pause')}}</el-radio>
                  <!--                  <el-radio v-model="modifyForm.status" :label="-1">{{$t('delete')}}</el-radio>-->
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane :label="$t('otherMessage')" name="otherMessage">
                <el-form-item :label="$t('otherMessage')" prop="otherMessage">
                  <el-input type="textarea" v-model.trim="modifyForm.otherMessage"></el-input>
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
const defaultForm = () => {
  return {
    jobGroup: '',
    jobName: '',
    methodName: '',
    cron: '',
    springId: '',
    description: '',
    otherMessage: '',
    status: 1
  }
}
export default {
  name: 'EditTaskManager',
  data () {
    return {
      activeName: 'base',
      dialogVisible: false,
      modifyForm: defaultForm(),
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
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch({type: 'task/saveOrUpdateTask', data: this.modifyForm})
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
