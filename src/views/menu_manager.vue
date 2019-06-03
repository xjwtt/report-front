<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('menu_manager')}}</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-tree :data="menuTree" :props="defaultProps" @node-click="handleNodeClick"
                   node-key="Id"
                   :default-expanded-keys="defaultExpandedKeys"
                   :check-on-click-node="true"></el-tree>
        </el-col>
        <el-col :span="16">
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
        </el-col>
      </el-row>

      <edit-menus ref=editDialog @handleQueryChange="handleQueryChange" @userMenuTree="userMenuTree"></edit-menus>
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
import EditMenus from '@/components/EditMenu'
import _ from 'underscore'

export default {
  name: 'menu_manager',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'Name', field: 'Name', sortable: true},
      {title: '描述', field: 'Description'},
      {title: '访问地址', field: 'PageUrl'},
      {title: '图标', field: 'ImageUrl'},
      {title: '次序', field: 'Ranked', sortable: true},
      {title: 'Status', field: 'Visible', sortable: true, tdComp: 'td-status'},
      {title: 'Operation', tdComp: 'td-opt', visible: true}
    ],
    data: [],
    total: 0,
    query: {},
    selection: [],
    xprops: {
      eventbus: new Vue()
    },

    delDialogVisible: false,
    waitToDel: [],
    // Tree
    handleId: '-',
    menuTree: [],
    defaultProps: {
      children: 'children',
      label: 'Name'
    },
    defaultExpandedKeys: []
  }),
  mounted () {
    this.xprops.eventbus
      .$on('EDIT', this.$refs.editDialog.show)
      .$on('DELETE', this.del)
  },
  methods: {
    handleNodeClick (data) {
      // console.log(data)
      this.handleId = data.Id
      this.defaultExpandedKeys[0] = data.Id
      this.handleQueryChange()
    },
    newOne () {
      let newData = {ParentId: this.handleId, Name: '', PageUrl: '', Rank: 0, Description: '', Visible: 1}
      this.$refs.editDialog.show(newData)
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
      await this.$store.dispatch({type: 'menu/deleteMenu', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
      this.userMenuTree()
    },
    async userMenuTree () {
      let rep = await this.$store.dispatch({type: 'menu/userMenuTree'})
      this.converI18n(rep)
      this.menuTree = rep
    },
    async handleQueryChange (parentId) {
      this.query['parentId'] = this.handleId
      let rep = await this.$store.dispatch({type: 'menu/gridMenu', data: this.query})
      this.total = rep.total
      this.data = rep.list
    },
    converI18n (menuTree) {
      let that = this
      _.map(menuTree, function (item) {
        item.Name = that.$t(item.Name)
        if (item.children) {
          that.converI18n(item.children)
        }
      })
    }
  },
  watch: {
    query: {
      handler () {
        this.userMenuTree()
        this.handleQueryChange()
      },
      deep: true
    }
  },
  components: {
    EditMenus
  }
}
</script>

<style scoped>

</style>
