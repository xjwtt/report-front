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
          return this.$t('start_using')
        case -1:
          return this.$t('block_up')
      }
    }
  }

}
</script>

<style scoped>

</style>
