<template>
  <div>
    <el-row :gutter="10" class="switch">
      <el-col :xs="4" :sm="5" :md="5" :lg="5" :xl="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>开关序列号</span>
            <el-button style="float: right; padding: 3px 0" icon="obicon obicon-refresh" title="刷新" @click="refreshSerialIds()"></el-button>
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
            <span>开关子健</span>
            <el-button style="float: right; padding: 3px 0" icon="obicon obicon-refresh" title="刷新" @click="refreshSubSwitchList()"></el-button>
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
    <el-dialog title="修改名称" width="600px" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form autoComplete="on" :rules="editRules" :model="model"  ref="edit" label-position="right" label-width="18%">
        <el-form-item label="名称:" prop="name">
          <el-input class="filter-item" placeholder="输入名称" v-model="model.name">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer text-center" >
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="loading" @click="rename()">确 认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Helper from '@/common/helper'
export default {
  data () {
    return {
      loading: false,
      subloading: false,
      height: 400,
      switchSerials: [],
      subSwitchList: [],
      clickedSerial: '',
      active: 'active',
      dialogVisible: false,
      model: {
        name: ''
      },
      editRules: {
        name: [{ required: true, trigger: 'blur', message: '名称不能为空' }]
      }
    }
  },
  mounted () {
    this.getSerialIds()
    Helper.windowOnResize(this, () => {
      const winH = document.body.clientHeight
      const navH = 50
      this.height = winH - navH - (20 * 2) - 58 - 5
    })
  },
  methods: {
    getSerialIds () {
      this.loading = true
      setTimeout(() => {
        this.switchSerials = [{
          id: '3k134ad1vs311'
        }, {
          id: 'a3k34ad1vs311'
        }, {
          id: 'b5as14ad1vs311'
        }, {
          id: 'b5as14ad1vs301'
        }]
        this.loading = false
      }, 1500)
    },
    refreshSerialIds () {
      this.getSerialIds()
    },
    getSubSwitchsBySerialId (serialId) {
      this.subloading = true
      setTimeout(() => {
        this.subSwitchList = [{
          id: 'm123445a',
          name: '开关1'
        }, {
          id: 'm123445b',
          name: '开关2'
        }, {
          id: 'm123445c',
          name: '开关3'
        }, {
          id: 'm123445d',
          name: '开关4'
        }, {
          id: 'm123445e',
          name: '开关5'
        }]
        this.subloading = false
      }, 1500)
    },
    refreshSubSwitchList () {
      this.clickedSerial && this.getSubSwitchsBySerialId(this.clickedSerial)
    },
    handleSerial (serialId) {
      this.clickedSerial = serialId
      this.getSubSwitchsBySerialId(serialId)
    },
    handleEdit (item) {
      this.dialogVisible = true
      this.model.name = item.name
    },
    rename () {
      this.$refs.edit.validate(valid => {
      })
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
<style lang="scss">
  .switch .el-card__body{
    padding: 0;
  }
</style>
