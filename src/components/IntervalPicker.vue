<template>
  <div class="intervalPicker">
    <span>{{ $t('time_interval') }}：</span>
    <el-radio-group v-model="dateStyle"
                    style="vertical-align: middle;"
                    @change="this.setTimeInterval"
                    size="mini">
      <el-radio-button v-for="item in timeIntervals"
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
    ...mapMutations('app', ['setTimeInterval'])
  },
  computed: {
    ...mapState('app', {
      timeInterval: state => state.timeInterval,
      timeIntervals: state => state.timeIntervals
    })
  },
  created () {
    this.dateStyle = this.timeInterval.key
  },
  activated () {
    this.dateStyle = this.timeInterval.key
  }
}
</script>
<style>
  .intervalPicker {
    margin-top: 5px;
  }
</style>
