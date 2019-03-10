<template>
  <div>
    <el-radio v-model="reverse" :label="1">{{$t('正向')}}</el-radio>
    <el-radio v-model="reverse" :label="-1">{{$t('反向')}}</el-radio>
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
