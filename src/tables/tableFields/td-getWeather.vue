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
          return this.$t('acquire')
        case -1:
          return this.$t('not_acquire')
      }
    }
  }

}
</script>

<style scoped>

</style>
