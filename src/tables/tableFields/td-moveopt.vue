<template>
  <div>
    <button :title="$t('move')"
            @click="xprops.eventbus.$emit('MOVE',row)">
      <i class="el-icon-d-arrow-right"></i>
    </button>
  </div>
</template>
<script>
export default {
  props: ['row', 'xprops']
}
</script>
