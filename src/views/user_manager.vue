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
      <edit-user ref=editDialog @handleQueryChange="handleQueryChange"></edit-user>
      <related-user-mall ref=RelatedUserMall @handleQueryChange="handleQueryChange"></related-user-mall>
      <reset-password ref=resetPassword @handleQueryChange="handleQueryChange"></reset-password>
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
      <el-dialog :title="$t('prompt')"
                 :visible.sync="deblockingDialogVisible"
                 width="30%">
        <span>{{deblockingMessage}}</span>
        <span slot="footer"
              class="dialog-footer">
          <el-button @click="deblockingDialogVisible = false">{{$t('cancel')}}</el-button>
          <el-button type="primary"
                     @click="sureDeblocking">{{$t('ok')}}</el-button>
        </span>
      </el-dialog>
    </el-card>

  </div>
</template>

<script>
import Vue from 'vue'
import EditUser from '@/components/EditUser'
import ResetPassword from '@/components/ResetPassword'
import RelatedUserMall from '@/components/RelatedUserMall'
import _ from 'underscore'

export default {
  data: () => ({
    // table
    HeaderSettings: false,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'company_name', field: 'CompanyName', thComp: 'th-filter', sortable: true},
      {title: 'user_code', field: 'UserCode', thComp: 'th-filter', sortable: true},
      {title: 'user_name', field: 'Name', thComp: 'th-filter', sortable: true},
      {title: 'role_name', field: 'RoleName', thComp: 'th-filter', sortable: true},
      {title: 'mall_number', field: 'MallNumber', thComp: 'th-i18n'},
      {title: 'language', field: 'Language', thComp: 'th-i18n', tdComp: 'td-i18n'},
      {title: 'user_email', field: 'Email', thComp: 'th-i18n'},
      {title: 'is_lock', field: 'IsLock', sortable: true, thComp: 'th-i18n', tdComp: 'td-lock'},
      {title: 'operation', tdComp: 'td-userOpt', thComp: 'th-i18n', visible: true}
    ],
    data: [],
    total: 0,
    query: {'time_': 0},
    selection: [],
    xprops: {
      eventbus: new Vue()
    },
    deblockingDialogVisible: false,
    deblockingMessage: '',
    deblockingRow: null,
    delDialogVisible: false,

    waitToDel: []
  }),
  mounted () {
    this.xprops.eventbus
      .$on('EDIT', this.$refs.editDialog.show)
      .$on('RelatedMall', this.$refs.RelatedUserMall.show)
      .$on('DELETE', this.del)
      .$on('Deblocking', this.deblocking)
      .$on('ResetPassword', this.$refs.resetPassword.show)
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
    deblocking (row) {
      this.deblockingMessage = '[ ' + row.UserCode + ' ] ' + this.$t('unlock') + ' ?'
      this.deblockingRow = row
      this.deblockingDialogVisible = true
    },
    async sureDeblocking () {
      if (this.deblockingRow) {
        await this.$store.dispatch({type: 'user/unlock', data: {Id: this.deblockingRow.Id}})
        this.deblockingDialogVisible = false
        this.handleQueryChange()
        this.$message.success(this.$t('success'))
      } else {
        this.$message.error(this.$t('please_select_an_unlocked_user'))
        this.deblockingDialogVisible = false
      }
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
    EditUser,
    RelatedUserMall,
    ResetPassword
  }
}
</script>

<style scoped>

</style>
