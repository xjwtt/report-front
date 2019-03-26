<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div>
        <span>{{$t('recover_data')}}</span>
        <template>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form :model="recover"
                       :rules="rules"
                       ref=recover
                       label-width="150px"
                       class="demo-modifyForm">
                <el-form-item :label="$t('Time')"
                              prop="date">
                  <el-date-picker
                    v-model="recover.date"
                    type="daterange"
                    :range-separator="$t('to')"
                    :start-placeholder="$t('start_date')"
                    :end-placeholder="$t('end_date')">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('mall_name')"
                              prop="mallId">
                  <el-select v-model.trim="recover.mallId"
                             filterable
                             placeholder="...">
                    <el-option v-for="item in malls"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="submitFormRecover('recover')">{{$t('recover_data')}}</el-button>
              </el-form>
            </el-col>
          </el-row>
        </template>
      </div>
      <div>
        <span>{{$t('reset_businesstime')}}</span>
        <template>
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form :model="businessTime"
                       :rules="rules"
                       ref=businessTime
                       label-width="150px"
                       class="demo-modifyForm">
                <el-form-item :label="$t('Time')"
                              prop="date">
                  <el-date-picker
                    v-model="businessTime.date"
                    type="daterange"
                    :range-separator="$t('to')"
                    :start-placeholder="$t('start_date')"
                    :end-placeholder="$t('end_date')">
                  </el-date-picker>
                </el-form-item>
                <el-form-item :label="$t('mall_name')"
                              prop="mallId">
                  <el-select v-model.trim="businessTime.mallId"
                             filterable
                             placeholder="...">
                    <el-option v-for="item in malls"
                               :key="item.Id"
                               :label="item.Name"
                               :value="item.Id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-button type="primary" @click="submitFormBusinessTime('businessTime')">{{$t('reset_businesstime')}}
                </el-button>
              </el-form>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-card>
  </div>
</template>

<script>
import moment from 'moment'

const defaultForm = () => {
  return {date: [], mallId: ''}
}
export default {
  name: 'recover_manager',
  data () {
    return {
      recover: defaultForm(),
      businessTime: defaultForm(),
      malls: [{Id: 'All', Name: 'All'}],
      rules: {
        date: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        mallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = this.malls.concat(rep)
    },
    submitFormRecover (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let startDate = moment(this.recover.date[0]).format('YYYY-MM-DD')
          let endDate = moment(this.recover.date[1]).format('YYYY-MM-DD')
          this.$store.dispatch({
            type: 'recover/recoverHistory',
            data: {mallId: this.recover.mallId, StartDate: startDate, EndDate: endDate}
          })
          this.$message.success(this.$t('success'))
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    submitFormBusinessTime (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let startDate = moment(this.businessTime.date[0]).format('YYYY-MM-DD')
          let endDate = moment(this.businessTime.date[1]).format('YYYY-MM-DD')
          await this.$store.dispatch({
            type: 'recover/resetBusinessTime',
            data: {mallId: this.businessTime.mallId, StartDate: startDate, EndDate: endDate}
          })
          this.$message.success(this.$t('success'))
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    }
  },
  mounted () {
    this.selectCompanyMall()
  }
}
</script>

<style scoped>

</style>
