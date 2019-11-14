<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('face_alarm_manage')}}</span>
      </div>
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
            <button class="btn btn-default"
                    type="button"
                    @click="newOne()">
              <i class="fa"
                 :class="'fa-plus'"></i>
            </button>
          </div>
        </slot>
      </datatable>
    </el-card>
    <edit-face-alarm ref=editDialog @handleQueryChange="handleQueryChange"></edit-face-alarm>
    <related-face-alarm-device ref=RelatedFaceAlarmDevice
                               @handleQueryChange="handleQueryChange"></related-face-alarm-device>
    <el-dialog :title="$t('prompt')"
               :visible.sync="delDialogVisible"
               width="30%">
      <span>{{$t('confirm_delete')}}</span>
      <span slot="footer"
            class="dialog-footer">
          <el-button @click="delDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="sureDelete">{{$t('ok')}}</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>

import Vue from 'vue'
import _ from 'underscore'
import EditFaceAlarm from '../components/EditFaceAlarm'
import RelatedFaceAlarmDevice from '../components/RelatedFaceAlarmDevice'

export default {
  data: () => ({
    // table
    HeaderSettings: false,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
      {title: 'name', field: 'Name', thComp: 'th-i18n', sortable: true, tdComp: 'td-i18n'},
      {title: 'start_date', field: 'StartDate', thComp: 'th-i18n', sortable: true},
      {title: 'start_time', field: 'StartTime', thComp: 'th-i18n', sortable: true},
      {title: 'end_date', field: 'EndDate', thComp: 'th-i18n', sortable: true},
      {title: 'end_time', field: 'EndTime', thComp: 'th-i18n', sortable: true},
      {title: 'device_number', field: 'DeviceNumber', thComp: 'th-i18n', sortable: true},
      {title: 'description', field: 'Description', thComp: 'th-i18n'},
      {title: 'ranked', field: 'Ranked', thComp: 'th-i18n'},
      {title: 'operation', thComp: 'th-i18n', tdComp: 'td-businesstimeOpt', visible: true}
    ],
    data: [],
    total: 0,
    query: {'time_': 0},
    selection: [],
    xprops: {
      eventbus: new Vue()
    },
    // del
    delDialogVisible: false,
    waitToDel: []
  }),
  mounted () {
    this.xprops.eventbus
      .$on('DELETE', this.del)
      .$on('EDIT', this.$refs.editDialog.show)
      .$on('Related', this.$refs.RelatedFaceAlarmDevice.show)
  },
  methods: {
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'faceAlarm/gridFaceAlarm', data: this.query})
      this.total = rep.total
      this.data = rep.list
    },
    newOne () {
      this.$refs.editDialog.show()
    },
    del (row) {
      this.waitToDel = []
      if (row) {
        this.waitToDel.push(row.Id)
      } else {
        this.waitToDel = _.map(this.selection, el => el.Id)
      }
      this.delDialogVisible = true
    },
    async sureDelete () {
      await this.$store.dispatch({
        type: 'faceAlarm/deleteFaceAlarmByIds',
        data: this.waitToDel
      })
      this.delDialogVisible = false
      this.handleQueryChange()
    }
  },
  activated () {
    // time_保证每次进入页面都会获取最新数据 防止数据修改页面没有拿到最新数据
    Vue.set(this.query, 'offset', 0)
    this.query['time_'] = (new Date()).getTime()
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
  components: {
    EditFaceAlarm,
    RelatedFaceAlarmDevice
  }
}
</script>

<style scoped>

</style>
