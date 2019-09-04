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
  name: 'camerastatus_manager',
  data: () => ({
    // table
    HeaderSettings: false,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
      {title: 'device_id', field: 'DeviceId', thComp: 'th-filter', sortable: true},
      {title: 'position', field: 'Position', thComp: 'th-i18n'},
      {title: 'zone_count', field: 'ZoneCount', thComp: 'th-i18n', sortable: true},
      {title: 'IP', field: 'IpAddress', thComp: 'th-i18n', sortable: true},
      {title: 'last_data_time', field: 'LastDataTime', thComp: 'th-i18n', sortable: true},
      {title: 'update_time', field: 'UpdateTime', thComp: 'th-i18n', sortable: true},
      {title: 'status', field: 'CameraStatus', thComp: 'th-i18n', tdComp: 'td-cameraStatus'}
    ],
    data: [],
    total: 0,
    query: {'time_': 0, CameraStatus: '正常'},
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
    this.query['time_'] = (new Date()).getTime()
  }
}
</script>

<style scoped>

</style>
