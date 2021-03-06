<template>
  <div>
    <el-row :gutter="10" class="switch">
      <el-col :xs="4" :sm="6" :md="6" :lg="6" :xl="6">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>开关序列号</span>
            <el-button style="float: right; padding: 3px 0" icon="obicon obicon-refresh" title="刷新" @click="refreshSerialIds()"></el-button>
          </div>

          <div class="list tree" :style="{height: (height) + 'px'}" v-loading="loading">
            <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
            <el-tree :data="treeData" :props="defaultProps" @node-click="handleNodeClick" :filter-node-method="filterNode" ref="tree" :style="{height: (height - 46) + 'px'}">
              <span class="custom-tree-node" slot-scope="{ data }">
                <span>{{ data.room ? `Room-${data.room}` : `${data.name} - ${data.serialId}` }}</span>
              </span>
            </el-tree>
            <!-- <div class="item" :class="{active: item.serialId === clickedSerial}" :title="`${item.deviceName}_${item.serialId}`" v-for="(item, key) in switchSerials" :key="key" @click="handleSerial(item.serialId)">
              <i class="icon obicon obicon-switch-btn"></i>{{ `${item.deviceName}_${item.serialId}` }}
            </div> -->
          </div>
        </el-card>
      </el-col>
      <el-col :xs="10" :sm="14" :md="18" :lg="18" :xl="18">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>开关子健</span>
            <el-button style="float: right; padding: 3px 0" icon="obicon obicon-refresh" title="刷新" @click="refreshSubSwitchList()"></el-button>
          </div>
          <div class="list" :style="{height: height + 'px'}" v-loading="subloading">
            <div class="sub item" v-for="(item, key) in subSwitchList" :key="key" @click="handleEdit(item)" :title="`${item.name} - ${item.serialId}`">
              <i class="obicon obicon-edit-o edit" title="编辑" @click.prevent="handleEdit(item)"></i>
              <p><i class="obicon obicon-switch-btn"></i></p>
              <span>{{`${item.name} - ${item.serialId}`}}</span>
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
import SystemAPI from '@/api/system'
import Helper from '@/common/helper'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
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
        id: '',
        name: '',
        serialId: ''
      },
      editRules: {
        name: [{ required: true, trigger: 'blur', message: '名称不能为空' }]
      },
      treeData: [],
      defaultProps: {
        children: 'scokets',
        label: 'name'
      },
      filterText: '',
      pageNo: PAGINATION_PAGENO,
      pageSize: PAGINATION_PAGESIZE * 1000,
      total: 0,
      totalPage: 0
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  mounted () {
    // this.getSerialIds()
    this.getSerialIdsTree()
    Helper.windowOnResize(this, () => {
      const winH = document.body.clientHeight
      const navH = 50
      this.height = winH - navH - (20 * 2) - 58 - 5
    })
  },
  methods: {
    loadSerial () {
      if (this.pageNo + 1 > this.totalPage) return
      this.pageNo = this.pageNo + 1
      this.getSwitchSerials()
    },
    getSerialIdsTree () {
      this.loading = true
      SystemAPI.getSwitchSerialsTree().then(res => {
        this.loading = false
        if (res.status === 200) {
          this.treeData = res.data.Locations
        }
      })
    },
    getSerialIds () {
      this.loading = true
      SystemAPI.getSwitchSerials(this.pageNo, this.pageSize).then(res => {
        this.loading = false
        if (res.status === 200) {
          this.switchSerials = res.data.devices
          // this.switchSerials.concat(res.data.devices)
          // this.total = res.total
          // this.totalPage = Math.ceil(this.total / this.pageSize)
        }
      })
    },
    refreshSerialIds () {
      this.pageNo = 1
      this.getSerialIdsTree()
    },
    getSubSwitchsBySerialId (serialId) {
      this.subloading = true
      SystemAPI.getSubSwitch(serialId).then(res => {
        this.subloading = false
        if (res.status === 200) {
          this.subSwitchList = res.data.sockets
        }
      })
    },
    refreshSubSwitchList () {
      this.clickedSerial && this.getSubSwitchsBySerialId(this.clickedSerial)
    },
    filterNode (value, data) {
      if (!value) return true
      let label = data.room ? `Room-${data.room}` : `${data.name} - ${data.serialId}`
      label = label.toLowerCase()
      return label.indexOf(value.toLowerCase()) !== -1
    },
    handleNodeClick (data) {
      console.log(data)
      if (data.room) return this.$message({type: 'warning', message: '请选择开关'})
      this.clickedSerial = data.serialId
      this.getSubSwitchsBySerialId(data.serialId)
    },
    handleSerial (serialId) {
      this.clickedSerial = serialId
      this.getSubSwitchsBySerialId(serialId)
    },
    handleEdit (item) {
      this.dialogVisible = true
      this.model.name = item.name
      this.model.id = item.id
      this.model.serialId = item.serialId
    },
    rename () {
      this.$refs.edit.validate(valid => {
        SystemAPI.editSubSwitch(this.model.id, this.model.serialId, this.model.name).then(res => {
          if (res.status === 200) {
            this.$message({
              type: 'success',
              message: '编辑成功'
            })
            this.dialogVisible = false
            this.refreshSubSwitchList()
          } else {
            this.$message({
              type: 'error',
              message: '编辑失败'
            })
          }
        })
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
  .list.tree{
    overflow: hidden;
    padding: 20px 4px;
  }
  .list.tree .el-tree{
    overflow-y: auto;
    padding: 20px 0;
  }
  .list .item{
    font-size: 14px;
    padding: 10px;
    margin: 5px 0;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
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

.list.tree .el-tree{
  .el-tree-node__content{
    font-size: 14px;
    padding: 16px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    transition: all .2s;
    cursor: pointer;
  }
}
</style>
