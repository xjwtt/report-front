<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('camerastatus_manager')}}</span>
      </div>
      <datatable v-bind="$data">
        <slot>
          <div class="pull-right"
               style="margin:0 5px">
          </div>
        </slot>
      </datatable>
    </el-card>

  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'camerastatus_manager',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
      {title: 'deviceId', field: 'DeviceId', thComp: 'th-filter', sortable: true},
      {title: 'Position', field: 'Position'},
      {title: 'ZoneCount', field: 'ZoneCount', sortable: true},
      {title: 'IpAddress', field: 'IpAddress', sortable: true},
      {title: 'LastDataTime', field: 'LastDataTime', sortable: true},
      {title: 'UpdateTime', field: 'UpdateTime', sortable: true},
      {title: 'Status', field: 'UpdateTime', sortable: true, tdComp: 'td-cameraStatus'}
    ],
    data: [],
    total: 0,
    query: {},
    selection: [],
    xprops: {
      eventbus: new Vue()
    }
  }),
  methods: {
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'camera/userCameraStatus', data: this.query})
      this.total = rep.total
      this.data = rep.list
    }
  },
  watch: {
    query: {
      handler () {
        this.handleQueryChange()
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
