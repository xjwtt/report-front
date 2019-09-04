<template>
  <div>
    <button :title="$t('upload')"
            @click="xprops.eventbus.$emit('Upload',row)">
      <i class="el-icon-upload"></i>
    </button>
  </div>
</template>
<script>
export default {
  props: ['row', 'xprops']
}
</script>
