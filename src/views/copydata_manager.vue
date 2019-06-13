<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div class="module">
        <span>{{$t('camera_copy_data')}}</span>
        <template>
          <el-row>
            <el-col :span="18">
              <el-form :model="copyDataForm"
                       :rules="rules"
                       ref=copyDataForm
                       label-width="150px">
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('zone_class')" prop="ZoneClass">
                      <el-select v-model.trim="copyDataForm.ZoneClass"
                                 filterable
                                 placeholder="...">
                        <el-option v-for="item in zoneClasss"
                                   :key="item.Id"
                                   :label="$t(item.Name)"
                                   :value="item.Id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('source_mall')" prop="SourceMallId">
                      <el-select v-model.trim="copyDataForm.SourceMallId"
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
                    <el-form-item :label="$t('cameraZone')" prop="SourceCameraZoneId">
                      <el-select v-model.trim="copyDataForm.SourceCameraZoneId"
                                 filterable
                                 placeholder="...">
                        <el-option v-for="item in sourceCameraZone"
                                   :key="item.Id"
                                   :label="item.DeviceId+'#'+item.Zone"
                                   :value="item.Id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('date')" prop="SourceDate">
                      <el-date-picker
                        v-model="copyDataForm.SourceDate"
                        type="date"
                        :placeholder="$t('selection_date')">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('start_time')" prop="SourceStartTime">
                      <el-time-select
                        v-model="copyDataForm.SourceStartTime"
                        :range-separator="$t('to')"
                        :picker-options="{
                            start: '00:00',
                            step: '00:05',
                            end: '23:59'
                          }"
                        placeholder="...">
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item :label="$t('end_time')" prop="SourceEndTime">
                      <el-time-select
                        v-model="copyDataForm.SourceEndTime"
                        :range-separator="$t('to')"
                        :picker-options="{
                            start: '00:00',
                            step: '00:05',
                            end: '23:59'
                          }"
                        placeholder="...">
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="8">
                    <el-form-item :label="$t('Target_mall')" prop="TargetMallId">
                      <el-select v-model.trim="copyDataForm.TargetMallId"
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
                    <el-form-item :label="$t('cameraZone')" prop="TargetCameraZoneId">
                      <el-select v-model.trim="copyDataForm.TargetCameraZoneId"
                                 filterable
                                 placeholder="...">
                        <el-option v-for="item in targetCameraZone"
                                   :key="item.Id"
                                   :label="item.DeviceId+'#'+item.Zone"
                                   :value="item.Id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="10">
                    <el-form-item :label="$t('date')" prop="TargetDate">
                      <el-date-picker
                        v-model="copyDataForm.TargetDate"
                        type="date"
                        :placeholder="$t('selection_date')">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <el-button type="primary" @click="confirmCopyData('businessTime')">
                      {{$t('confirm')}}
                    </el-button>
                  </el-col>
                </el-row>
              </el-form>
            </el-col>
          </el-row>
        </template>
      </div>
    </el-card>
    <el-dialog :title="$t('prompt')"
               :visible.sync="copyDataDialogVisible"
               width="30%">
      <span>{{$t('confirm_update_data')}}</span>
      <span slot="footer"
            class="dialog-footer">
          <el-button @click="copyDataDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="saveChange('copyDataForm')">{{$t('ok')}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'

const defalutZoneClasss = () => {
  return [{Id: 'Count', Name: 'zoneClass_Count'}, {Id: 'PassBy', Name: 'zoneClass_PassBy'}, {
    Id: 'Dwell',
    Name: 'zoneClass_Dwell'
  }]
}
const defalutCopyDataForm = () => {
  return {
    ZoneClass: 'Count',
    SourceMallId: '',
    SourceCameraZoneId: '',
    SourceDate: '',
    SourceStartTime: '',
    SourceEndTime: '',
    TargetMallId: '',
    TargetCameraZoneId: '',
    TargetDate: ''
  }
}
export default {
  name: 'copydata_manager',
  data () {
    return {
      malls: [],
      copyDataForm: defalutCopyDataForm(),
      zoneClasss: defalutZoneClasss(),
      sourceCameraZone: [],
      targetCameraZone: [],
      copyDataDialogVisible: false,
      rules: {
        ZoneClass: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        SourceMallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        SourceCameraZoneId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        SourceDate: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        TargetMallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        TargetCameraZoneId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        TargetDate: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = rep
    },
    async selectCameraZoneByMallIdZoneClass (mallId, zoneClass, type) {
      let rep = await this.$store.dispatch({
        type: 'cameraZone/selectCameraZoneByMallIdZoneClass',
        data: {MallId: mallId, ZoneClass: zoneClass}
      })
      switch (type) {
        case 'source':
          this.sourceCameraZone = rep
          break
        case 'target':
          this.targetCameraZone = rep
      }
    },
    confirmCopyData () {
      this.copyDataDialogVisible = true
    },
    saveChange (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.copyDataForm.SourceDate = moment(this.copyDataForm.SourceDate).format('YYYY-MM-DD')
          this.copyDataForm.TargetDate = moment(this.copyDataForm.TargetDate).format('YYYY-MM-DD')
          let rep = await this.$store.dispatch({type: 'history/copyData', data: this.copyDataForm})
          this.copyDataDialogVisible = false
          if (rep && rep === true) {
            this.$message.success(this.$t('success'))
          } else {
            this.$message.error(this.$t('failed'))
          }
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    }
  },
  mounted () {
    this.selectCompanyMall()
  },
  watch: {
    'copyDataForm.SourceMallId': {
      handler: function (newValue, OldValue) {
        this.selectCameraZoneByMallIdZoneClass(newValue, this.copyDataForm.ZoneClass, 'source')
      },
      deep: true
    },
    'copyDataForm.TargetMallId': {
      handler: function (newValue, OldValue) {
        this.selectCameraZoneByMallIdZoneClass(newValue, this.copyDataForm.ZoneClass, 'target')
      },
      deep: true
    },
    'copyDataForm.ZoneClass': {
      handler: function (newValue, OldValue) {
        this.selectCameraZoneByMallIdZoneClass(this.copyDataForm.SourceMallId, newValue, 'source')
        this.selectCameraZoneByMallIdZoneClass(this.copyDataForm.TargetMallId, newValue, 'target')
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
