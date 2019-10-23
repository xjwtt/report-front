<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('tagtype_grid')}}</span>
      </div>
      <datatable v-bind="$data">
        <slot>
          <div class="pull-right"
               style="margin:0 5px">
          </div>
        </slot>
      </datatable>
      <edit-related-tag-type-mall ref="editDialog" @handleQueryChange="handleQueryChange"></edit-related-tag-type-mall>
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
import EditRelatedTagTypeMall from '@/components/EditRelatedTagTypeMall'

export default {
  data () {
    return {
      // table
      HeaderSettings: false,
      tblClass: 'table-bordered',
      tblStyle: 'color: #666',
      columns: [
        {title: 'company_name', field: 'CompanyName', thComp: 'th-filter', sortable: true},
        {title: 'name', field: 'Name', thComp: 'th-filter', sortable: true},
        {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
        {title: 'description', field: 'Description', thComp: 'th-i18n'},
        {title: 'operation', tdComp: 'td-opt', thComp: 'th-i18n', visible: true}
      ],
      data: [],
      total: 0,
      query: {'time_': 0},
      selection: [],
      xprops: {
        eventbus: new Vue()
      },
      delDialogVisible: false,
      waitToDel: {}
    }
  },
  mounted () {
    this.xprops.eventbus
      .$on('EDIT', this.$refs.editDialog.show)
      .$on('DELETE', this.del)
  },
  methods: {
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'tagtype/gridMallTagType', data: this.query})
      this.total = rep.total
      this.data = rep.list
    },
    del (row) {
      this.waitToDel = {'Id': row.Id, 'mallId': row.MallId}
      this.delDialogVisible = true
    },
    async sureDelete () {
      await this.$store.dispatch({type: 'tagtype/deleteTagTypeById_MallId', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
    }
  },
  activated () {
    // time_保证每次进入页面都会获取最新数据 防止数据修改页面没有拿到最新数据
    Vue.set(this.query, 'offset', 0)
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
    EditRelatedTagTypeMall
  }
}
</script>

<style scoped>

</style>
