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
                   label-width="100px"
                   class="demo-modifyForm">
            <el-form-item :label="$t('Company')" prop="CompanyId">
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
            <el-form-item :label="$t('business_type')"
                          prop="TimeType">
              <el-select v-model.trim="modifyForm.TimeType" filterable :placeholder="$t('please_select')">
                <el-option v-for="type in businessTimeTypes"
                           :key="type.Id"
                           :label="type.Name"
                           :value="type.Id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('start_date')"
                          prop="StartDate">
              <el-date-picker
                v-model="modifyForm.StartDate"
                type="date"
                placeholder="Select Date">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('end_date')"
                          prop="EndDate">
              <el-date-picker
                v-model="modifyForm.EndDate"
                type="date"
                placeholder="Select Date">
              </el-date-picker>
            </el-form-item>
            <el-form-item :label="$t('weekdays')"
                          prop="Weekday">
              <el-checkbox-group v-model="modifyForm.Weekday">
                <el-checkbox v-for="d in weekDayList" :label="d" :key="d">{{d}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item :label="$t('start_time')"
                          prop="StartTime">
              <el-time-select
                v-model="modifyForm.StartTime"
                :picker-options="{
                    start: '00:00',
                    step: '00:30',
                    end: '23:30'
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
                    step: '00:30',
                    end: '23:30'
                  }"
                placeholder="Selete Time">
              </el-time-select>
            </el-form-item>
            <el-form-item :label="$t('Description')"
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
      <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import moment from 'moment'

const weekdays = () => {
  return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
}
const defaultForm = () => {
  return {
    CompanyId: '',
    TimeType: '',
    StartDate: '',
    StartTime: '',
    EndDate: '',
    EndTime: '',
    Weekdays: '',
    Weekday: [],
    Description: ''
  }
}
export default {
  name: 'EditCompany',
  data () {
    return {
      companys: [],
      businessTimeTypes: [],
      weekDayList: weekdays(),
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        CompanyId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        TimeType: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        StartDate: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        StartTime: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        EndDate: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        EndTime: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Weekday: [
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
      this.selectCompany()
      if (form) {
        form.Weekday = form.Weekdays.split(',')
        this.modifyForm = Object.assign({}, form)
      } else {
        this.modifyForm = defaultForm()
      }
      // this.modifyForm = form ? Object.assign({}, form) : defaultForm()
    },
    async selectCompany () {
      let rep = await this.$store.dispatch({type: 'company/selectCompany'})
      this.companys = rep
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let startDate = moment(this.modifyForm.StartDate)
          let endDate = moment(this.modifyForm.EndDate)
          if (startDate.isAfter(endDate)) {
            this.$message.error('StartDate is greater than EndDate')
            return
          }
          let startTime = moment(this.modifyForm.StartTime, 'HH:mm')
          let endTime = moment(this.modifyForm.EndTime, 'HH:mm')
          if (startTime.isAfter(endTime)) {
            this.$message.error('StartTime is greater than EndTime')
            return
          }
          this.modifyForm.StartDate = startDate.format('YYYY-MM-DD')
          this.modifyForm.EndDate = endDate.format('YYYY-MM-DD')
          this.modifyForm.StartTime = startTime.format('HH:mm:ss')
          this.modifyForm.EndTime = endTime.format('HH:mm:ss')
          this.modifyForm.Weekdays = this.modifyForm.Weekday.join(',')
          await this.$store.dispatch({type: 'businesstime/saveOrUpdateBusinessTime', data: this.modifyForm})
          this.dialogVisible = false
          this.$emit('handleQueryChange')
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async selectCategoryByKeyName () {
      let rep = await this.$store.dispatch({
        type: 'category/selectCategoryByKeyName',
        data: {KeyName: 'BusinessTimeType'}
      })
      this.businessTimeTypes = rep
    }
  },
  mounted () {
    this.selectCategoryByKeyName()
  }
}
</script>

<style scoped>

</style>
