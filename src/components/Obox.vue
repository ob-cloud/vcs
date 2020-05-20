<template>
  <div class="ui-container">
     <el-transfer
      v-loading="tableLoading"
      class="transfer"
      v-model="transferValue"
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
</template>

<script>
// import OboxAPI from '@/api/obox'
import SystemAPI from '@/api/system'
export default {
  props: {
    height: {
      type: Number,
      default: 0
    },
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: true,
      search: {
      },
      transferValue: [],
      tableData: []
    }
  },
  created () {
    this.getAllOboxListByUser()
    this.getAllOboxListByRoom()
  },
  methods: {
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
      SystemAPI.getOboxByRoom(this.id).then(res => {
        if (res.status === 200) {
          this.transferValue = res.data.oboxes.filter(item => item.obox_serial_id)
        }
      })
    },
    bindObox (serialIds) {

    },
    unbindObox (serialIds) {

    },
    handleChange (val, direction) {
      direction === 'right' ? this.bindObox(val) : this.unbindObox(val)
      console.log(val, direction)
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
