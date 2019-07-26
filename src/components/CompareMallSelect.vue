<template>
  <el-row :gutter="20">
    <el-col :span="6">
      <span>{{$t('select_site')}}:</span>
      <el-select v-model="mallId"
                 filterable
                 placeholder="...">
        <el-option v-for="mall in selectedMalls"
                   :key="mall.Id"
                   :label="mall.Name"
                   :value="mall.Id">
        </el-option>
      </el-select>
    </el-col>
    <el-col :span="6">
      <span>{{$t('contrast_site')}}:</span>
      <el-select v-model="compareMallId"
                 filterable
                 placeholder="...">
        <el-option v-for="mall in selectedMalls"
                   :key="mall.Id"
                   :label="mall.Name"
                   :value="mall.Id">
        </el-option>
      </el-select>
    </el-col>
  </el-row>

</template>

<script>
import {mapState, mapMutations} from 'vuex'

export default {
  data: () => ({
    mallId: '',
    compareMallId: ''
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
    this.mallId = this.selectedMall.Id
    this.compareMallId = this.selectedMall.Id
  },
  activated () {
    this.mallId = this.selectedMall.Id
    this.compareMallId = this.selectedMall.Id
  }
}
</script>
