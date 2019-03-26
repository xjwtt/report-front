<template>
  <div class="config-page">
    <el-card class="box-card"
             style="flex:auto">
      <div slot="header"
           class="clearfix">
        <span>{{$t('businesstime_grid')}}</span>
        <datatable v-bind="$data">
          <slot>
            <div class="pull-right"
                 style="margin:0 5px">
            </div>
          </slot>
        </datatable>
      </div>
    </el-card>
  </div>
</template>

<script>
import Vue from 'vue'

export default {
  name: 'businesstime_grid',
  data: () => ({
    // table
    supportBackup: true,
    tblClass: 'table-bordered',
    tblStyle: 'color: #666',
    columns: [
      {title: 'MallName', field: 'MallName', thComp: 'th-filter', sortable: true},
      {title: 'TimeTypeName', field: 'TimeTypeName', sortable: true},
      {title: 'StartDate', field: 'StartDate', sortable: true},
      {title: 'StartTime', field: 'StartTime', sortable: true},
      {title: 'EndDate', field: 'EndDate', sortable: true},
      {title: 'EndTime', field: 'EndTime', sortable: true},
      {title: 'Weekdays', field: 'Weekdays'},
      {title: 'Description', field: 'BusinessDescription'}
    ],
    data: [],
    total: 0,
    query: {},
    selection: [],
    xprops: {
      eventbus: new Vue()
    }
  }),
  methods: {
    async handleQueryChange () {
      let rep = await this.$store.dispatch({type: 'businesstime/gridMallBusinessTime', data: this.query})
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
  }
}
</script>
