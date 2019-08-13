<template>
  <div style="margin-top: 3px">
    <span>{{ $t('date_range') }}：</span>
    <el-date-picker v-model="dateRangeValue"
                    type="daterange"
                    :placeholder="$t('selection_date')"
                    :range-separator="' - '"
                    @change="setPeakTimeDateRange"
                    :editable="false"
                    :clearable="false"
                    style="width:220px;"
                    size="small"
                    :picker-options="weekMonthPickerOptions">
    </el-date-picker>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data: () => ({
    dateRangeValue: null
  }),
  computed: {
    ...mapState('app', {
      peakTimeDateRange: state => state.peakTimeDateRange,
      weekMonthPickerOptions: state => state.weekMonthPickerOptions
    })
  },
  methods: {
    ...mapMutations('app', ['setPeakTimeDateRange'])
  },
  created () {
    this.dateRangeValue = this.peakTimeDateRange
  },
  activated () {
    this.dateRangeValue = this.peakTimeDateRange
  }
}
</script>
