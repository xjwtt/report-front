<template>
  <div>
    <button title="案场"
            @click="xprops.eventbus.$emit('RelatedMall',row)">
      <i class="el-icon-setting"></i>
    </button>
    <button title="编辑"
            @click="xprops.eventbus.$emit('EDIT',row)">
      <i class="el-icon-edit"></i>
    </button>
    <button title="删除"
            @click="xprops.eventbus.$emit('DELETE',row)">
      <i class="el-icon-delete"></i>
    </button>
  </div>
</template>
<script>
export default {
  props: ['row', 'xprops']
}
</script>
