<template>
  <el-tag size="medium" :type="type">
    {{ show}}
  </el-tag>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    show () {
      switch (this.value) {
        case 1:
          return this.$t('normal')
        case 0:
          return this.$t('pause')
        case -1:
          return this.$t('pause')
      }
    },
    type () {
      switch (this.value) {
        case 1:
          return 'success'
        case 0:
          return 'warning'
        case -1:
          return 'info'
      }
    }
  }

}
</script>

<style scoped>

</style>
