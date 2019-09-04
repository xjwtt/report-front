<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('send_data_regularly')}}</span>
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
      <edit-send-regularly ref=editDialog @handleQueryChange="handleQueryChange"></edit-send-regularly>
      <related-send-regularly-mall ref=relatedSendRegularlyMall
                                   @handleQueryChange="handleQueryChange"></related-send-regularly-mall>
      <send-regularly-log ref=sendRegularlyLog></send-regularly-log>
      <send-regularly-custom-upload ref="customUpload"
                                    @handleQueryChange="handleQueryChange"></send-regularly-custom-upload>
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
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'
import _ from 'underscore'
import EditSendRegularly from '@/components/EditSendRegularly'
import RelatedSendRegularlyMall from '@/components/RelatedSendRegularlyMall'
import SendRegularlyLog from '../components/SendRegularlyLog'
import SendRegularlyCustomUpload from '../components/SendRegularlyCustomUpload'

export default {
  data: () => ({
    // table
    HeaderSettings: false,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'company_name', field: 'CompanyName', thComp: 'th-filter', sortable: true},
      {title: 'cron_type', field: 'CronType', thComp: 'th-i18n', sortable: true},
      {title: 'description', field: 'Description', thComp: 'th-i18n'},
      {title: 'mall_number', field: 'MallNumber', thComp: 'th-i18n'},
      {title: 'last_send_time', field: 'LastSendTime', thComp: 'th-i18n'},
      {title: 'last_send_status', field: 'LastSendStatus', thComp: 'th-i18n', tdComp: 'td-sendStatus'},
      {title: 'is_enabled', field: 'Enabled', thComp: 'th-i18n', tdComp: 'td-status'},
      {title: 'operation', tdComp: 'td-sendRegularlyOpt', thComp: 'th-i18n', visible: true}
    ],
    data: [],
    total: 0,
    query: {'time_': 0, Enabled: 1},
    selection: [],
    xprops: {
      eventbus: new Vue()
    },
    delDialogVisible: false,

    waitToDel: []
  }),
  mounted () {
    this.xprops.eventbus
      .$on('DELETE', this.del)
      .$on('EDIT', this.$refs.editDialog.show)
      .$on('Logs', this.$refs.sendRegularlyLog.show)
      .$on('CustomUpload', this.$refs.customUpload.show)
      .$on('RelatedSendRegularlyMall', this.$refs.relatedSendRegularlyMall.show)
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
      await this.$store.dispatch({type: 'senddataregularly/delSendRegularly', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'senddataregularly/gridSendRegularly', data: this.query})
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
  },
  components: {
    EditSendRegularly,
    RelatedSendRegularlyMall,
    SendRegularlyLog,
    SendRegularlyCustomUpload
  }
}
</script>

<style scoped>

</style>
