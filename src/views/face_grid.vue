<template>
  <div class="report-page">
    <div class="report-page-card">
      <single-mall-select ref="mallSelect"></single-mall-select>
      <date-range-picker></date-range-picker>
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
import {mapState} from 'vuex'
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
        {title: 'date_time', field: 'DateTime', thComp: 'th-i18n', sortable: true},
        {title: 'age_type', field: 'AgeType', thComp: 'th-i18n'},
        {title: 'gender', field: 'Gender', thComp: 'th-i18n', tdComp: 'td-gender'},
        {title: 'photo', field: 'ImageUrl', thComp: 'th-i18n', tdComp: 'td-image'}
      ],
      data: [],
      total: 0,
      query: {'time_': 0},
      xprops: {
        eventbus: new Vue()
      }
    }
  },
  computed: {
    ...mapState('app', {
      dateRange: state => state.dateRange
    })
  },
  methods: {
    async onQuery () {
      this.query['MallId'] = this.$refs.mallSelect.mallId
      this.query['StartDate'] = moment(this.dateRange[0]).format('YYYY-MM-DD')
      this.query['EndDate'] = moment(this.dateRange[1]).format('YYYY-MM-DD')
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
    Vue.set(this.query, 'offset', 0)
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
