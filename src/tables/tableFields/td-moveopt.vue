<template>
  <div>
    <button title="移动"
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
