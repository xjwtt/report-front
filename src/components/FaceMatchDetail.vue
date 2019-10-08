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
        {title: 'photo', field: 'Image', thComp: 'th-i18n', tdComp: 'td-image'}
      ],
      data: [],
      total: 0,
      query: {'time_': 0},
      xprops: {
        eventbus: new Vue()
      },
      // --
      dialogVisible: false,
      faceMatchId: null
    }
  },
  methods: {
    show (form) {
      this.dialogVisible = true
      this.faceMatchId = form.Id
      this.onQuery()
    },
    async onQuery () {
      if (this.faceMatchId && this.startDate && this.endDate) {
        let rep = await this.$store.dispatch({
          type: 'face/faceMatchDetailGrid',
          data: {'FaceMatchId': this.faceMatchId, 'StartDate': this.startDate, 'EndDate': this.endDate}
        })
        this.total = rep.total
        this.data = rep.list
      }
    }
  }
}
</script>

<style scoped>

</style>
