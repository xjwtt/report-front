<template>
  <el-tag size="medium" :type="this.value ===1? 'success':'info'">
    {{ value ===1?$t('acquire'):$t('not_acquire') }}
  </el-tag>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style scoped>

</style>
