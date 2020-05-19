<template>
  <div class="ui-container">
    <el-transfer
      class="transfer"
      v-model="transferValue"
      filterable
      :titles="['未绑定红外', '已绑定红外']"
      :button-texts="['解绑', '绑定']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      :props="{
        key: 'deviceId',
        label: 'name'
      }"
      @change="handleChange"
      :data="tableData">
    </el-transfer>
    <!-- <base-table
      :height="height"
      :tableData="tableData"
      :columns="columns"
      stripe
      v-loading="tableLoading"
      :pageTotal="total"
      :pageSize="search.pageSize"
      @selection-change="onSelectionChange"
      @on-current-page-change="onCurrentChange"
      @on-page-size-change="onSizeChange">
      <slot>
        <template slot="caption">
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备序列号" v-model="search.obox_serial_id"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备类型" v-model="search.device_type"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="设备名称" v-model="search.name"></el-input>
          <el-select clearable class="caption-item" placeholder="全部状态" v-model="search.online">
            <el-option label='全部状态' value=''></el-option>
            <el-option label='在线' :value='true'></el-option>
            <el-option label='离线' :value='false'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
      </slot>
    </base-table> -->
  </div>
</template>

<script>
// import BaseTable from '@/assets/package/table-base'
import DeviceAPI from '@/api/device'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
const {default: Suit} = require('@/common/suit')
export default {
  name: 'wifi',
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: true,
      search: {
        deviceId: '',
        name: '',
        type: '',
        online: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      transferValue: [],
      tableData: [],
      columns: [],
      oboxList: []
    }
  },
  // components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getDeviceList()
  },
  computed: {
    total () {
      return this.tableData.length || 0
    }
  },
  methods: {
    getColumns () {
      return [{
        type: 'selection',
        align: 'center'
      }, {
        label: '设备序号',
        prop: 'deviceId',
        align: 'center'
      }, {
        label: '设备名称',
        prop: 'name',
        align: 'center'
      }, {
        label: '设备状态',
        prop: 'online',
        align: 'center',
        formatter (status, row) {
          return status === false ? '离线' : '在线'
        }
      }, {
        label: '设备类型',
        prop: 'type',
        align: 'center',
        formatter (val) {
          return Suit.getRootDeviceDescriptor(val)
        }
      }, {
        label: '操作',
        align: 'center',
        renderToolBox: this.getToolboxRender
      }]
    },
    getDeviceList () {
      this.tableLoading = true
      DeviceAPI.getWifiDeviceList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.configs
        } else {
          this.$message({
            message: resp.message || '设备获取失败'
          })
        }
        this.tableLoading = false
      }).catch(err => {
        this.$message({
          title: '失败',
          message: err.message || '服务出错',
          type: 'error'
        })
        this.tableLoading = false
      })
    },
    onCurrentChange (pageNo) {
      this.search.pageNo = pageNo
      this.getDeviceList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getDeviceList()
    },
    onSelectionChange (row) {
      console.log('selected row ', row)
      this.$emit('on-selection-change', row)
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getDeviceList()
    },
    handleChange (val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  width: 94%;
  margin: 12px auto;
}
.ui-container{
  text-align: center;
}
</style>
