<template>
  <div>
    <button :title="$t('site')"
            @click="xprops.eventbus.$emit('RelatedMall',row)">
      <i class="el-icon-setting"></i>
    </button>
    <button :title="$t('edit')"
            @click="xprops.eventbus.$emit('EDIT',row)">
      <i class="el-icon-edit"></i>
    </button>
    <button :title="$t('reset_password')"
            @click="xprops.eventbus.$emit('ResetPassword',row)">
      <i class="el-icon-edit-outline"></i>
    </button>
    <button :title="$t('deblocking')"
            @click="xprops.eventbus.$emit('Deblocking',row)">
      <i class="el-icon-circle-check-outline"></i>
    </button>
    <button :title="$t('delete')"
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
