<template>
  <el-tag size="medium" :type="this.value ===1?'danger':'success'">
    {{ value ===1?$t('yes'):$t('not') }}
  </el-tag>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style scoped>

</style>
