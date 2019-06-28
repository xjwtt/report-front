<template>
  <span>{{weekdays}}</span>
</template>

<script>
import _ from 'underscore'

export default {
  props: ['value'],
  computed: {
    weekdays () {
      let arr = this.value ? this.value.split(',') : []
      if (arr.length > 0) {
        arr = _.map(arr, it => {
          return this.$t(it)
        })
        return arr.join(' , ')
      } else {
        return ''
      }
    }
  }
}
</script>

<style scoped>

</style>
