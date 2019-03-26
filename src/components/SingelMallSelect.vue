<template>
  <el-select v-model="dateStyle"
             filterable
             placeholder="..."
             @change="setSelectMall">
    <el-option v-for="mall in selectedMalls"
               :key="mall.Id"
               :label="mall.Name"
               :value="mall.Id">
    </el-option>
  </el-select>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data: () => ({
    dateStyle: null
  }),
  methods: {
    ...mapMutations('app', ['setSelectMall'])
  },
  computed: {
    ...mapState('app', {
      selectedMall: state => state.selectedMall,
      selectedMalls: state => state.selectedMalls
    })
  },
  created () {
    this.dateStyle = this.selectedMall.Id
  },
  activated () {
    this.dateStyle = this.selectedMall.Id
  }
}
</script>
