<template>
  <el-tabs type="border-card"
           v-model=activeType>
    <el-tab-pane v-for="(zones, key) in groupedZones"
                 :key=key
                 :label=$t(key)
                 :name=key>
      <span slot="label">
        <el-checkbox v-if="activeType===key"
                     :indeterminate="isIndeterminate"
                     v-model="checkAll"></el-checkbox>
        {{$t(key)}}
      </span>

      <el-checkbox-group v-model="mutiTypeSelector">
        <el-checkbox v-for="zone in zones"
                     :label=zone.Id
                     :key=zone.Id>{{zone.Name}}</el-checkbox>
      </el-checkbox-group>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import _ from 'underscore'
export default {
  data: () => ({
    activeType: null,
    groupedZones: {},
    zoneSelected: {}
  }),
  methods: {
    ...mapActions('zone', ['select'])
  },
  computed: {
    zoneIds: {
      get: function () {
        return this.zoneSelected[this.activeType] ? this.zoneSelected[this.activeType] : []
      }
    },
    isIndeterminate: {
      get: function () {
        let selectLength = this.mutiTypeSelector.length
        return selectLength > 0 && selectLength < this.groupedZones[this.activeType].length
      }
    },
    checkAll: {
      get: function () {
        return this.mutiTypeSelector.length === this.groupedZones[this.activeType].length
      },
      set: function (value) {
        this.$set(this.zoneSelected, this.activeType, value ? _.map(this.groupedZones[this.activeType], _ => _.Id) : [])
      }
    },
    mutiTypeSelector: {
      get: function () {
        return this.zoneSelected[this.activeType] ? this.zoneSelected[this.activeType] : []
      },
      set: function (value) {
        this.$set(this.zoneSelected, this.activeType, value)
      }
    },
    ...mapState('app', {
      selectedMall: state => state.selectedMall
    })
  },
  watch: {
    selectedMall: {
      async handler (newValue) {
        let result = await this.select({ MallIds: [newValue.Id] })
        this.groupedZones = _.groupBy(result, _ => _.ZoneTypeName)
        this.activeType = this.groupedZones.hasOwnProperty(this.activeType) ? this.activeType : Object.keys(this.groupedZones)[0]
        this.zoneSelected = {}
        this.zoneSelected[this.activeType] = _.map(this.groupedZones[this.activeType], _ => _.Id)
        // if (this.zoneSelected) {
        //   this.zoneSelected = {}
        // } else {
        //   this.zoneSelected = {}
        //   this.zoneSelected[this.activeType] = _.map(this.groupedZones[this.activeType], _ => _.Id)
        // }
      },
      immediate: true
    }
  }
}
</script>
