<template>
  <div>
    <el-radio v-model="reverse" :label="1">{{$t('facade')}}</el-radio>
    <el-radio v-model="reverse" :label="-1">{{$t('reverse')}}</el-radio>
  </div>
</template>

<script>
export default {
  props: ['row', 'value', 'xprops'],
  computed: {
    reverse: {
      get: function () {
        return this.value >= 0 ? 1 : -1
      },
      set: function (value) {
        this.xprops.eventbus.$emit('REVERSE', this.row, value)
      }
    }
  }
}
</script>

<style scoped>

</style>
