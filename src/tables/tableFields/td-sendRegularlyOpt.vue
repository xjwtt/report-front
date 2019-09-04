<template>
  <div>
    <button :title="$t('site')"
            @click="xprops.eventbus.$emit('RelatedSendRegularlyMall',row)">
      <i class="el-icon-setting"></i>
    </button>
    <button :title="$t('logs')"
            @click="xprops.eventbus.$emit('Logs',row)">
      <i class="el-icon-info"></i>
    </button>
    <button :title="$t('custom_upload')"
            @click="xprops.eventbus.$emit('CustomUpload',row)">
      <i class="el-icon-upload"></i>
    </button>
    <button :title="$t('edit')"
            @click="xprops.eventbus.$emit('EDIT',row)">
      <i class="el-icon-edit"></i>
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
