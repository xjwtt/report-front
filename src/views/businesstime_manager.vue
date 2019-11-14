<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('businesstime_manager')}}</span>
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
      <edit-businesstime ref=editDialog @handleQueryChange="handleQueryChange"></edit-businesstime>
      <related-businesstime-mall ref=RelatedBusinesstimeMall
                                 @handleQueryChange="handleQueryChange"></related-businesstime-mall>
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
import EditBusinesstime from '@/components/EditBusinesstime'
import RelatedBusinesstimeMall from '@/components/RelatedBusinesstimeMall'
import _ from 'underscore'

export default {
  name: 'businesstime_manager',
  data: () => ({
    // table
    HeaderSettings: false,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'company_name', field: 'CompanyName', thComp: 'th-filter', sortable: true},
      {title: 'time_type_name', field: 'TimeTypeName', thComp: 'th-i18n', sortable: true, tdComp: 'td-i18n'},
      {title: 'start_date', field: 'StartDate', thComp: 'th-i18n', sortable: true},
      {title: 'start_time', field: 'StartTime', thComp: 'th-i18n', sortable: true},
      {title: 'end_date', field: 'EndDate', thComp: 'th-i18n', sortable: true},
      {title: 'end_time', field: 'EndTime', thComp: 'th-i18n', sortable: true},
      {title: 'site_count', field: 'SiteCount', thComp: 'th-i18n', sortable: true},
      {title: 'weekdays', field: 'Weekdays', thComp: 'th-i18n', tdComp: 'td-weekdays'},
      {title: 'description', field: 'Description', thComp: 'th-i18n'},
      {title: 'operation', tdComp: 'td-businesstimeOpt', thComp: 'th-i18n', visible: true}
    ],
    data: [],
    total: 0,
    query: {'time_': 0},
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
      .$on('Related', this.$refs.RelatedBusinesstimeMall.show)
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
      await this.$store.dispatch({type: 'businesstime/deleteBusinessTime', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'businesstime/gridBusinessTime', data: this.query})
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
  },
  components: {
    EditBusinesstime,
    RelatedBusinesstimeMall
  }
}
</script>

<style scoped>

</style>
