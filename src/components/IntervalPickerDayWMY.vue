<template>
  <div class="intervalPicker">
    <span>{{ $t('time_interval') }}：</span>
    <el-radio-group v-model="dateStyle"
                    style="vertical-align: middle;"
                    @change="this.setDayWMY"
                    size="mini">
      <el-radio-button v-for="item in dayWMYS"
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
    ...mapMutations('app', ['setDayWMY'])
  },
  computed: {
    ...mapState('app', {
      dayWMY: state => state.dayWMY,
      dayWMYS: state => state.dayWMYS
    })
  },
  created () {
    this.dateStyle = this.dayWMY.key
  },
  activated () {
    this.dateStyle = this.dayWMY.key
  }
}
</script>

<style scoped>
  .intervalPicker {
    margin-top: 5px;
  }
</style>
