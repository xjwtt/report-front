<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('camerastatus_manager')}}</span>
      </div>
      <template>
        <el-radio v-model="query.CameraStatus" :label="'正常'">{{$t('normal')}}</el-radio>
        <el-radio v-model="query.CameraStatus" :label="'断线'">{{$t('offLine')}}</el-radio>
      </template>
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
      {title: 'device_id', field: 'DeviceId', thComp: 'th-filter', sortable: true},
      {title: 'position', field: 'Position'},
      {title: 'zone_count', field: 'ZoneCount', sortable: true},
      {title: 'Ip', field: 'IpAddress', sortable: true},
      {title: 'last_data_time', field: 'LastDataTime', sortable: true},
      {title: 'update_time', field: 'UpdateTime', sortable: true},
      {title: 'status', field: 'CameraStatus', tdComp: 'td-cameraStatus'}
    ],
    data: [],
    total: 0,
    query: {CameraStatus: '正常'},
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
