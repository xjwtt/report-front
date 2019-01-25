<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('widget_manager')}}</span>
      </div>
      <datatable v-bind="$data">
        <slot>
          <div class="pull-right"
               style="margin:0 5px">
            <button class="btn btn-default"
                    type="button"
                    @click="newOne">
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
      <edit-page-widget ref=editDialog></edit-page-widget>
      <el-dialog title="提示"
                 :visible.sync="delDialogVisible"
                 width="30%">
        <span>确定删除{{waitToDel.length}}条内容吗？</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="delDialogVisible = false">取 消</el-button>
          <el-button type="primary"
                     @click="sureDelete">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import Vue from 'vue'
import EditPageWidget from '@/components/EditPageWidget'
import _ from 'underscore'
export default {
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      // { title: 'ID', field: 'Id', sortable: true },
      { title: 'CompanyName', field: 'companyName', sortable: true },
      { title: 'I18Key', field: 'Title', thComp: 'th-filter' },
      { title: 'Name', field: 'Title', tdComp: 'td-i18n' },
      { title: 'Sort', field: 'Sort', sortable: true },
      { title: 'Operation', tdComp: 'td-opt', visible: true }
    ],
    data: [],
    total: 0,
    query: {},
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
      await this.$store.dispatch({ type: 'widget/delWidgets', data: this.waitToDel })
      this.delDialogVisible = false
      this.handleQueryChange()
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({ type: 'widget/getAllWidget', data: { IsMobile: -1, queryOptions: this.query } })
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
    EditPageWidget
  }
}
</script>
