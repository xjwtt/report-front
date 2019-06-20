<template>
  <div>
    <el-dialog :title="$t('edit')"
               v-if="dialogVisible"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="70%">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('flow_device')" name="device">
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
                <el-form-item :label="$t('device_id')"
                              prop="DeviceId">
                  <el-input v-model.trim="modifyForm.DeviceId"></el-input>
                </el-form-item>
                <el-form-item :label="$t('device_name')"
                              prop="DeviceName">
                  <el-input v-model.trim="modifyForm.DeviceName"></el-input>
                </el-form-item>
                <el-form-item :label="$t('position')"
                              prop="Position">
                  <el-input v-model.trim="modifyForm.Position"></el-input>
                </el-form-item>
                <el-form-item :label="$t('IP')"
                              prop="IpAddress">
                  <el-input v-model.trim="modifyForm.IpAddress"></el-input>
                </el-form-item>
                <el-form-item :label="$t('serial_number')"
                              prop="SerialNumber">
                  <el-input v-model.trim="modifyForm.SerialNumber"></el-input>
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
        <el-tab-pane :label="$t('camera_zone')" name="deviceZone">
          <el-row :gutter="20">
            <el-col :span="2" :offset="18">
              <button class="el-icon-plus" type="button" @click="newOneCameraZone()"></button>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20">
              <el-table
                :data="zoneTableData"
                border
                style="width: 100%">
                <el-table-column
                  prop="Zone"
                  :label="$t('zone_code')">
                </el-table-column>
                <el-table-column
                  prop="ZoneClass"
                  :label="$t('zone_class')">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  :label="$t('status')">
                  <template slot-scope="scope">
                    <el-tag size="medium" :type="scope.row.Enabled ===1?'success':'danger'">
                      {{ scope.row.Enabled ===1?$t('start_using'):$t('block_up') }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  :label="$t('operation')"
                  width="180">
                  <template slot-scope="scope">
                    <el-button @click="cameraZoneEdit(scope.row)" type="text" size="small">{{$t('edit')}}</el-button>
                    <el-button @click="cameraZoneRemove(scope.row)" type="text" size="small">{{$t('delete')}}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer"
            class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm('modifyForm')">{{$t('ok')}}</el-button>
      <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
    </span>
    </el-dialog>
    <el-dialog :title="$t('prompt')"
               :visible.sync="delDialogVisible"
               width="30%">
      <span>{{$t('confirm_delete')}} Zone : {{delCameraZone.Zone}} ?</span>
      <span slot="footer"
            class="dialog-footer">
          <el-button @click="delDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="sureDelete">{{$t('ok')}}</el-button>
        </span>
    </el-dialog>
    <el-dialog :title="$t('camera_zone')"
               v-if="cameraZoneDialogVisible"
               :visible.sync="cameraZoneDialogVisible"
               :close-on-click-modal="false"
               width="70%">
      <el-form :model="zoneForm"
               :rules="zoneRules"
               ref=zoneForm
               label-width="100px"
               class="demo-zoneForm">
        <el-form-item :label="$t('zone_code')"
                      prop="Zone">
          <el-input v-model.trim="zoneForm.Zone"></el-input>
        </el-form-item>
        <el-form-item :label="$t('zone_class')"
                      prop="ZoneClass">
          <el-radio v-model="zoneForm.ZoneClass" label="Count">{{$t('zoneClass_Count')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Passby">{{$t('zoneClass_PassBy')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Fitting">{{$t('zoneClass_Fitting')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Dwell">{{$t('zoneClass_Dwell')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Queue">{{$t('zoneClass_Queue')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Alarm">{{$t('zoneClass_Alarm')}}</el-radio>
        </el-form-item>
        <el-form-item :label="$t('is_enabled')"
                      prop="Enabled">
          <el-radio v-model="zoneForm.Enabled" :label="1">{{$t('start_using')}}</el-radio>
          <el-radio v-model="zoneForm.Enabled" :label="-1">{{$t('block_up')}}</el-radio>
        </el-form-item>
      </el-form>
      <span slot="footer"
            class="dialog-footer">
      <el-button type="primary"
                 @click="zoneSubmitForm('zoneForm')">{{$t('ok')}}</el-button>
      <el-button @click="cameraZoneDialogVisible = false">{{$t('cancel')}}</el-button>
    </span>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'underscore'

const defaultForm = () => {
  return {
    MallId: '',
    Id: '',
    DeviceId: '',
    DeviceName: '',
    Position: '',
    IpAddress: '',
    SerialNumber: '',
    Enabled: 1
  }
}
const cameraZoneDefaultForm = () => {
  return {
    Zone: '0',
    ZoneClass: 'Count',
    Enabled: 1
  }
}
export default {
  name: 'EditCamera',
  data () {
    return {
      activeName: 'device',
      dialogVisible: false,
      modifyForm: defaultForm(),
      rules: {
        MallId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ],
        DeviceId: [
          {required: true, message: this.$t('please_fill_in_the_value'), trigger: 'blur'}
        ]
      },
      malls: [],
      zoneTableData: [],
      cameraZoneDialogVisible: false,
      zoneForm: cameraZoneDefaultForm(),
      zoneRules: {
        Zone: [
          {required: true, message: this.$t('must_input_zone'), trigger: 'blur'}
        ]
      },
      delDialogVisible: false,
      delCameraZone: {}
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.activeName = 'device'
      this.selectCompanyMall()
      this.$nextTick(() => {
        this.$refs['modifyForm'].resetFields()
      })
      this.modifyForm = form ? Object.assign({}, form) : defaultForm()
      if (this.modifyForm.Id !== '') {
        this.cameraZoneByCameraId(this.modifyForm.Id)
      }
    },
    async submitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          if (this.zoneTableData.length > 0) {
            this.modifyForm['cameraZones'] = this.zoneTableData
            await this.$store.dispatch({type: 'camera/saveOrUpdateCamera', data: this.modifyForm})
            this.dialogVisible = false
            this.$emit('handleQueryChange')
          } else {
            this.$message.error(this.$t('must_input_zone'))
          }
        } else {
          this.$message.error(this.$t('incorrect_parameter'))
        }
      })
    },
    async cameraZoneByCameraId (cameraId) {
      let rep = await this.$store.dispatch({type: 'cameraZone/CameraZoneByCameraId', data: {CameraId: cameraId}})
      _.each(rep, function (it, index) {
        it['Index'] = index
      })
      this.zoneTableData = rep
    },
    async selectCompanyMall () {
      let rep = await this.$store.dispatch({type: 'mall/selectCompanyMall'})
      this.malls = rep
    },
    cameraZoneEdit (row) {
      this.zoneForm = row
      this.cameraZoneDialogVisible = true
    },
    newOneCameraZone () {
      this.cameraZoneDialogVisible = true
      this.zoneForm = cameraZoneDefaultForm()
    },
    cameraZoneRemove (row) {
      this.delCameraZone = row
      this.delDialogVisible = true
    },
    sureDelete () {
      let row = this.delCameraZone
      this.zoneTableData = _.filter(this.zoneTableData, function (it) {
        return it.Index !== row.Index
      })
      this.zoneTableData = _.sortBy(this.zoneTableData, function (it) {
        return it.Zone
      })
      _.each(this.zoneTableData, function (it, index) {
        it.Index = index
      })
      this.delDialogVisible = false
    },
    async zoneSubmitForm (formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let status = true
          let that = this
          let zoneForm = this.zoneForm
          if (zoneForm.Index >= 0) {
            this.zoneTableData[zoneForm.Index] = zoneForm
            this.cameraZoneDialogVisible = false
          } else {
            _.each(this.zoneTableData, function (it) {
              if (it.Zone === zoneForm.Zone) {
                status = false
                that.$message.error(that.$t('zone_nonuniqueness'))
              }
            })
            if (status) {
              zoneForm['Index'] = this.zoneTableData.length
              zoneForm['CameraId'] = this.modifyForm.Id
              this.zoneTableData.push(zoneForm)
              this.cameraZoneDialogVisible = false
            }
          }
          let temp = _.sortBy(this.zoneTableData, function (it) {
            return it.Zone
          })
          this.zoneTableData = _.map(temp, function (v, i) {
            v.Index = i
            return v
          })
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
