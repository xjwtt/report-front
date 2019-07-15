<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('physical_manager')}}</span>
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
      <edit-physical ref=editDialog @handleQueryChange="handleQueryChange"></edit-physical>
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
import EditPhysical from '@/components/EditPhysical'
import _ from 'underscore'

export default {
  name: 'physical_manager',
  data: () => ({
    // table
    HeaderSettings: false,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
      {title: 'physical_name', field: 'Name', thComp: 'th-filter', sortable: true},
      {title: 'I18Key', field: 'ZoneTypeName', thComp: 'th-filter', sortable: true},
      {title: 'zone_type_name', field: 'ZoneTypeName', thComp: 'th-i18n', tdComp: 'td-i18n'},
      {title: 'ranked', field: 'Ranked', thComp: 'th-i18n', sortable: true},
      {title: 'status', field: 'Enabled', thComp: 'th-i18n', sortable: true, tdComp: 'td-status'},
      {title: 'operation', tdComp: 'td-opt', thComp: 'th-i18n', visible: true}
    ],
    data: [],
    total: 0,
    query: {'time_': 0, Enabled: 1},
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
      await this.$store.dispatch({type: 'physical/deletPhysical', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
    },
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'physical/gridPhysicalZone', data: this.query})
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
    this.query['time_'] = (new Date()).getTime()
  },
  components: {
    EditPhysical
  }
}
</script>

<style scoped>

</style>
