<template>
  <div>
    <el-dialog title="编辑"
               v-if="dialogVisible"
               :visible.sync="dialogVisible"
               :close-on-click-modal="false"
               width="70%">
      <el-tabs v-model="activeName">
        <el-tab-pane :label="$t('摄像机')" name="device">
          <el-row :gutter="20">
            <el-col :span="14">
              <el-form :model="modifyForm"
                       :rules="rules"
                       ref=modifyForm
                       label-width="150px"
                       class="demo-modifyForm">
                <el-form-item :label="$t('案场')" prop="MallId">
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
                <el-form-item :label="$t('位置')"
                              prop="Position">
                  <el-input v-model.trim="modifyForm.Position"></el-input>
                </el-form-item>
                <el-form-item :label="$t('Ip_address')"
                              prop="IpAddress">
                  <el-input v-model.trim="modifyForm.IpAddress"></el-input>
                </el-form-item>
                <el-form-item :label="$t('序列号')"
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
        <el-tab-pane :label="$t('摄像机区域')" name="deviceZone">
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
                  prop="ZoneId"
                  :label="$t('区域码')">
                </el-table-column>
                <el-table-column
                  prop="ZoneClass"
                  :label="$t('统计方式')">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  :label="$t('状态')">
                  <template slot-scope="scope">
                    <el-tag size="medium" :type="scope.row.Enabled ===1?'success':'danger'" >
                      {{ scope.row.Enabled ===1?$t('start_using'):$t('block_up') }}
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  :label="$t('操作')"
                  width="180">
                  <template slot-scope="scope">
                    <el-button @click="cameraZoneEdit(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="cameraZoneRemove(scope.row)" type="text" size="small">删除</el-button>
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
                 @click="submitForm('modifyForm')">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </span>
    </el-dialog>
    <el-dialog title="摄像区域"
               v-if="cameraZoneDialogVisible"
               :visible.sync="cameraZoneDialogVisible"
               :close-on-click-modal="false"
               width="70%">
      <el-form :model="zoneForm"
               :rules="zoneRules"
               ref=zoneForm
               label-width="100px"
               class="demo-zoneForm">
        <el-form-item :label="$t('区域码')"
                      prop="ZoneId">
          <el-input v-model.number="zoneForm.ZoneId"></el-input>
        </el-form-item>
        <el-form-item :label="$t('统计方式')"
                      prop="ZoneClass">
          <el-radio v-model="zoneForm.ZoneClass" label="Count">{{$t('客流(Count)')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Passby">{{$t('经过(Passby)')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Fitting">{{$t('试衣间(Fitting)')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Dwell">{{$t('服务(Dwell)')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Queue">{{$t('队列(Queue)')}}</el-radio>
          <el-radio v-model="zoneForm.ZoneClass" label="Alarm">{{$t('警报(Alarm)')}}</el-radio>
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
                 @click="zoneSubmitForm('zoneForm')">确 定</el-button>
      <el-button @click="cameraZoneDialogVisible = false">取 消</el-button>
    </span>
    </el-dialog>
    <el-dialog title="提示"
               :visible.sync="delDialogVisible"
               width="30%">
      <span>确定删除吗？</span>
      <span slot="footer"
            class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="sureDelete">确 定</el-button>
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
    ZoneId: 0,
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
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ],
        DeviceId: [
          {required: true, message: this.$t('please_enter_the_field_name'), trigger: 'blur'}
        ]
      },
      malls: [],
      zoneTableData: [],
      cameraZoneDialogVisible: false,
      zoneForm: cameraZoneDefaultForm(),
      zoneRules: {
        ZoneId: [
          {required: true, message: this.$t('请输入区域码'), trigger: 'blur'}
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
            this.$message.error(this.$t('必须添加区域码'))
          }
        } else {
          this.$message.error(this.$t('参数不正确'))
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
        return it.ZoneId
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
              if (it.ZoneId === zoneForm.ZoneId) {
                status = false
                that.$message.error(that.$t('区域码不唯一'))
              }
            })
            if (status) {
              zoneForm['Index'] = this.zoneTableData.length
              zoneForm['CameraId'] = this.modifyForm.Id
              this.zoneTableData.push(zoneForm)
              this.cameraZoneDialogVisible = false
            }
          }
          this.zoneTableData = _.sortBy(this.zoneTableData, function (it) {
            return it.ZoneId
          })
        } else {
          this.$message.error(this.$t('参数不正确'))
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
