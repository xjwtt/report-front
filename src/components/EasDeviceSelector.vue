<template>
  <el-tabs type="border-card"
           v-model="lableName">
    <el-tab-pane :key="lableName"
                 :label="$t(lableName)"
                 :name="lableName">
      <label slot="label">
        <el-checkbox v-if="true"
                     :indeterminate="isIndeterminate"
                     v-model="checkAll"></el-checkbox>
        {{$t(lableName)}}
      </label>
      <el-checkbox-group v-model="deviceSelected">
        <el-checkbox v-for="device in easAlramDevice"
                     :label=device.Id
                     :key=device.Id>
          {{device.DeviceName}}
        </el-checkbox>
      </el-checkbox-group>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import {mapState} from 'vuex'
import _ from 'underscore'

export default {
  data () {
    return {
      lableName: 'eas_device',
      easAlramDevice: [],
      deviceSelected: []
    }
  },
  computed: {
    isIndeterminate: {
      get: function () {
        let selectLength = this.deviceSelected ? this.deviceSelected.length : 0
        return selectLength > 0 && selectLength < this.easAlramDevice.length
      }
    },
    checkAll: {
      get: function () {
        let select = this.deviceSelected ? this.deviceSelected.length : 0
        let all = this.easAlramDevice ? this.easAlramDevice.length : 0
        return select === all
      },
      set: function (value) {
        this.deviceSelected = value ? _.map(this.easAlramDevice, _ => _.Id) : []
      }
    },
    ...mapState('app', {
      selectedMall: state => state.selectedMall
    })
  },
  watch: {
    selectedMall: {
      async handler (newValue, oldValue) {
        let easAlarmDevice = newValue.EasAlarmDevice
        this.easAlramDevice = [].concat(easAlarmDevice)
        this.deviceSelected = [].concat(easAlarmDevice ? _.map(easAlarmDevice, _ => _.Id) : [])
        if (!oldValue || oldValue.Id !== newValue.Id) {
          if (this.deviceSelected && this.deviceSelected.length > 0) {
            this.$emit('executeQuery', this.deviceSelected, newValue.Id)
          }
        }
      }
    }
  }
}
</script>

<style scoped>

</style>
