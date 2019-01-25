<template>
    <component :is="isRoot?'el-menu':'div'"
               :default-active="routerPath"
               mode="horizontal"
               background-color="#324157"
               text-color="#fff"
               active-text-color="#ffd04b"
               router>
        <component :is="menu.children.length>0?'el-submenu':'el-menu-item'"
                   v-for="menu in menus"
                   :key="menu.Name"
                   :index="menu.Name">
            <template v-if="menu.children.length>0">
                <template slot="title">
                    {{$t(menu.Name)}}
                </template>
                <nav-menu :menus="menu.children"
                          :isRoot=false></nav-menu>
            </template>
            <template v-else>
                {{$t(menu.Name)}}
            </template>
        </component>
    </component>
</template>

<script>
export default {
  name: 'nav-menu',
  props: {
    menus: {
      type: Array,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    routerPath () { return this.$route.path.substring(1) }
  }
}
</script>
