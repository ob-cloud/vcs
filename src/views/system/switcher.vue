<template>
  <el-row :gutter="10" class="switch">
    <el-col :xs="4" :sm="5" :md="5" :lg="5" :xl="5">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>开关序列号</span>
          <el-button style="float: right; padding: 3px 0" icon="obicon obicon-refresh" title="刷新"></el-button>
        </div>
        <div class="list" :style="{height: height + 'px'}">
          <div class="item" v-for="(item, key) in switchSerials" :key="key" >
            <i class="icon obicon obicon-switch-btn"></i>{{ item.id }}
          </div>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="10" :sm="14" :md="19" :lg="19" :xl="19">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>灯开关子健</span>
          <el-button style="float: right; padding: 3px 0" icon="obicon obicon-refresh" title="刷新"></el-button>
        </div>
        <div class="list" :style="{height: height + 'px'}">

        </div>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import Helper from '@/common/helper'
export default {
  data () {
    return {
      height: 400,
      switchSerials: [{
        id: '3k134ad1vs311'
      }, {
        id: 'a3k34ad1vs311'
      }, {
        id: 'b5as14ad1vs311'
      }, {
        id: 'b5as14ad1vs311'
      }]
    }
  },
  mounted () {
    Helper.windowOnResize(this, () => {
      const winH = document.body.clientHeight
      const navH = 50
      this.height = winH - navH - (20 * 2) - 58 - 5
    })
  },
}
</script>

<style lang="scss" scoped>
.switch{
  margin: 20px 10px!important;

  .icon{
    font-size: 30px;
    color: #8FC1FE;
    margin-right: 5px;
    vertical-align: sub;
  }

  .list{
    padding: 20px;
    overflow-y: auto;
  }
  .list .item{
    font-size: 14px;
    padding: 10px;
    margin: 5px 0;
    transition: all .2s;
    cursor: pointer;
  }
}
</style>
<style lang="scss">
  .switch .el-card__body{
    padding: 0;
  }
</style>
