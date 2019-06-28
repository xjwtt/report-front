<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('camera_manager')}}</span>
      </div>
      <template>
        <el-radio v-model="query.Enabled" :label="1">{{$t('start_using')}}</el-radio>
        <el-radio v-model="query.Enabled" :label="-1">{{$t('block_up')}}</el-radio>
      </template>
      <datatable v-bind="$data">
        <slot>
          <div class="pull-right"
               style="margin:0 5px">
            <button class="btn btn-default"
                    type="button"
                    @click="newOne()">
              <i class="fa"
                 :class="'fa-plus'"></i>
            </button>

            <button v-if="selection.length>0"
                    class="btn btn-danger"
                    type="button"
                    @click="del()">
              <i class="fa"
                 :class="'fa-trash'"></i>
              <span>{{selection.length}}</span>
            </button>

          </div>
        </slot>
      </datatable>
      <edit-camera ref=editDialog @handleQueryChange="handleQueryChange"></edit-camera>
      <el-dialog :title="$t('prompt')"
                 :visible.sync="delDialogVisible"
                 width="30%">
        <span>{{$t('confirm_delete')}}{{waitToDel.length}}{{$t('items_delete')}}</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="delDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="sureDelete">{{$t('ok')}}</el-button>
        </span>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import Vue from 'vue'
import EditCamera from '@/components/EditCamera'
import _ from 'underscore'

export default {
  name: 'camera_manager',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
      {title: 'device_id', field: 'DeviceId', thComp: 'th-filter', sortable: true},
      {title: 'position', field: 'Position', thComp: 'th-i18n'},
      {title: 'zone_count', field: 'ZoneCount', thComp: 'th-i18n', sortable: true},
      {title: 'IP', field: 'IpAddress', thComp: 'th-i18n', sortable: true},
      {title: 'Mac', field: 'MacAddress', thComp: 'th-i18n'},
      {title: 'serial_number', field: 'SerialNumber', thComp: 'th-i18n'},
      {title: 'last_data_time', field: 'LastDataTime', thComp: 'th-i18n', sortable: true},
      {title: 'update_time', field: 'UpdateTime', thComp: 'th-i18n', sortable: true},
      {title: 'status', field: 'Enabled', thComp: 'th-i18n', tdComp: 'td-status'},
      {title: 'operation', tdComp: 'td-opt', thComp: 'th-i18n', visible: true}
    ],
    data: [],
    total: 0,
    query: {Enabled: 1},
    selection: [],
    xprops: {
      eventbus: new Vue()
    },

    delDialogVisible: false,
    waitToDel: []
  }),
  mounted () {
    this.xprops.eventbus
      .$on('EDIT', this.$refs.editDialog.show)
      .$on('DELETE', this.del)
  },
  methods: {
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
      await this.$store.dispatch({type: 'camera/deleteCamera', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'camera/userCameraGrid', data: this.query})
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
  },
  components: {
    EditCamera
  }
}
</script>

<style scoped>

</style>
