<template>
  <el-tag size="medium" :type="this.value ===1? 'success':''">
    {{ value ===1?$t('Male'):$t('Female') }}
  </el-tag>
</template>

<script>
export default {
  props: ['value']
}
</script>

<style scoped>

</style>
