<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('mall_manager')}}</span>
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
      <edit-mall ref=editDialog @handleQueryChange="handleQueryChange"></edit-mall>
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
import EditMall from '@/components/EditMall'
import _ from 'underscore'

export default {
  name: 'mall_manager',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'mall_name', field: 'Name', thComp: 'th-filter', sortable: true},
      {title: 'timezone', field: 'TimeZone', thComp: 'th-filter', sortable: true},
      {title: 'location', field: 'MallLocation', thComp: 'th-filter', sortable: true},
      {title: 'MallCode', field: 'MallCode', thComp: 'th-filter', sortable: true},
      {title: 'ClerkNumber', field: 'ClerkNumber', sortable: true},
      {title: 'OperationAcreage', field: 'OperationAcreage', sortable: true},
      {title: 'Ranked', field: 'Ranked', sortable: true},
      {title: 'Enabled', field: 'Enabled', sortable: true, tdComp: 'td-status'},
      {title: 'Operation', tdComp: 'td-opt', visible: true}
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
      await this.$store.dispatch({type: 'mall/delMall', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'mall/gridMall', data: this.query})
      this.total = rep.total
      this.data = rep.list
    }
  },
  watch: {
    query: {
      handler (newValue, oldValue) {
        this.handleQueryChange()
      },
      deep: true
    }
  },
  components: {
    EditMall
  }
}
</script>

<style scoped>

</style>
