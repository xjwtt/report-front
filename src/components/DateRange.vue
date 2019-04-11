<template>
  <div>
    <span>{{ $t(titleName) }}：</span>
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
</template>

<script>
import moment from 'moment'

export default {
  props: {
    titleName: {
      type: String,
      default: 'date_range'
    }
  },
  data: () => ({
    dateRangeValue: [moment(), moment()]
  })
}
</script>
