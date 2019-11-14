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
            <el-form-item :label="$t('mall')" prop="MallId">
              <el-select v-model.trim="modifyForm.MallId"
                         filterable
                         placeholder="...">
                <el-option v-for="item in malls"
                           :key="item.Id"
                           :label="item.Name"
                           :value="item.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('name')"
                          prop="Name">
              <el-input v-model.trim="modifyForm.Name"></el-input>
            </el-form-item>
            <el-form-item :label="$t('start_time')"
                          prop="StartTime">
              <el-time-select
                v-model="modifyForm.StartTime"
                :picker-options="{
                    start: '00:00',
                    step: '00:01',
                    end: '23:59'
                  }"
                placeholder="Selete Time">
              </el-time-select>
            </el-form-item>
            <el-form-item :label="$t('end_time')"
                          prop="EndTime">
              <el-time-select
                v-model="modifyForm.EndTime"
                :picker-options="{
                    start: '00:00',
                    step: '00:01',
                    end: '23:59'
                  }"
                placeholder="Selete Time">
              </el-time-select>
            </el-form-item>
            <el-form-item :label="$t('description')"
                          prop="Description">
              <el-input v-model.trim="modifyForm.Description"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </template>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm('modifyForm')">{{$t('ok')}}</el-button>
      <el-button @click="cameraZoneDialogVisible = false">{{$t('cancel')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'

const defaultForm = () => {
  return {
    Id: 0,
    MallId: '',
    Name: '',
    StartTime: '',
    EndTime: '',
    Ranked: 0,
    Description: ''
  }
}
export default {
  data () {
    return {
      dialogVisible: false,
      modifyForm: null,
      malls: null,
      rules: {
        MallId: [
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
    show (form) {
      this.selectCompanyMall()
      this.dialogVisible = true
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = rep
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let startTime = moment(this.modifyForm.StartTime, 'HH:mm')
          let endTime = moment(this.modifyForm.EndTime, 'HH:mm')
          if (startTime.isAfter(endTime)) {
            this.$message.error(this.$t('starttime_is_greater_than_endtime'))
            return
          }
          this.modifyForm.StartTime = startTime.format('HH:mm:ss')
          this.modifyForm.EndTime = endTime.format('HH:mm:ss')
          await this.$store.dispatch({type: 'faceAlarm/saveOrUpdateFaceAlarm', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
