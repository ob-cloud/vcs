<template>
  <el-drawer
    title="绑定红外"
    :visible.sync="drawerVisible"
    direction="rtl"
    size="800px">
      <div class="ui-container">
        <el-transfer
          v-loading="tableLoading || bindingLoading"
          class="transfer"
          :value="transferValue"
          filterable
          :titles="['未绑定红外', '已绑定红外']"
          :button-texts="['解绑', '绑定']"
          :render-content="renderFunc"
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
      </div>
  </el-drawer>
</template>

<script>
import SystemAPI from '@/api/system'
export default {
  name: 'wifi',
  data () {
    return {
      drawerVisible: false,
      tableLoading: false,
      bindingLoading: false,
      transferValue: [],
      tableData: [],
      id: ''
    }
  },
  created () {
    // this.getWIFIListByUser()
    // this.getWiFiListByRoom()
  },
  watch: {
    drawerVisible () {
      if (this.drawerVisible) {
        this.getWIFIListByUser()
        this.getWiFiListByRoom()
      } else {
        this.transferValue = []
        this.tableData = []
      }
    }
  },
  methods: {
    show (roomId) {
      this.drawerVisible = true
      this.id = roomId
    },
    getWIFIListByUser () {
      this.tableLoading = true
      SystemAPI.getWifiByUser().then(resp => {
        if (resp.status === 200) {
          this.tableData = resp.data.wifi
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
    getWiFiListByRoom () {
      SystemAPI.getWifiByRoom(this.id).then(res => {
        if (res.status === 200) {
          this.transferValue = res.data.wifi.map(item => item.deviceId)
        }
      })
    },
    bindWifi (deviceIds) {
      this.bindingLoading = true
      SystemAPI.bindWifi(this.id, deviceIds).then(res => {
        this.bindingLoading = false
        if (res.status === 200) {
          this.getWiFiListByRoom()
        } else {
          this.$message({
            type: 'error',
            message: res.message || '绑定失败'
          })
        }
      }).catch(() => { this.bindingLoading = false })
    },
    unbindWifi (deviceIds) {
      this.bindingLoading = true
      SystemAPI.unbindWifi(deviceIds.join(',')).then(res => {
        this.bindingLoading = false
        if (res.status === 200) {
          this.getWiFiListByRoom()
        } else {
          this.$message({
            type: 'error',
            message: res.message || '解绑失败'
          })
        }
      }).catch(() => { this.bindingLoading = false })
    },
    renderFunc (h, option) {
      return <span title={`${option.name} - ${option.deviceId}`}>{ option.name } - { option.deviceId }</span>
    },
    handleChange (val, direction, currentVal) {
      direction === 'right' ? this.bindWifi(currentVal) : this.unbindWifi(currentVal)
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
.ui-container .el-transfer-panel__item.el-checkbox:first-of-type{
  margin-right: 0;
}
</style>
