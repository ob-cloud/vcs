<template>
  <div class="device smart  ui-container">
    <base-table
      :height="tableHeight"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      :pageNo="search.pageNo"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">

      <slot>
        <template slot="caption">
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入房间号" v-model="search.room"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="primary" icon="obicon obicon-plus-o" @click="dialogVisible = true;">添加房间</el-button>
          <el-button type="primary" icon="obicon obicon-cloud-upload" @click="uploadVisible = true">导入房间</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog  v-if="dialogVisible" top="10%" width="660px" title="添加房间" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form room" ref="room" autoComplete="on" :rules="modelRules" :model="model" label-width="80px" style="width: 90%; margin: 0 auto;">
        <i class="obicon obicon-plus-o multiple" style="cursor: pointer;" @click="handlePlusRoom()"></i>
        <el-form-item label="房间号" prop="roomNo" v-for="(item, index) in model.rooms" :key="index">
          <el-input v-model="item.roomNo" placeholder="输入房间号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit()">确认</el-button>
      </span>
    </el-dialog>

    <el-dialog  v-if="xiaoduVisible" top="10%" width="660px" title="小度操作" :visible.sync="xiaoduVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="xiaodu" autoComplete="on" :rules="xiaoduRules" :model="xiaoduModel" label-width="80px" style="width: 90%; margin: 0 auto;">
        <el-form-item label="房间号" prop="roomNo">
          <el-input v-model="xiaoduModel.roomNo" readonly></el-input>
        </el-form-item>
        <el-form-item label="序列号" prop="serialNo">
          <el-input v-model="xiaoduModel.serialNo" placeholder="输入序列号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="xiaoduVisible = false">取消</el-button>
        <el-button @click="handleUnbindXiaodu()">解绑</el-button>
        <el-button type="primary" @click="handleXiaoduSubmit()">绑定</el-button>
      </span>
    </el-dialog>

    <el-dialog  v-if="uploadVisible" top="10%" width="660px" title="导入房间" :visible.sync="uploadVisible" :close-on-click-modal="false">
        <el-upload
          class="upload-container"
          drag
          :data="uploadData"
          accept=".xlsx,.xls"
          :before-upload="onBeforeUpload"
          :on-success="onUploadSuccess"
          :on-error="onUploadFail"
          action="/consumer/PmsForDur/upLoadExcel">
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">只能上传excel文件</div>
        </el-upload>
    </el-dialog>

    <el-drawer
      ref="drawer"
      :title="drawerTitle"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
      @closed="selection = []">
        <iobox :height="300" v-if="drawerType == 1" :id="drawerId" @on-selection-change="onSelectionChange"/>
        <iwifi :height="300" v-else-if="drawerType == 2" :id="drawerId" @on-selection-change="onSelectionChange"/>
        <iscene :height="300" v-else-if="drawerType == 3" :id="drawerId" @on-selection-change="onSelectionChange"/>
    </el-drawer>
    <OboxModal ref="oboxModal"></OboxModal>
    <WifiModal ref="wifiModal"></WifiModal>
    <SceneModal ref="sceneModal"></SceneModal>

    <!-- view  -->
    <el-drawer
      ref="drawer"
      title="房间设备详情"
      :visible.sync="drawerViewVisible"
      direction="btt"
      size="60%">
        <ideviceinfo></ideviceinfo>
        <!-- <div class="drawer-footer">
          <el-button @click="drawerVisible = false; selection = []">取 消</el-button>
          <el-button type="primary" @click="onDrawerSubmit">确 定</el-button>
        </div> -->
    </el-drawer>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import iobox from '../../components/Obox'
import OboxModal from '../../components/OboxModal'
import WifiModal from '../../components/WifiModal'
import SceneModal from '../../components/SceneModal'
import iwifi from '../../components/WIFI'
import iscene from '../../components/Scene'
import ideviceinfo from '../../components/DeviceInfo'
import SystemAPI from '@/api/system'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'
import {
  mapGetters
} from 'vuex'

export default {
  data () {
    const that = this
    const validateAction = (rule, value, callback) => {
      const found = that.model.rooms.find(item => !item.roomNo)
      if (found) {
        callback(new Error('房间号不能留空'))
      } else {
        callback()
      }
    }
    return {
      tableLoading: false,
      tableHeight: 0,
      total: 0,
      search: {
        // room: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      // 添加房间
      dialogVisible: false,
      model: {
        rooms: [{
          roomNo: ''
        }],
      },
      modelRules: {
        roomNo: [{ required: true, trigger: 'blur', validator: validateAction}]
      },
      xiaoduVisible: false,
      xiaoduModel: {
        roomNo: '',
        serialNo: ''
      },
      xiaoduRules: {
        serialNo: [{ required: true, message: '序列号不能为空', trigger: 'blur' }]
      },
      uploadVisible: false,
      uploadData: {
        access_token: ''
      },
      // 操作
      drawerVisible: false,
      drawerTitle: '',
      drawerId: '',
      drawerType: '',
      selection: [],
      drawerViewVisible: false
    }
  },
  components: { BaseTable, iobox, iwifi, iscene, ideviceinfo, OboxModal, WifiModal, SceneModal },
  created () {
    this.columns = this.getColumns()
    this.getVersionList()
  },
  computed: {
    layoutHeight () {
      return this.tableHeight + 180
    },
    ...mapGetters([
      'token'
    ]),
  },
  watch: {
    dialogVisible (val) {
      if (val === false) {
        this.$refs.room.resetFields()
        this.model.rooms = [{
          roomNo: ''
        }]
      }
    },
    xiaoduVisible (val) {
      if (val === false) {
        this.$refs.xiaodu.resetFields()
      }
    }
  },
  mounted () {
    this.uploadData.access_token = this.token
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 20 - 10
    },
    getColumns () {
      //   {
      //   type: 'selection',
      //   width: 80,
      //   align: 'center'
      // },
      return [{
        label: '房间号',
        prop: 'room',
        align: 'center'
      },
      // {
      //   label: '楼栋',
      //   prop: 'building',
      //   align: 'center'
      // },
      // {
      //   label: '层',
      //   prop: 'layer',
      //   align: 'center'
      // },
      {
        label: '更新时间',
        prop: 'lastOpTime',
        align: 'center',
        formatter (val) {
          return val && Helper.parseTime(val)
        }
      }, {
        label: '操作',
        prop: 'operator',
        align: 'center',
        renderBody: this.getToolboxRender
      }]
    },
    getToolboxRender (h, row) {
      const toolbox = []
      // const view = <el-button class="colors" size="tiny" icon="obicon obicon-eye" title='查看' onClick={() => { this.drawerViewVisible = true }}></el-button>
      const obox = <el-button class="colors" size="tiny" icon="obicon obicon-hardware" title='绑定OBOX' onClick={() => { this.$refs.oboxModal.show(row.location) }}></el-button>
      const wifi = <el-button class="colors" size="tiny" icon="obicon obicon-infrared" title='绑定红外' onClick={() => { this.$refs.wifiModal.show(row.location) }}></el-button>
      const scene = <el-button class="colors" size="tiny" icon="obicon obicon-scene" title='绑定云端场景' onClick={() => { this.$refs.sceneModal.show(row.location) }}></el-button>
      const xiaodu = <el-button class="colors" size="tiny" icon="obicon obicon-interaction" title='绑定小度' onClick={() => { this.xiaoduVisible = true; this.xiaoduModel.roomNo = row.room }}></el-button>
      const remove = <el-button class="colors" size="tiny" icon="obicon obicon-trash" title='删除房间' onClick={() => this.handleRemove(row)}></el-button>
      // toolbox.push(view)
      toolbox.push(obox)
      toolbox.push(wifi)
      toolbox.push(scene)
      toolbox.push(xiaodu)
      toolbox.push(remove)
      return toolbox
    },
    getVersionList () {
      this.tableLoading = true
      SystemAPI.getRoomList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.locations
          this.total = resp.total
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: '服务出错',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getVersionList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getVersionList()
    },
    onSelectionChange (row) {
      this.selection = row || []
    },
    onBeforeUpload (file) {

    },
    onUploadSuccess (response, file, fileList) {
      if (response.status === 200) {
        this.$message({
          type: 'success',
          message: '解析成功'
        })
        this.uploadVisible = false
        this.getVersionList()
      } else {
        this.$message({
          type: 'error',
          message: '解析失败'
        })
      }
    },
    onUploadFail (response, file, fileList) {
      console.log('error ', response)
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getVersionList()
    },
    handlePlusRoom () {
      this.model.rooms.push({
        roomNo: ''
      })
    },
    handleSubmit () {
      // const that = this
      this.$refs.room.validate(valid => {
        if (valid) {
          const roomList = this.model.rooms.map(item => item.roomNo)
          SystemAPI.addRoom(roomList).then(res => {
            if (res.status === 200) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.getVersionList()
              this.dialogVisible = false
            } else {
              this.$message({
                type: 'error',
                message: '添加失败'
              })
            }
          })
          console.log('add room', roomList)
        }
      })
    },
    bindXiaodu () {
      SystemAPI.bindXiaodu(this.xiaoduModel.roomNo, this.xiaoduModel.serialNo).then(res => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '绑定成功'
          })
          this.xiaoduVisible = false
        } else {
          this.$message({
            type: 'error',
            message: res.message || '绑定失败'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '服务异常'
        })
      })
    },
    unbindXiaodu () {
      SystemAPI.unbindXiaodu(this.xiaoduModel.serialNo).then(res => {
        if (res.status === 200) {
          this.$message({
            type: 'success',
            message: '解绑成功'
          })
          this.xiaoduVisible = false
        } else {
          this.$message({
            type: 'error',
            message: res.message || '解绑失败'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '服务异常'
        })
      })
    },
    handleUnbindXiaodu () {
      this.$confirm('确认解绑小度音响？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.unbindXiaodu()
      }).catch(() => {
        console.log('cancel')
      })
    },
    handleXiaoduSubmit () {
      this.$refs.xiaodu.validate(valid => {
        if (valid) {
          console.log('add xiaodu')
          this.bindXiaodu()
        }
      })
    },
    handleRemove (row) {
      this.$confirm('确认删除房间？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.delRoom(row.location)
      }).catch(() => {
        console.log('cancel')
      })
    },
    delRoom (location) {
      SystemAPI.delRoom(location).then(resp => {
        if (resp.status === 200) {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.getVersionList()
        } else {
          this.$message({
            type: 'error',
            message: '删除失败'
          })
        }
      }).catch(() => {
        this.$message({
          type: 'error',
          message: '服务异常'
        })
      })
    },
    onDrawerSubmit () {
      if (!this.selection.length) {
        this.$message({
          type: 'warning',
          message: '未选择设备'
        })
        return
      }
      // TODO http to submit binding task then close the drawer and reload the list
      // by the this.drawerType
      console.log('--- submit ', this.selection)
      this.drawerVisible = false
      // this.$refs.drawer.closeDrawer()
      // this.getVersionList()
    }
  }
}
</script>
<style lang="scss" scoped>
  .ui-container{
    margin: 20px;
    border-radius: 14px;
  }
  .drawer-footer{
    margin: 10px;
    position: absolute;
    bottom: 20px;
    right: 20px;
  }
  .upload-container{
    text-align: center;
    padding: 10px 0;

    .el-upload-dragger{
      margin: 0 auto;
    }
  }
  .ob-form.room{
    position: relative;
  }
  .multiple{
    position: absolute;
    font-size: 24px;
    right: -36px;
    top: 6px;
  }
</style>
<style lang="scss">
.icon-size-medium{
  font-size: 20px;
}
:focus{
  outline: none;
}
  // .colors{
  //   &{
  //     color: #FFFFFF!important;
  //   }
  //   &.el-button--warning {
  //     background-color: #E6A23C!important;
  //     border-color: #E6A23C!important;
  //   }
  //   &.el-button--success {
  //     background-color: #67C23A!important;
  //     border-color: #67C23A!important;
  //   }
  //   &.el-button--danger {
  //     background-color: #F56C6C!important;
  //     border-color: #F56C6C!important;
  //   }
  // }
</style>
