<template>
  <div class="ui-container">
     <el-transfer
      style="text-align: left; display: inline-block"
      v-model="transferValue"
      filterable
      :titles="['未绑定OBOX', '已绑定OBOX']"
      :button-texts="['绑定', '解绑']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      :props="{
        key: 'obox_serial_id',
        label: 'obox_name'
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
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="序列号" v-model="search.obox_serial_id"></el-input>
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="名称" v-model="search.obox_name"></el-input>
          <el-select clearable class="caption-item" placeholder="全部" v-model="search.obox_status">
            <el-option label='全部' value=''></el-option>
            <el-option label='在线' :value='1'></el-option>
            <el-option label='不在线' :value='0'></el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
      </slot>
    </base-table> -->
  </div>
</template>

<script>
// import BaseTable from '@/assets/package/table-base'
import OboxAPI from '@/api/obox'
import { PAGINATION_PAGENO, PAGINATION_PAGESIZE } from '@/common/constants'
export default {
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: true,
      tableHeight: 0,
      search: {
        serialId: '',
        obox_name: '',
        obox_status: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      transferValue: ['33ec1ea281', 'c0ec1ea281'],
      tableData: [],
      columns: []
    }
  },
  // components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getOboxList()
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
        label: '序列号',
        prop: 'obox_serial_id',
        align: 'center'
      }, {
        label: '名称',
        prop: 'obox_name',
        align: 'center'
      }, {
        label: '版本',
        prop: 'obox_version',
        align: 'center'
      }, {
        label: '状态',
        prop: 'obox_status',
        align: 'center',
        formatter (val) {
          return val ? '在线' : '不在线'
        }
      }]
    },
    getOboxList () {
      this.tableLoading = true
      OboxAPI.getOboxList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.oboxs
        } else {
          this.$message({
            message: resp.message || 'obox获取失败'
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
      this.getOboxList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getOboxList()
    },
    onSelectionChange (row) {
      console.log('selected row ', row)
      this.$emit('on-selection-change', row)
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.getOboxList()
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
<style lang="scss">
  .ui-container {
    .el-transfer-panel{
      width: 256px;
    }
    .el-transfer-panel__body{
      height: 400px;
    }
    .el-transfer-panel__list,
    .el-transfer-panel__list.is-filterable{
      height: 346px;
    }
  }
</style>
