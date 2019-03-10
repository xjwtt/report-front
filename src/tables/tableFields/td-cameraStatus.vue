<template>
  <el-tag size="medium" :type="show ===1?'success':'danger'">
    {{ show ===1?$t('正常'):$t('断线') }}
  </el-tag>
</template>

<script>
import moment from 'moment'

export default {
  props: ['value'],
  computed: {
    show () {
      let deviceTime = moment(this.value)
      let now = moment()
      if (now.diff(deviceTime, 'minute') > 30) {
        return -1
      } else {
        return 1
      }
    }
  }

}
</script>

<style scoped>

</style>
