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
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入房间号" v-model="search.materialNo"></el-input>
          <el-input clearable @keyup.enter.native="handleSearch" class="caption-item" placeholder="输入版本" v-model="search.versionNo"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
        <template slot="actionBar">
          <el-button type="primary" icon="obicon obicon-plus-o" @click="dialogVisible = true;">添加房间</el-button>
          <el-button type="primary" icon="obicon obicon-cloud-upload" @click="dialogVisible = true">导入房间</el-button>
        </template>
      </slot>
    </base-table>
    <el-dialog  v-if="dialogVisible" top="10%" width="660px" title="添加房间" :visible.sync="dialogVisible" :close-on-click-modal="false">
      <el-form class="ob-form" ref="room" autoComplete="on" :rules="modelRules" :model="model" label-width="80px" style="width: 90%; margin: 0 auto;">
        <el-form-item label="房间号" prop="roomNo">
          <el-input v-model="model.roomNo" placeholder="输入房间号"></el-input>
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
        <el-button @click="xiaoduVisible = false">解绑</el-button>
        <el-button type="primary" @click="handleXiaoduSubmit()">绑定</el-button>
      </span>
    </el-dialog>

    <el-drawer
      ref="drawer"
      :title="drawerTitle"
      :visible.sync="drawerVisible"
      direction="rtl"
      size="60%"
      @closed="selection = []">
        <iobox :height="300" v-if="drawerType == 1" @on-selection-change="onSelectionChange"/>
        <iwifi :height="300" v-else-if="drawerType == 2" @on-selection-change="onSelectionChange"/>
        <iscene :height="300" v-else-if="drawerType == 3" @on-selection-change="onSelectionChange"/>

        <div class="drawer-footer">
          <el-button @click="drawerVisible = false; selection = []">取 消</el-button>
          <el-button type="primary" @click="onDrawerSubmit">确 定</el-button>
        </div>
    </el-drawer>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import iobox from '../../components/Obox'
import iwifi from '../../components/WIFI'
import iscene from '../../components/Scene'
import SystemAPI from '@/api/system'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
import Helper from '@/common/helper'

export default {
  data () {
    return {
      tableLoading: false,
      tableHeight: 0,
      total: 0,
      search: {
        materialNo: '',
        versionNo: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: [],
      // 添加房间
      dialogVisible: false,
      model: {
        roomNo: '',
      },
      modelRules: {
        roomNo: [{ required: true, message: '房间号不能为空', trigger: 'blur' }]
      },
      xiaoduVisible: false,
      xiaoduModel: {
        roomNo: '',
        serialNo: ''
      },
      xiaoduRules: {
        serialNo: [{ required: true, message: '序列号不能为空', trigger: 'blur' }]
      },
      // 操作
      drawerVisible: false,
      drawerTitle: '',
      drawerId: '',
      drawerType: '',
      selection: []
    }
  },
  components: { BaseTable, iobox, iwifi, iscene },
  created () {
    this.columns = this.getColumns()
    this.getVersionList()
  },
  computed: {
    layoutHeight () {
      return this.tableHeight + 180
    },
  },
  watch: {
    dialogVisible (val) {
      if (val === false) {
        this.$refs.room.resetFields()
      }
    }
  },
  mounted () {
    Helper.windowOnResize(this, this.fixLayout)
  },
  methods: {
    fixLayout () {
      this.tableHeight = Helper.calculateTableHeight() - 20 - 10
    },
    getColumns () {
      return [{
        label: '房间号',
        prop: 'materialNo',
        align: 'center'
      }, {
        label: '版本',
        prop: 'versionNo',
        align: 'center'
      }, {
        label: '描述',
        prop: 'log',
        align: 'center'
      }, {
        label: '状态',
        prop: 'status',
        align: 'center'
      }, {
        label: '上传时间',
        prop: 'optTime',
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
      const obox = <el-button class="colors" size="tiny" icon="obicon obicon-hardware" title='绑定OBOX' onClick={() => { this.drawerVisible = true; this.drawerTitle = '绑定OBOX'; this.drawerId = row.id; this.drawerType = 1 }}></el-button>
      const wifi = <el-button class="colors" size="tiny" icon="obicon obicon-infrared" title='绑定红外' onClick={() => { this.drawerVisible = true; this.drawerTitle = '绑定红外'; this.drawerId = row.id; this.drawerType = 2 }}></el-button>
      const scene = <el-button class="colors" size="tiny" icon="obicon obicon-scene" title='绑定云端场景' onClick={() => { this.drawerVisible = true; this.drawerTitle = '绑定云端场景'; this.drawerId = row.id; this.drawerType = 3 }}></el-button>
      const xiaodu = <el-button class="colors" size="tiny" icon="obicon obicon-interaction" title='绑定小度' onClick={() => { this.xiaoduVisible = true; this.xiaoduModel.roomNo = row.id }}></el-button>
      const remove = <el-button class="colors" size="tiny" icon="obicon obicon-trash" title='删除房间' onClick={() => this.handleRemove(row)}></el-button>
      toolbox.push(obox)
      toolbox.push(wifi)
      toolbox.push(scene)
      toolbox.push(xiaodu)
      toolbox.push(remove)
      return toolbox
    },
    getVersionList () {
      this.tableLoading = true
      SystemAPI.getVersionList(this.search).then(resp => {
        if (resp.status === 0) {
          this.tableData = resp.data.firmware
          this.total = resp.total
        }
        this.tableLoading = false
      }).catch(err => {
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
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getVersionList()
    },
    handleSubmit () {
      // const that = this
      this.$refs.room.validate(valid => {
        if (valid) {
          console.log('add room')
        }
      })
    },
    handleXiaoduSubmit () {
      this.$refs.xiaodu.validate(valid => {
        if (valid) {
          console.log('add xiaodu')
        }
      })
    },
    handleRemove (row) {
      this.$confirm('确认删除该记录？', '确认提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.doRemove(row.id)
      }).catch(() => {
        console.log('cancel')
      })
    },
    doRemove (id) {
      SystemAPI.deleteVersion(id).then(resp => {
        if (resp.status === 0) {
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
    handleRelease (row) {
      console.log('release')
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
