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
import EditBusinesstime from '@/components/EditBusinesstime'
import RelatedBusinesstimeMall from '@/components/RelatedBusinesstimeMall'
import _ from 'underscore'

export default {
  name: 'businesstime_manager',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'company_name', field: 'CompanyName', thComp: 'th-filter', sortable: true},
      {title: 'time_type_name', field: 'TimeTypeName', sortable: true},
      {title: 'start_date', field: 'StartDate', sortable: true},
      {title: 'start_time', field: 'StartTime', sortable: true},
      {title: 'end_date', field: 'EndDate', sortable: true},
      {title: 'end_time', field: 'EndTime', sortable: true},
      {title: 'weekdays', field: 'Weekdays'},
      {title: 'description', field: 'Description'},
      {title: 'operation', tdComp: 'td-businesstimeOpt', visible: true}
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
      .$on('RelatedMall', this.$refs.RelatedBusinesstimeMall.show)
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
      handler () {
        this.handleQueryChange()
      },
      deep: true
    }
  },
  components: {
    EditBusinesstime,
    RelatedBusinesstimeMall
  }
}
</script>

<style scoped>

</style>
