<template>
  <el-dialog :title="$t('logs')"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="70%">
    <template>
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
    </template>
  </el-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  data () {
    return {
      dialogVisible: false,
      // table
      HeaderSettings: false,
      tblClass: 'table-bordered',
      tblStyle: 'color: #666',
      columns: [
        {title: 'send_start_time', field: 'SendStartTime', thComp: 'th-i18n'},
        {title: 'send_end_time', field: 'SendEndTime', thComp: 'th-i18n'},
        {title: 'createTime', field: 'CreateTime', thComp: 'th-i18n'},
        {title: 'message', field: 'Message', thComp: 'th-i18n'},
        {title: 'status', field: 'Status', thComp: 'th-i18n', tdComp: 'td-sendStatus'},
        {title: 'operation', tdComp: 'td-sendRegularlyLogOpt', thComp: 'th-i18n', visible: true}
      ],
      data: [],
      total: 0,
      query: {},
      xprops: {
        eventbus: new Vue()
      }
    }
  },
  mounted () {
    this.xprops.eventbus
      .$on('Upload', this.uploadByLog)
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.query['SendRegularlyId'] = form.Id
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'senddataregularly/gridSendRegularlyLogs', data: this.query})
      this.total = rep.total
      this.data = rep.list
    },
    async uploadByLog (row) {
      let rep = await this.$store.dispatch({type: 'senddataregularly/uploadByLog', data: {SendRegularlyLog: row}})
      if (rep) {
        this.$message.success(this.$t('success'))
      } else {
        this.$message.error(this.$t('failed'))
      }
    }
  },
  watch: {
    query: {
      handler (nValue) {
        if (nValue.limit) {
          this.handleQueryChange()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
