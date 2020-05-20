<template>
  <div>
    <el-row :gutter="10" class="switch">
      <el-col :xs="4" :sm="5" :md="5" :lg="5" :xl="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>设备</span>
          </div>
          <div class="list" :style="{height: height + 'px'}" v-loading="loading">
            <div class="item" :class="{active: item.id === clickedSerial}" v-for="(item, key) in switchSerials" :key="key" @click="handleSerial(item.id)">
              <i class="icon obicon obicon-switch-btn"></i>{{ item.id }}
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :xs="10" :sm="14" :md="19" :lg="19" :xl="19">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>场景</span>
          </div>
          <div class="list" :style="{height: height + 'px'}" v-loading="subloading">
            <div class="sub item" v-for="(item, key) in subSwitchList" :key="key" @click="handleEdit(item)">
              <i class="obicon obicon-edit-o edit" title="编辑" @click.prevent="handleEdit(item)"></i>
              <p><i class="obicon obicon-switch-btn"></i></p>
              <span>{{item.name}}</span>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      loading: false,
      subloading: false,
      height: 400,
      switchSerials: [],
      subSwitchList: [],
      clickedSerial: ''
    }
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
  .list .sub.item{
    display: inline-block;
    position: relative;
    width: 120px;
    padding: 20px;
    margin: 15px;
    border: 1px solid;
    border-radius: 4px;
    text-align: center;
    cursor: default;
    &:hover{
      i{
        opacity: 1;
      }
    }
    i{
      font-size: 60px;
      opacity: .6;
    }
    i.edit{
      font-size: 14px;
      position: absolute;
      right: 5px;
      top: 5px;
      padding: 5px;
      cursor: pointer;
      opacity: .6;
    }
  }
}
</style>
