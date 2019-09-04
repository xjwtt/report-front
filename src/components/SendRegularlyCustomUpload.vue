<template>
  <el-dialog :title="$t('custom_upload')"
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
            <el-form-item :label="$t('start_date')"
                          prop="StartDate">
              <el-date-picker
                v-model="modifyForm.StartDate"
                type="date"
                :placeholder="$t('start_date')">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('start_time')"
                          prop="StartTime">
              <el-time-select
                v-model="modifyForm.StartTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '23:55'
                }"
                :placeholder="$t('start_time')">
              </el-time-select>
            </el-form-item>
            <el-form-item :label="$t('end_date')"
                          prop="EndDate">
              <el-date-picker
                v-model="modifyForm.EndDate"
                type="date"
                :placeholder="$t('end_date')">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('end_time')"
                          prop="EndTime">
              <el-time-select
                v-model="modifyForm.EndTime"
                :picker-options="{
                  start: '00:00',
                  step: '00:05',
                  end: '23:55'
                }"
                :placeholder="$t('end_time')">
              </el-time-select>
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

export default {
  data () {
    return {
      dialogVisible: false,
      modifyForm: {StartDate: '', EndDate: '', StartTime: '', EndTime: ''},
      SendRegularlyId: 0,
      rules: {
        StartDate: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        EndDate: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        StartTime: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        EndTime: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    show (row) {
      this.dialogVisible = true
      this.SendRegularlyId = row.Id
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let data = {Id: this.SendRegularlyId}
          data['StartTime'] = moment(this.modifyForm.StartDate).format('YYYY-MM-DD') + ' ' + this.modifyForm.StartTime + ':00'
          data['EndTime'] = moment(this.modifyForm.EndDate).format('YYYY-MM-DD') + ' ' + this.modifyForm.EndTime + ':00'
          let rep = await this.$store.dispatch({type: 'senddataregularly/uploadByTime', data: data})
          if (rep) {
            this.dialogVisible = false
            this.$message.success(this.$t('success'))
            this.$emit('handleQueryChange')
          } else {
            this.$message.error(this.$t('failed'))
          }
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
