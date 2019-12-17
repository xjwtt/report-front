<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
        <div slot="header"
             class="clearfix">
          <span>{{$t('historyflow_manager')}}</span>
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
                    <el-form-item :label="$t('businessTimeType')" prop="BusinessTime">
                      <el-select v-model.trim="modifyForm.BusinessTime"
                                 filterable
                                 placeholder="...">
                        <el-option v-for="item in businessTimes"
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
                    <el-form-item :label="$t('zone_class')" prop="ZoneClass">
                      <el-select v-model.trim="modifyForm.ZoneClass"
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
                  <el-col :span="8">
                    <el-form-item :label="$t('cameraZone')" prop="CameraZone">
                      <el-select v-model.trim="modifyForm.CameraZone"
                                 filterable
                                 placeholder="...">
                        <el-option v-for="item in cameraZones"
                                   :key="item.Id"
                                   :label="item.DeviceId+'#'+item.Zone"
                                   :value="item.Id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="primary" :title="$t('only_1_minute_data_can_be_modified')"
                               @click="promptSaveChange">
                      {{$t('save')}}
                    </el-button>
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
                  <el-col :span="8">
                    <el-form-item :label="$t('time_interval')" prop="Period">
                      <el-select v-model.trim="modifyForm.Period"
                                 filterable
                                 placeholder="...">
                        <el-option v-for="item in periods"
                                   :key="item.Id"
                                   :label="item.Name"
                                   :value="item.Id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="primary" @click="queryData('modifyForm')">{{$t('query')}}</el-button>
                  </el-col>
                </el-row>
              </el-form>
              <el-row v-show="tableShow">
                <el-col :space="18">
                  <el-tag type="success">{{this.$t('number_of_query_results')}} {{this.tableData.length}}</el-tag>
                </el-col>
                <el-col :span="18">
                  <v-table
                    is-vertical-resize
                    style="width:100%"
                    is-horizontal-resize
                    :vertical-resize-offset='50'
                    :min-height='150'
                    :columns="columns"
                    :table-data="tableData"
                    row-hover-color="#eee"
                    row-click-color="#edf7ff"
                    :cell-edit-done="cellEditDone">
                  </v-table>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
    </el-card>
    <el-dialog :title="$t('prompt')"
               :visible.sync="changeDialogVisible"
               width="30%">
      <span>{{$t('confirm_update_data')}}</span>
      <span slot="footer"
            class="dialog-footer">
          <el-button @click="changeDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="saveChange">{{$t('ok')}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import _ from 'underscore'

const defalutBusinessTimes = () => {
  return [{Id: 'All', Name: 'all_data'}, {Id: 'businesstime', Name: 'businesstime_data'}]
}
const defalutZoneClasss = () => {
  return [{Id: 'Count', Name: 'zoneClass_Count'}, {Id: 'PassBy', Name: 'zoneClass_PassBy'}, {
    Id: 'Dwell',
    Name: 'zoneClass_Dwell'
  }]
}
const defalutPeriods = () => {
  return [{Id: '1m', Name: '1Min'}, {Id: '5m', Name: '5Min'}, {Id: '10m', Name: '10Min'},
    {Id: '15m', Name: '15Min'}, {Id: '30m', Name: '30Min'}, {Id: '1h', Name: '60Min'}]
}
const countColums = () => {
  return [
    {field: 'date', title: 'Date', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true},
    {field: 'hour', title: 'Hour', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true},
    {field: 'minute', title: 'Minute', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true},
    {
      field: 'countEnter',
      title: 'Enter',
      width: 100,
      titleAlign: 'center',
      columnAlign: 'center',
      isEdit: true,
      isResize: true
    },
    {
      field: 'countExit',
      title: 'Exit',
      width: 100,
      titleAlign: 'center',
      columnAlign: 'center',
      isEdit: true,
      isResize: true
    }
  ]
}

const dwellColums = () => {
  return [
    {field: 'date', title: 'Date', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true},
    {field: 'hour', title: 'Hour', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true},
    {field: 'minute', title: 'Minute', width: 100, titleAlign: 'center', columnAlign: 'center', isResize: true},
    {
      field: 'numberServed',
      title: 'NumberServed',
      width: 100,
      titleAlign: 'center',
      columnAlign: 'center',
      isEdit: true,
      isResize: true
    },
    {
      field: 'secondsOccupied',
      title: 'SecondsOccupied',
      width: 100,
      titleAlign: 'center',
      columnAlign: 'center',
      isEdit: true,
      isResize: true
    }
  ]
}
const modifyForm = () => {
  return {
    MallId: '',
    CameraZone: '',
    ZoneClass: 'Count',
    BusinessTime: 'businesstime',
    Period: '1m',
    Date: new Date()
  }
}
export default {
  name: 'historyflow_manager',
  data () {
    return {
      malls: [],
      cameraZones: [],
      modifyForm: modifyForm(),
      businessTimes: defalutBusinessTimes(),
      zoneClasss: defalutZoneClasss(),
      periods: defalutPeriods(),
      rules: {
        MallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        BusinessTime: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        ZoneClass: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        CameraZone: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Date: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        Period: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      tableShow: false,
      columns: [],
      tableData: [],
      changeDialogVisible: false
    }
  },
  methods: {
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = rep
    },
    async selectCameraZoneByMallIdZoneClass (mallId, zoneClass) {
      let rep = await this.$store.dispatch({
        type: 'cameraZone/selectCameraZoneByMallIdZoneClass',
        data: {MallId: mallId, ZoneClass: zoneClass}
      })
      this.cameraZones = rep
    },
    cellEditDone (newValue, oldValue, rowIndex, rowData, field) {
      this.tableData[rowIndex][field] = newValue
    },
    promptSaveChange () {
      if (this.modifyForm['Period'] === '1m') {
        this.changeDialogVisible = true
      } else {
        this.$message.error(this.$t('only_1_minute_data_can_be_modified'))
      }
    },
    async saveChange () {
      if (this.modifyForm['Period'] === '1m') {
        let rep = await this.$store.dispatch({
          type: 'history/changeData',
          data: {
            ZoneClass: this.modifyForm['ZoneClass'],
            BusinessTime: this.modifyForm['BusinessTime'],
            'ChangeData': this.tableData
          }
        })
        this.changeDialogVisible = false
        if (rep && rep === true) {
          this.$message.success(this.$t('success'))
          this.queryData('modifyForm')
        } else {
          this.$message.error(this.$t('failed'))
        }
      } else {
        this.$message.error(this.$t('only_1_minute_data_can_be_modified'))
      }
    },
    async queryData (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          this.modifyForm['Date'] = moment(this.modifyForm['Date']).format('YYYY-MM-DD')
          let rep = await this.$store.dispatch({type: 'history/getHistoryFlow', data: this.modifyForm})
          if (rep && rep.length > 0) {
            this.tableShow = true
            switch (this.modifyForm['ZoneClass']) {
              case 'Count':
              case 'PassBy':
                this.columns = countColums()
                break
              case 'Dwell':
                this.columns = dwellColums()
                break
            }
            _.each(rep, function (v) {
              let t = v.time.slice(0, v.time.indexOf('+'))
              let time = moment(t)
              v.date = time.format('YYYY-MM-DD')
              v.hour = time.format('HH')
              v.minute = time.format('mm')
            })
            this.tableData = rep
          } else {
            this.tableShow = false
            this.$message.warning(this.$t('no_data'))
          }
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    }
  },
  activated () {
    this.selectCompanyMall()
    if (this.modifyForm.MallId !== '') {
      this.selectCameraZoneByMallIdZoneClass(this.modifyForm.MallId, this.modifyForm.ZoneClass)
    }
  },
  watch: {
    'modifyForm.MallId': {
      handler: function (newValue, OldValue) {
        this.selectCameraZoneByMallIdZoneClass(newValue, this.modifyForm.ZoneClass)
      },
      deep: true
    },
    'modifyForm.ZoneClass': {
      handler: function (newValue, OldValue) {
        this.selectCameraZoneByMallIdZoneClass(this.modifyForm.MallId, newValue)
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
