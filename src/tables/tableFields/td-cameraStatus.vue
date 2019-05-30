<template>
  <el-tag size="medium" :type="this.value ==='正常'?'success':'danger'">
    {{ value ==='正常'?$t('normal'):$t('offLine') }}
  </el-tag>
</template>

<script>

export default {
  props: ['value']

}
</script>

<style scoped>

</style>
