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
          return 'NORMAL'
        case 0:
          return 'PAUSE'
        case -1:
          return 'DELETE'
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
