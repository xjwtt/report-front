<template>
  <div class="report-page">
    <div class="report-page-card">
      <singel-mall-select></singel-mall-select>
      <zone-selector :zone-types="zoneTypes" ref=zoneSelector></zone-selector>
      <div>
        <span>{{ $t('date_range') }}：</span>
        <el-date-picker v-model="dateRangeValue"
                        type="daterange"
                        :placeholder="$t('selection_date')"
                        :range-separator="' - '"
                        :editable="false"
                        :clearable="false"
                        style="width:220px;"
                        size="small"
                        :picker-options="weekMonthPickerOptions">
        </el-date-picker>
      </div>
      <el-button type="primary"
                 size="small"
                 @click="onQuery">{{$t('query')}}
      </el-button>
    </div>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data: () => ({
    zoneTypes: ['Entrance', 'Domain', 'Floor', 'Corridor'],
    dateRangeValue: [moment().subtract(7, 'days'), moment().subtract(1, 'days')]
  }),
  methods: {
    onQuery () {

    }
  }
}
</script>

<style scoped>

</style>
