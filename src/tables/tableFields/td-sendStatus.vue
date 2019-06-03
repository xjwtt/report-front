<template>
  <el-tag v-if="show.type!=''" size="medium" :type="show.type">
    {{show.value }}
  </el-tag>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    show () {
      switch (this.value) {
        case 1:
          return {type: 'success', value: this.$t('success')}
        case -1:
          return {type: 'danger', value: this.$t('failed')}
        default:
          return {type: '', value: ''}
      }
    }
  }
}
</script>

<style scoped>

</style>
