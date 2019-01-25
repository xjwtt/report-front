<template>
  <div>
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
