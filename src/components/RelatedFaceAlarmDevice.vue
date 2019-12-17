<template>
  <el-dialog :title="$t('site')"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="50%">
    <el-transfer
      filterable
      :filter-method="filterMethod"
      filter-placeholder="..."
      v-model="selectDeviceValue"
      :data="devices"
      :props="{ key: 'Id', label: 'DeviceId', disable: false }"
      :titles="[$t('unchecked'),$t('selected')]">
    </el-transfer>
    <span slot="footer"
          class="dialog-footer">
      <el-button type="primary"
                 @click="submitForm('modifyForm')">{{$t('ok')}}</el-button>
      <el-button @click="dialogVisible = false">{{$t('cancel')}}</el-button>
    </span>
  </el-dialog>
</template>

<script>
import _ from 'underscore'

export default {
  data () {
    return {
      dialogVisible: false,
      devices: [],
      faceAlarmId: '',
      selectDeviceValue: [],
      filterMethod (query, item) {
        return item.DeviceId.indexOf(query) > -1
      }
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.getFaceDeviceAndFaceAlarmDevice(form.Id, form.MallId)
    },
    async getFaceDeviceAndFaceAlarmDevice (id, mallId) {
      this.faceAlarmId = id
      let rep = await this.$store.dispatch({
        type: 'faceAlarm/getFaceDeviceAndFaceAlarmDevice',
        data: {Id: id, MallId: mallId}
      })
      this.devices = rep.Devices
      this.selectDeviceValue = rep.Dids
    },
    async submitForm () {
      let deviceIds = []
      // 检查
      let deviceMap = _.groupBy(this.devices, function (m) {
        return m.Id
      })
      // 有的设备换了案场
      _.each(this.selectDeviceValue, function (it) {
        let device = deviceMap[it]
        if (device) {
          deviceIds.push(it)
        }
      })
      await this.$store.dispatch({
        type: 'faceAlarm/faceAlarmSaveDevices',
        data: {Id: this.faceAlarmId, deviceIds: deviceIds}
      })
      this.dialogVisible = false
      this.$emit('handleQueryChange')
    }
  }
}
</script>

<style scoped>

</style>
