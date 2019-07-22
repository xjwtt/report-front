<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane :label=" $t('all_election')">
        <label slot="label">
          <el-checkbox :indeterminate="isIndeterminate"
                       v-model="checkAll" @change="handleCheckAllChange"></el-checkbox>
          {{$t('all_election')}}
        </label>
        <el-checkbox-group v-model="checkedTagTypes" @change="handleCheckedCitiesChange">
          <el-checkbox v-for="tagType in tagTypes" :label="tagType" :key="tagType.Id">
            {{tagType.Name}}
          </el-checkbox>
        </el-checkbox-group>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import {mapState} from 'vuex'

export default {
  data () {
    return {
      checkAll: false,
      checkedTagTypes: [],
      isIndeterminate: true
    }
  },
  computed: {
    ...mapState('app', {
      tagTypes: state => state.tagTypes
    })
  },
  methods: {
    handleCheckAllChange (val) {
      this.checkedTagTypes = val ? this.tagTypes : []
      this.isIndeterminate = false
    },
    handleCheckedCitiesChange (value) {
      let checkedCount = value.length
      this.checkAll = checkedCount === this.tagTypes.length
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.tagTypes.length
    }
  },
  mounted () {
    this.checkedTagTypes = this.tagTypes
  }
}
</script>

<style scoped>

</style>
