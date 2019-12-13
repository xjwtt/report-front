<template>
  <div class="config-page">
    <el-card class="box-card" style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('devicestatus_manager')}}</span>
      </div>
      <template>
        <el-radio v-model="query.DeviceStatus" :label="'正常'">{{$t('normal')}}</el-radio>
        <el-radio v-model="query.DeviceStatus" :label="'断线'">{{$t('offLine')}}</el-radio>
      </template>
      <datatable v-bind="$data">
        <slot>
          <div class="pull-right"
               style="margin:0 5px">
            <button class="btn btn-default"
                    type="button"
                    @click="handleQueryChange()">
              <i class="fa"
                 :class="'el-icon-refresh'"></i>
            </button>
          </div>
        </slot>
      </datatable>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'devicestatus_manager',
  data () {
    return {
      // table
      HeaderSettings: true,
      tblClass: 'table-bordered',
      tblStyle: 'color: #666',
      columns: [
        {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
        {title: 'device_id', field: 'DeviceId', thComp: 'th-filter', sortable: true},
        {title: 'device_type', field: 'DeviceTypeName', thComp: 'th-filter', sortable: true},
        {title: 'position', field: 'Position', thComp: 'th-i18n', visible: false},
        {title: 'IP', field: 'IpAddress', thComp: 'th-i18n', sortable: true},
        {title: 'Mac', field: 'MacAddress', thComp: 'th-i18n'},
        {title: 'serial_number', field: 'SerialNumber', thComp: 'th-i18n'},
        {title: 'last_data_time', field: 'LastDataTime', thComp: 'th-i18n', sortable: true},
        {title: 'update_time', field: 'UpdateTime', thComp: 'th-i18n', sortable: true},
        {title: 'status', field: 'DeviceStatus', thComp: 'th-i18n', tdComp: 'td-cameraStatus'}
      ],
      data: [],
      total: 0,
      query: {'time_': 0, DeviceStatus: '正常'},
      selection: [],
      xprops: {
        eventbus: new Vue()
      }
    }
  },
  methods: {
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'device/userDeviceGrid', data: this.query})
      this.total = rep.total
      this.data = rep.list
    }
  },
  watch: {
    query: {
      handler (nValue) {
        if (nValue.time_ !== 0) {
          this.handleQueryChange()
        }
      },
      deep: true
    }
  },
  activated () {
    // time_保证每次进入页面都会获取最新数据 防止数据修改页面没有拿到最新数据
    Vue.set(this.query, 'offset', 0)
    this.query['time_'] = (new Date()).getTime()
  }
}
</script>

<style scoped>

</style>
