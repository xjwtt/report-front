<template>
  <el-tabs type="border-card"
           v-model="activeType"
           @tab-click="changeZone">
    <el-tab-pane v-for="(zones, key) in groupedZones"
                 :key=key
                 :label=$t(key)
                 :name=key>
      <label slot="label">
        <el-checkbox v-if="activeType===key"
                     :indeterminate="isIndeterminate"
                     v-model="checkAll"></el-checkbox>
        {{$t(key)}}
      </label>
      <el-checkbox-group v-model="zoneIds">
        <el-checkbox v-for="zone in zones"
                     :label=zone.Id
                     :key=zone.Id>
          {{zone.Name}}
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
    zoneTypes: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      activeType: null,
      groupedZones: {},
      zoneSelected: {},
      zoneIds: null
    }
  },
  computed: {
    isIndeterminate: {
      get: function () {
        let selectLength = this.zoneIds.length
        return selectLength > 0 && selectLength < this.groupedZones[this.activeType].length
      }
    },
    checkAll: {
      get: function () {
        return this.zoneIds.length === this.groupedZones[this.activeType].length
      },
      set: function (value) {
        this.$set(this.zoneSelected, this.activeType, value ? _.map(this.groupedZones[this.activeType], _ => _.Id) : [])
      }
    },
    ...mapState('app', {
      selectedMall: state => state.selectedMall
    })
  },
  methods: {
    calculateMutitype (val) {
      this.zoneIds = val[this.activeType] ? val[this.activeType] : []
    },
    changeZone () {
      // console.log(this.groupedZones)
      this.zoneIds = this.groupedZones ? _.map(this.groupedZones[this.activeType], _ => _.Id) : []
    }
  },
  watch: {
    zoneSelected: {
      handler (newVal) {
        this.calculateMutitype(newVal)
      },
      deep: true,
      immediate: true
    },
    zoneIds (newVal) {
      this.$set(this.zoneSelected, this.activeType, newVal)
    },
    selectedMall: {
      async handler (newValue, oldValue) {
        this.groupedZones = {}
        let tempMap = _.groupBy(newValue.PhysicalZones, (v) => v.ZoneTypeName)
        for (let i = 0, len = this.zoneTypes.length; i < len; i++) {
          let key = this.zoneTypes[i]
          let temp = tempMap[key]
          if (temp) {
            this.groupedZones[key] = temp
          }
        }
        this.activeType = this.groupedZones.hasOwnProperty(this.activeType) ? this.activeType : Object.keys(this.groupedZones)[0]
        this.zoneSelected = {}
        let value = _.map(this.groupedZones[this.activeType], _ => _.Id)
        this.$set(this.zoneSelected, this.activeType, value)
        if (!oldValue || oldValue.Id !== newValue.Id) {
          if (value && value.length > 0) {
            this.$emit('executeQuery', value)
          }
        }
      },
      immediate: true
    }
  }
}
</script>
