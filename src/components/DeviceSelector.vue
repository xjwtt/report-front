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
        <el-checkbox v-for="device in device"
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
  props: {
    deviceType: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      lableName: 'eas_device',
      device: [],
      deviceSelected: []
    }
  },
  computed: {
    isIndeterminate: {
      get: function () {
        let selectLength = this.deviceSelected ? this.deviceSelected.length : 0
        return selectLength > 0 && selectLength < this.device.length
      }
    },
    checkAll: {
      get: function () {
        let select = this.deviceSelected ? this.deviceSelected.length : 0
        let all = this.device ? this.device.length : 0
        return select === all
      },
      set: function (value) {
        this.deviceSelected = value ? _.map(this.device, _ => _.Id) : []
      }
    },
    ...mapState('app', {
      selectedMall: state => state.selectedMall
    })
  },
  watch: {
    selectedMall: {
      async handler (newValue, oldValue) {
        let device = newValue.Device ? newValue.Device[this.deviceType] : []
        this.device = [].concat(device)
        this.deviceSelected = [].concat(device ? _.map(device, _ => _.Id) : [])
        if (!oldValue || oldValue.Id !== newValue.Id) {
          if (this.deviceSelected && this.deviceSelected.length > 0) {
            this.$emit('executeQuery', this.deviceSelected, newValue.Id)
          }
        }
      }
    }
  },
  activated () {
    let device = this.selectedMall.Device ? this.selectedMall.Device[this.deviceType] : []
    this.device = [].concat(device)
    this.deviceSelected = [].concat(device ? _.map(device, _ => _.Id) : [])
  }
}
</script>

<style scoped>

</style>
