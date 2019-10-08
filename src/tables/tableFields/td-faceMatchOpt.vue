<template>
  <div>
    <button :title="$t('view_details')"
            @click="xprops.eventbus.$emit('FaceMatchDetail',row)">
      <i class="el-icon-tickets"></i>
    </button>
  </div>
</template>
<script>
import Button from '../../lib/vue-bigdata-table/components/button'

export default {
  components: {Button},
  props: ['row', 'xprops']
}
</script>
