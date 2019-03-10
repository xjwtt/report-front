<template>
  <span>{{$t(show)}}</span>
</template>

<script>
export default {
  props: ['value'],
  computed: {
    show () {
      switch (this.value) {
        case 1:
          return this.$t('lock')
        default:
          return this.$t('not')
      }
    }
  }

}
</script>

<style scoped>

</style>
