<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select ref="mallSelect"></singel-mall-select>
      <div style="margin-top: 5px">
        <span>{{ $t('date_range') }}：</span>
        <el-date-picker v-model="dateRangeValue"
                        type="daterange"
                        :placeholder="$t('selection_date')"
                        :range-separator="' - '"
                        :editable="false"
                        :clearable="false"
                        style="width:220px;"
                        size="small">
        </el-date-picker>
      </div>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
    <div class="report-page-card">
      <datatable v-bind="$data">
      </datatable>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import Vue from 'vue'

export default {
  data () {
    return {
      // table
      HeaderSettings: false,
      tblClass: 'table-bordered',
      tblStyle: 'color: #666',
      columns: [
        {title: 'DateTime', field: 'DateTime', thComp: 'th-i18n', sortable: true},
        {title: 'AgeType', field: 'AgeType', thComp: 'th-filter'},
        {title: 'Gender', field: 'Gender', thComp: 'th-filter', tdComp: 'td-gender'},
        {title: 'Image', field: 'Image', tdComp: 'td-image'}
      ],
      data: [],
      total: 0,
      query: {'time_': 0},
      xprops: {
        eventbus: new Vue()
      },
      // date
      dateRangeValue: [moment(), moment()]
    }
  },
  computed: {},
  methods: {
    async onQuery () {
      this.query['MallId'] = this.$refs.mallSelect.mallId
      this.query['StartDate'] = moment(this.dateRangeValue[0]).format('YYYY-MM-DD')
      this.query['EndDate'] = moment(this.dateRangeValue[1]).format('YYYY-MM-DD')
      let rep = await this.$store.dispatch({type: 'face/faceGrid', data: this.query})
      this.total = rep.total
      this.data = rep.list
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
  },
  activated () {
    // time_保证每次进入页面都会获取最新数据 防止数据修改页面没有拿到最新数据
    this.query['time_'] = (new Date()).getTime()
  }
}
</script>

<style scoped>
  .wraper {
    margin: 0px auto;
    width: 100%;
    overflow: auto;
  }
</style>
