<template>
  <div class="page">
    <div class="header">
      <div class="left">
        <div class="logoDiv">
          <img :src="showLogo&&showLogo.indexOf('data:')>=0?showLogo:defaultShowLogo">
          <!--<img  src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFoAAAAsCAYAAADl06/eAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyNpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjRDQzI4QzMxRDNGRTExRTc5N0E5QzU2ODRERjBEOUE3IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjRDQzI4QzMyRDNGRTExRTc5N0E5QzU2ODRERjBEOUE3Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6N0Q1NzFEQkVEM0REMTFFNzk3QTlDNTY4NERGMEQ5QTciIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NENDMjhDMzBEM0ZFMTFFNzk3QTlDNTY4NERGMEQ5QTciLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7SH+eUAAAIGElEQVR42uxbfWxU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">-->
        </div>
        <nav-menu :menus="menus"></nav-menu>
      </div>
      <div>
        <span class="site-region"
              @click="SiteRegionShow=!SiteRegionShow">{{selectedMalls.length}}/{{malls.length}}{{$t('sites')}}
          <i :class="{'el-icon-arrow-down': !SiteRegionShow, 'el-icon-arrow-up': SiteRegionShow }"></i>
        </span>
        <el-dialog :visible.sync="SiteRegionShow">
          <el-transfer filterable
                       :filter-method="filterMethod"
                       filter-placeholder="..."
                       v-model="selectMallsValue"
                       @change="selectedMallsChange"
                       :data="malls"
                       :props="{ key: 'Id', label: 'Name', disable: false }"
                       :titles="[$t('未选中'),$t('已选中')]">

          </el-transfer>

        </el-dialog>
        <el-dropdown class="user"
                     trigger="click"
                     @command="handleCommand">
          <span class="el-dropdown-link">
            {{userName}}
            <i class="el-icon-arrow-down el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">{{$t('log_off')}}</el-dropdown-item>
            <el-dropdown-item command="modifyPassword">{{$t('modify_password')}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

    </div>
    <div class="content">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import {mapState, mapMutations} from 'vuex'
import NavMenu from '../components/NavMenu'
import _ from 'underscore'

const iretailerLogo = () => {
  return 'data:image/png;base64,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N////5n/AP8A/wH/AP8A/wD/df9Y/wD/AP8A/wD/AP/C/67/AP8h/57/Kv8A/1f///9k/wD/AP8C/xP/D/8M/wn/AP8r/xT/Gv8a/zD/Ev8O/wD/Kv8i/wD/Gf8y/wL/I/8n/w//Df8P/yr/Fv8Q/wz/Df8R/zT/Av8m/yD/EP8D/wb/E/8A/xj/D/8M/xP/Lf8T/wf/gP8b/xX/I/8H/yv/I/8u/wUA/wD/AP8A/wD/AP8D/zv/GP8A/wD/AP9U/2X/AP8A/wD/I/9w/w3/AP8A/zb/L/8A/0b///9P/wD/Pv/W/0n/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/Af8V/wH/AP8A/wD/AP8A/wD/AAD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/8X/5/8J/wD/AP9d////Mf8A/wD/AP8A/wD/A/8c/wT/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8AAP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/I/8t/wD/AP8A/wj/Jf8A/w3/rP9p/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wAA/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/Hf/1/6P/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AP8A/wD/AAEAAP//O1PidKoVI6cAAAAASUVORK5CYII='
}

export default {
  data () {
    return {
      defaultShowLogo: iretailerLogo(),
      selectMallsValue: null,
      SiteRegionShow: false,
      filterMethod (query, item) {
        return item.Name.indexOf(query) > -1
      }
    }
  },
  methods: {
    ...mapMutations('app', ['setSelectMalls']),
    async handleCommand (command) {
      if (command === 'logout') {
        await this.$store.dispatch({
          type: 'app/logout'
        })
      }
    },
    selectedMallsChange () {
      this.setSelectMalls(this.selectMallsValue)
    }
  },
  computed: {
    ...mapState('app', {
      showLogo: state => state.showLogo,
      userName: state => state.userName,
      menus: state => state.menus,
      malls: state => state.malls,
      selectedMalls: state => state.selectedMalls
    })
  },
  components: {
    NavMenu
  },
  created () {
    this.selectMallsValue = _.map(this.selectedMalls, _ => _.Id)
  },
  activated () {
    this.selectMallsValue = _.map(this.selectedMalls, _ => _.Id)
  }
}
</script>

<style>
  .page {
    min-width: 1024px;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .page > .header {
    flex: 60px 0 0;
    background-color: #324157;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .page > .header > .left {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .page > .header .title {
    padding-left: 15px;
    padding-right: 15px;
    color: white;
    font-weight: 700;
    font-size: 20px;
  }

  .page > .content {
    flex: auto;
    display: flex;
    flex-direction: column;
  }

  .report-page {
    padding: 15px 15px;
    flex: 1 1 auto;
    display: flex;
    flex-direction: column;
  }

  .report-page-card {
    margin: 10px;
    padding: 15px 30px;
    flex: 0 0 auto;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 3px;
    box-shadow: 0 0 5px #ccc;
  }

  .config-page {
    padding: 10px;
    flex-direction: column;
  }
  .config-page > .title {
    display: flex;
    flex-flow: row-reverse;
  }

  .logoDiv {
    margin-left: 10px;
    margin-right: 10px;
  }

  .logoImage {
    height: 40px;
    width: 120px
  }
</style>
