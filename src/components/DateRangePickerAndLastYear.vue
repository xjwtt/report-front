<template>
  <div style="margin-top: 3px">
    <div style="display: inline">
      <span>{{ $t('date_range') }}：</span>
      <el-date-picker v-model="dateRangeValue"
                      type="daterange"
                      :placeholder="$t('selection_date')"
                      :range-separator="' - '"
                      @change="setDateRange"
                      :editable="false"
                      :clearable="false"
                      style="width:220px;"
                      size="small"
                      :picker-options="timeInterval.pickerOptions">
      </el-date-picker>
    </div>
    <div style="display: inline;margin-left: 20px">
      <span>{{ $t('last_year') }}：</span>
      <el-switch
        v-model="lastYear"
        active-color="#13ce66"
        inactive-color="#ff4949">
      </el-switch>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data: () => ({
    dateRangeValue: null,
    lastYear: null
  }),
  computed: {
    ...mapState('app', {
      dateRange: state => state.dateRange,
      timeInterval: state => state.timeInterval,
      selectLastYear: state => state.selectLastYear
    })
  },
  methods: {
    ...mapMutations('app', ['setDateRange', 'setSelectLastYaer'])
  },
  watch: {
    lastYear: {
      handler (nValue) {
        this.setSelectLastYaer(nValue)
      }
    }
  },
  created () {
    this.dateRangeValue = this.dateRange
    this.lastYear = this.selectLastYear
  },
  activated () {
    this.dateRangeValue = this.dateRange
    this.lastYear = this.selectLastYear
  }
}
</script>
