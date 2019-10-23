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
    <face-match-detail ref="faceMatchDetail" :startDate=startDate :endDate=endDate></face-match-detail>
  </div>
</template>

<script>
import FaceMatchDetail from '../components/FaceMatchDetail'
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
        {title: 'date_time', field: 'DateTime', thComp: 'th-i18n'},
        {title: 'age_type', field: 'AgeType', thComp: 'th-i18n'},
        {title: 'gender', field: 'Gender', thComp: 'th-i18n', tdComp: 'td-gender'},
        {title: 'photo', field: 'ImageUrl', thComp: 'th-i18n', tdComp: 'td-image'},
        {title: 'number', field: 'Number', thComp: 'th-i18n'},
        {title: 'operation', tdComp: 'td-faceMatchOpt', thComp: 'th-i18n', visible: true}
      ],
      data: [],
      total: 0,
      query: {'time_': 0},
      xprops: {
        eventbus: new Vue()
      }
    }
  },
  mounted () {
    this.xprops.eventbus
      .$on('FaceMatchDetail', this.$refs.faceMatchDetail.show)
  },
  computed: {
    ...mapState('app', {
      dateRange: state => state.dateRange
    }),
    startDate () {
      return moment(this.dateRange[0]).format('YYYY-MM-DD')
    },
    endDate () {
      return moment(this.dateRange[1]).format('YYYY-MM-DD')
    }
  },
  methods: {
    async onQuery () {
      this.query['MallId'] = this.$refs.mallSelect.mallId
      this.query['StartDate'] = this.startDate
      this.query['EndDate'] = this.endDate
      let rep = await this.$store.dispatch({type: 'face/lastFaceGrid', data: this.query})
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
  },
  components: {
    FaceMatchDetail
  }
}
</script>

<style scoped>

</style>
