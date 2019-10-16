<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('businesstime_grid')}}</span>
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
          </div>
        </slot>
      </datatable>
    </el-card>
    <edit-businesstime-mall ref=editDialog @handleQueryChange="handleQueryChange"></edit-businesstime-mall>
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
import EditBusinesstimeMall from '../components/EditBusinesstimeMall'

export default {
  name: 'businesstime_grid',
  data: () => ({
    // table
    HeaderSettings: false,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'company_name', field: 'CompanyName', thComp: 'th-filter', sortable: true},
      {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
      {title: 'time_type_name', field: 'TimeTypeName', thComp: 'th-i18n', sortable: true, tdComp: 'td-i18n'},
      {title: 'start_date', field: 'StartDate', thComp: 'th-i18n', sortable: true},
      {title: 'start_time', field: 'StartTime', thComp: 'th-i18n', sortable: true},
      {title: 'end_date', field: 'EndDate', thComp: 'th-i18n', sortable: true},
      {title: 'end_time', field: 'EndTime', thComp: 'th-i18n', sortable: true},
      {title: 'weekdays', field: 'Weekdays', thComp: 'th-i18n', tdComp: 'td-weekdays'},
      {title: 'description', field: 'BusinessDescription', thComp: 'th-i18n'},
      {title: 'operation', thComp: 'th-i18n', tdComp: 'td-opt', visible: true}
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
    waitToDel: {}
  }),
  mounted () {
    this.xprops.eventbus
      .$on('DELETE', this.del)
      .$on('EDIT', this.$refs.editDialog.show)
  },
  methods: {
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'businesstime/gridMallBusinessTime', data: this.query})
      this.total = rep.total
      this.data = rep.list
    },
    del (row) {
      this.waitToDel = {'BusinesstimeId': row.BusinesstimeId, 'MallId': row.MallId}
      this.delDialogVisible = true
    },
    async sureDelete () {
      await this.$store.dispatch({
        type: 'businesstime/deleteBusinessTimeByBusinessTimeIdAndMallId',
        data: this.waitToDel
      })
      this.delDialogVisible = false
      this.handleQueryChange()
    }
  },
  activated () {
    // time_保证每次进入页面都会获取最新数据 防止数据修改页面没有拿到最新数据
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
    EditBusinesstimeMall
  }
}
</script>
