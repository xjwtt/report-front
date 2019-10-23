<template>
  <el-dialog :title="$t('view_details')"
             v-if="dialogVisible"
             :visible.sync="dialogVisible"
             :close-on-click-modal="false"
             width="60%">
    <datatable v-bind="$data">
    </datatable>
  </el-dialog>
</template>

<script>
import Vue from 'vue'

export default {
  props: {
    startDate: {
      required: true
    },
    endDate: {
      required: true
    }
  },
  data () {
    return {
      // table
      HeaderSettings: false,
      tblClass: 'table-bordered',
      tblStyle: 'color: #666',
      columns: [
        {title: 'date_time', field: 'DateTime', thComp: 'th-i18n', sortable: true},
        {title: 'age_type', field: 'AgeType', thComp: 'th-i18n'},
        {title: 'gender', field: 'Gender', thComp: 'th-i18n', tdComp: 'td-gender'},
        {title: 'photo', field: 'ImageUrl', thComp: 'th-i18n', tdComp: 'td-image'}
      ],
      data: [],
      total: 0,
      pageSizeOptions: [5, 10, 20, 50, 100],
      query: {'time_': 0, 'limit': 5},
      xprops: {
        eventbus: new Vue()
      },
      // --
      dialogVisible: false,
      personId: null
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.personId = form.PersonId
      Vue.set(this.query, 'offset', 0)
      this.query['time_'] = (new Date()).getTime()
    },
    async onQuery () {
      if (this.personId && this.startDate && this.endDate) {
        this.query['PersonId'] = this.personId
        this.query['StartDate'] = this.startDate
        this.query['EndDate'] = this.endDate
        let rep = await this.$store.dispatch({
          type: 'face/lastFaceDetailGrid',
          data: this.query
        })
        this.total = rep.total
        this.data = rep.list
      }
    }
  },
  watch: {
    query: {
      handler (nValue) {
        if (nValue.time_ !== 0) {
          this.onQuery()
        }
      },
      deep: true
    }
  }
}
</script>

<style scoped>

</style>
