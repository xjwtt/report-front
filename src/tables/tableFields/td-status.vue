<template>
  <el-tag size="medium" :type="this.value ===1? 'success':'danger'">
    {{ value ===1?$t('start_using'):$t('block_up') }}
  </el-tag>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style scoped>

</style>
