<template>
  <div class="config-page">
    <el-card class="box-card" style="flex:auto">
      <div slot="header" class="clearfix">
        <span>{{$t('tagtype_manager')}}</span>
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
      <edit-tag-type ref="editDialog" @handleQueryChange="handleQueryChange"></edit-tag-type>
      <related-tag-type-mall ref="RelatedBusinesstimeMall"
                             @handleQueryChange="handleQueryChange"></related-tag-type-mall>
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
import _ from 'underscore'
import EditTagType from '@/components/EditTagType'
import RelatedTagTypeMall from '@/components/RelatedTagTypeMall'

export default {
  name: 'tagtype_manager',
  data: () => ({
    // table
    HeaderSettings: false,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'company_name', field: 'CompanyName', thComp: 'th-filter', sortable: true},
      {title: 'name', field: 'Name', thComp: 'th-i18n', sortable: true, tdComp: 'td-i18n'},
      {title: 'site_count', field: 'SiteCount', thComp: 'th-i18n', sortable: true},
      {title: 'description', field: 'Description', thComp: 'th-i18n'},
      {title: 'rand', field: 'Ranked', thComp: 'th-i18n'},
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
      .$on('DELETE', this.del)
      .$on('RelatedMall', this.$refs.RelatedBusinesstimeMall.show)
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
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'tagtype/gridTagType', data: this.query})
      this.total = rep.total
      this.data = rep.list
    },
    async sureDelete () {
      await this.$store.dispatch({type: 'tagtype/deleteTagType', data: this.waitToDel})
      this.delDialogVisible = false
      this.handleQueryChange()
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
    EditTagType,
    RelatedTagTypeMall
  }
}
</script>

<style scoped>

</style>
