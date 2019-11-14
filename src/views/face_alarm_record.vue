<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('face_alarm_record')}}</span>
      </div>
      <template>
        <el-row>
          <el-col :span="18">
            <el-form :model="modifyForm"
                     :rules="rules"
                     ref=modifyForm
                     label-width="150px">
              <el-row>
                <el-col :span="8">
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
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="$t('device_id')" prop="DeviceId">
                    <el-select v-model.trim="modifyForm.DeviceId"
                               filterable
                               placeholder="...">
                      <el-option v-for="item in devices"
                                 :key="item.Id"
                                 :label="item.DeviceId"
                                 :value="item.Id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="8">
                  <el-form-item :label="$t('date')" prop="Date">
                    <el-date-picker
                      v-model="modifyForm.Date"
                      type="date"
                      :placeholder="$t('selection_date')">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-button type="primary" @click="queryData('modifyForm')">{{$t('query')}}</el-button>
                </el-col>
              </el-row>
            </el-form>
          </el-col>
        </el-row>
        <el-row v-show="tableShow">
          <datatable v-bind="$data">
          </datatable>
        </el-row>
      </template>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'

const modifyForm = () => {
  return {
    MallId: '',
    DeviceId: '',
    Date: new Date()
  }
}
export default {
  data () {
    return {
      modifyForm: modifyForm(),
      malls: [],
      devices: [],
      tableShow: false,
      rules: {
        MallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        DeviceId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Date: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      // table
      HeaderSettings: false,
      tblClass: 'table-bordered',
      tblStyle: 'color: #666',
      columns: [
        {title: 'date_time', field: 'DateTime', thComp: 'th-i18n', sortable: true},
        {title: 'age_type', field: 'AgeType', thComp: 'th-i18n'},
        {title: 'gender', field: 'Gender', thComp: 'th-i18n', tdComp: 'td-gender'},
        {title: 'photo', field: 'ImageUrl', thComp: 'th-i18n', tdComp: 'td-image'}
      ],
      data: [],
      total: 0,
      query: {'time_': 0},
      xprops: {
        eventbus: new Vue()
      }
    }
  },
  methods: {
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = rep
    },
    async getFaceDeviceByMallId (mallId) {
      let rep = await this.$store.dispatch({type: 'faceAlarm/getFaceDeviceByMallId', data: {MallId: mallId}})
      this.devices = rep
    },
    async queryData (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let rep = await this.$store.dispatch({
            type: 'faceAlarm/getFaceDeviceByMallId',
            data: {Did: formName.DeviceId}
          })
          this.tableShow = true
          this.data = rep
        }
      })
    }
  },
  activated () {
    this.selectCompanyMall()
    if (this.modifyForm.MallId !== '') {
      this.getFaceDeviceByMallId(this.modifyForm.MallId)
    }
  },
  watch: {
    'modifyForm.MallId': {
      handler: function (newValue, OldValue) {
        this.getFaceDeviceByMallId(newValue)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
