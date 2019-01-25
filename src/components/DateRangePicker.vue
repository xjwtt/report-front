<template>
  <div>
    <span>{{ $t("date_range") }}：</span>
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
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data: () => ({
    dateRangeValue: null
  }),
  computed: {
    ...mapState('app', {
      dateRange: state => state.dateRange,
      timeInterval: state => state.timeInterval
    })
  },
  methods: {
    ...mapMutations('app', ['setDateRange'])
  },
  created () {
    this.dateRangeValue = this.dateRange
  },
  activated () {
    this.dateRangeValue = this.dateRange
  }
}
</script>
