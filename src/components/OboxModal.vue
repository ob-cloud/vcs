<template>
  <el-drawer
    title="绑定OBOX"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="800px">
      <div class="ui-container">
        <el-transfer
          v-loading="tableLoading || bindingLoading"
          class="transfer"
          :value="transferValue"
          filterable
          :titles="['未绑定OBOX', '已绑定OBOX']"
          :button-texts="['解绑', '绑定']"
          :format="{
            noChecked: '${total}',
            hasChecked: '${checked}/${total}'
          }"
          :props="{
            key: 'oboxSerialId',
            label: 'oboxName'
          }"
          @change="handleChange"
          :data="tableData">
        </el-transfer>
    </div>
  </el-drawer>
</template>

<script>
import SystemAPI from '@/api/system'
export default {
  data () {
    return {
      drawerVisible: false,
      tableLoading: false,
      bindingLoading: false,
      search: {
      },
      transferValue: [],
      tableData: [],
      id: ''
    }
  },
  created () {
    // this.getAllOboxListByUser()
    // this.getAllOboxListByRoom()
  },
  watch: {
    drawerVisible () {
      if (this.drawerVisible) {
        this.getAllOboxListByUser()
        this.getAllOboxListByRoom()
      }
    }
  },
  methods: {
    show (roomId) {
      this.drawerVisible = true
      this.id = roomId
    },
    getAllOboxListByUser () {
      this.tableLoading = true
      SystemAPI.getOboxByUser().then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.oboxes
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
    getAllOboxListByRoom () {
      this.bindingLoading = true
      SystemAPI.getOboxByRoom(this.id).then(res => {
        this.bindingLoading = false
        if (res.status === 200) {
          this.transferValue = res.data.oboxes.map(item => item.oboxSerialId)
        }
      }).catch(() => {
        this.bindingLoading = false
      })
    },
    bindObox (serialIds) {
      this.bindingLoading = true
      SystemAPI.bindObox(this.id, serialIds).then(res => {
        this.bindingLoading = false
        if (res.status === 200) {
          this.getAllOboxListByRoom()
        } else {
          this.$message({
            type: 'error',
            message: res.message || '绑定失败'
          })
        }
      }).catch(() => { this.bindingLoading = false })
    },
    unbindObox (serialIds) {
      this.bindingLoading = true
      SystemAPI.unbindObox(serialIds.join(',')).then(res => {
        this.bindingLoading = false
        if (res.status === 200) {
          this.getAllOboxListByRoom()
        } else {
          this.$message({
            type: 'error',
            message: res.message || '解绑失败'
          })
        }
      }).catch(() => { this.bindingLoading = false })
    },
    handleChange (val, direction, currentVal) {
      direction === 'right' ? this.bindObox(currentVal) : this.unbindObox(currentVal)
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
  .transfer{
    text-align: left;
    display: inline-block;
    margin-top: 20px;
  }
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
