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
      {title: 'mall_name', field: 'MallName', thComp: 'th-filter', sortable: true},
      {title: 'time_type_name', field: 'TimeTypeName', thComp: 'th-i18n', sortable: true, tdComp: 'td-i18n'},
      {title: 'start_date', field: 'StartDate', thComp: 'th-i18n', sortable: true},
      {title: 'start_time', field: 'StartTime', thComp: 'th-i18n', sortable: true},
      {title: 'end_date', field: 'EndDate', thComp: 'th-i18n', sortable: true},
      {title: 'end_time', field: 'EndTime', thComp: 'th-i18n', sortable: true},
      {title: 'weekdays', field: 'Weekdays', thComp: 'th-i18n', tdComp: 'td-weekdays'},
      {title: 'description', field: 'BusinessDescription', thComp: 'th-i18n'}
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
