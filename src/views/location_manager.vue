<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('location_manager')}}</span>
      </div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-tree :data="locationTree" :props="defaultProps" @node-click="handleNodeClick"
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

      <edit-location ref=editDialog @handleQueryChange="handleQueryChange"
                     @loadLocationTree="loadLocationTree"></edit-location>
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
import EditLocation from '@/components/EditLocation'
import _ from 'underscore'

export default {
  name: 'location_manager',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'Name', field: 'Name', sortable: true},
      {title: '天气情况', field: 'GetWeather', tdComp: 'td-getWeather'},
      {title: '次序', field: 'Ranked', sortable: true},
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
    locationTree: [],
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
      let newData = {ParentId: this.handleId, Name: '', Ranked: 0, GetWeather: 1}
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
      await this.$store.dispatch({type: 'location/deleteLocation', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
      this.loadLocationTree()
    },
    async loadLocationTree () {
      let rep = await this.$store.dispatch({type: 'location/locationTree'})
      this.locationTree = rep
    },
    async handleQueryChange (parentId) {
      this.query['parentId'] = this.handleId
      let rep = await this.$store.dispatch({type: 'location/gridLocation', data: this.query})
      this.total = rep.total
      this.data = rep.list
    }
  },
  watch: {
    query: {
      handler () {
        this.loadLocationTree()
        this.handleQueryChange()
      },
      deep: true
    }
  },
  components: {
    EditLocation
  }
}
</script>

<style scoped>

</style>
