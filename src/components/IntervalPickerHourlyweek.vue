<template>
  <div class="intervalPicker">
    <span>{{ $t('time_interval') }}：</span>
    <el-radio-group v-model="dateStyle"
                    style="vertical-align: middle;"
                    @change="this.setHourlyWeek"
                    size="mini">
      <el-radio-button v-for="item in hourlyWeeks"
                       :label="item.key"
                       :key="item.key">
        {{$t(item.text)}}
      </el-radio-button>
    </el-radio-group>
  </div>

</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data: () => ({
    dateStyle: null
  }),
  methods: {
    ...mapMutations('app', ['setHourlyWeek'])
  },
  computed: {
    ...mapState('app', {
      hourlyWeek: state => state.hourlyWeek,
      hourlyWeeks: state => state.hourlyWeeks
    })
  },
  created () {
    this.dateStyle = this.hourlyWeek.key
  },
  activated () {
    this.dateStyle = this.hourlyWeek.key
  }
}
</script>
<style>
  .intervalPicker {
    margin-top: 5px;
  }
</style>
