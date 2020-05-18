<template>
  <div class="device smart ui-container">
    <base-table
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
          <el-input @keyup.enter.native="handleSearch" class="caption-item" placeholder="场景名称" v-model="search.scene_name"></el-input>
          <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </template>
      </slot>
    </base-table>
  </div>
</template>

<script>
import BaseTable from '@/assets/package/table-base'
import SceneAPI from '@/api/scene'
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
        scene_name: '',
        pageNo: PAGINATION_PAGENO,
        pageSize: PAGINATION_PAGESIZE
      },
      tableData: [],
      columns: []
    }
  },
  components: { BaseTable },
  created () {
    this.columns = this.getColumns()
    this.getSceneList()
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
        label: '场景名称',
        prop: 'scene_name',
        align: 'center'
      }, {
        label: '场景编码',
        prop: 'scene_number',
        align: 'center'
      }, {
        label: '场景状态',
        align: 'center',
        renderBody (h, row) {
          return (
            <el-switch
              value={[false, true][row.scene_status]}
              active-color='#246CDA'
              inactive-color='#282A39'>
            </el-switch>
          )
        }
      }]
    },
    getSceneList () {
      this.tableLoading = true
      SceneAPI.getSceneList(this.search).then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.scenes
        } else {
          this.$message({
            message: resp.message || '场景获取失败'
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
      this.getSceneList()
    },
    onSizeChange (pageSize) {
      this.search.pageSize = pageSize
      this.getSceneList()
    },
    onSelectionChange (row) {
      console.log('selected row ', row)
      this.$emit('on-selection-change', row)
    },
    handleSearch () {
      this.search.pageNo = PAGINATION_PAGENO
      this.search.pageSize = PAGINATION_PAGESIZE
      this.getSceneList()
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  margin: 15px 20px;
}
</style>
