<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('user_manager')}}</span>
      </div>
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
      <edit-user ref=editDialog @handleQueryChange="handleQueryChange"></edit-user>
      <related-user-mall ref=RelatedUserMall @handleQueryChange="handleQueryChange"></related-user-mall>
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
import EditUser from '@/components/EditUser'
import RelatedUserMall from '@/components/RelatedUserMall'
import _ from 'underscore'

export default {
  name: 'user_manager',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'user_code', field: 'UserCode', thComp: 'th-filter', sortable: true},
      {title: 'user_name', field: 'Name', thComp: 'th-filter', sortable: true},
      {title: 'role_name', field: 'RoleName', thComp: 'th-filter', sortable: true},
      {title: 'user_email', field: 'Email'},
      {title: 'mall_number', field: 'MallNumber'},
      {title: 'language', field: 'Language'},
      {title: 'is_lock', field: 'IsLock', sortable: true, tdComp: 'td-lock'},
      {title: 'lock_time', field: 'LockTime', sortable: true},
      {title: 'Operation', tdComp: 'td-userOpt', visible: true}
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
      .$on('RelatedMall', this.$refs.RelatedUserMall.show)
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
      await this.$store.dispatch({type: 'user/deleteUser', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'user/gridUser', data: this.query})
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
    EditUser,
    RelatedUserMall
  }
}
</script>

<style scoped>

</style>
