<template>
  <div class="ui-container">
    <el-transfer
      v-loading="tableLoading || bindingLoading"
      class="transfer"
      :value="transferValue"
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
  </div>
</template>

<script>
// import DeviceAPI from '@/api/device'
import SystemAPI from '@/api/system'
export default {
  name: 'wifi',
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
      tableLoading: false,
      bindingLoading: false,
      transferValue: [],
      tableData: []
    }
  },
  created () {
    this.getWIFIListByUser()
    this.getWiFiListByRoom()
  },
  methods: {
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
    handleChange (val, direction, currentVal) {
      direction === 'right' ? this.bindWifi(currentVal) : this.unbindWifi(currentVal)
      console.log(currentVal, direction)
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
