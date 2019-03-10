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
      {title: '位置', field: 'Position'},
      {title: '区域数量', field: 'ZoneCount', sortable: true},
      {title: 'IpAddress', field: 'IpAddress', sortable: true},
      {title: '数据最后时间', field: 'LastDataTime', sortable: true},
      {title: '设备最后心跳时间', field: 'UpdateTime', sortable: true},
      {title: '运行状态', field: 'UpdateTime', sortable: true, tdComp: 'td-cameraStatus'}
    ],
    data: [],
    total: 0,
    query: {},
    selection: []
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
