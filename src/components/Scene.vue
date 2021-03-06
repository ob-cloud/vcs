<template>
  <div class="device smart ui-container">
    <div class="search-bar">
      <el-row :gutter="10">
        <el-col :xs="20" :sm="24" :md="20" :lg="20" :xl="12">
            <el-form class="ob-form" ref="search" autoComplete="on" :rules="searchRules" :model="search">
              <el-form-item prop="word">
                <el-input v-model="search.word" class="inblock" clearable placeholder="输入场景命名规则"></el-input>
              </el-form-item>
            </el-form>
            <el-button class="inblock" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
        </el-col>
        <el-col :xs="1" :sm="1" :md="4" :lg="4" :xl="12">
        </el-col>
      </el-row>
    </div>

    <el-transfer
      v-loading="tableLoading || bindingLoading"
      class="transfer"
      :value="transferValue"
      filterable
      :titles="['未绑定场景', '已绑定场景']"
      :button-texts="['解绑', '绑定']"
      :format="{
        noChecked: '${total}',
        hasChecked: '${checked}/${total}'
      }"
      :props="{
        key: 'scene_number',
        label: 'scene_name'
      }"
      @change="handleChange"
      :data="tableData">
    </el-transfer>
  </div>
</template>

<script>
// import SceneAPI from '@/api/scene'
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
      tableLoading: false,
      bindingLoading: false,
      search: {
        word: '',
      },
      searchRules: {
        word: [{ required: true, message: '输入场景命名规则', trigger: 'blur' }]
      },
      transferValue: [],
      tableData: []
    }
  },
  created () {
    this.getSceneListByRoom()
  },
  methods: {
    getSceneListByUser () {
      this.tableLoading = true
      SystemAPI.getSceneByUser(this.search.word).then(resp => {
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
    getSceneListByRoom () {
      SystemAPI.getSceneByRoom(this.id).then(res => {
        if (res.status === 200) {
          this.transferValue = res.data.scenes.map(item => item.scene_number)
          !this.tableData.length && (this.tableData = res.data.scenes)
        }
      })
    },
    handleSearch () {
      this.$refs.search.validate(valid => {
        if (valid) {
          this.getSceneListByUser()
        }
      })
    },
    bindScene (sceneNumbers) {
      this.bindingLoading = true
      SystemAPI.bindScene(this.id, sceneNumbers).then(res => {
        this.bindingLoading = false
        if (res.status === 200) {
          this.getSceneListByRoom()
        } else {
          this.$message({
            type: 'error',
            message: res.message || '绑定失败'
          })
        }
      }).catch(() => { this.bindingLoading = false })
    },
    unbindScene (sceneNumbers) {
      this.bindingLoading = true
      SystemAPI.unbindScene(sceneNumbers.join(',')).then(res => {
        this.bindingLoading = false
        if (res.status === 200) {
          this.getSceneListByRoom()
        } else {
          this.$message({
            type: 'error',
            message: res.message || '解绑失败'
          })
        }
      }).catch(() => { this.bindingLoading = false })
    },
    handleChange (val, direction, currentVal) {
      direction === 'right' ? this.bindScene(currentVal) : this.unbindScene(currentVal)
      console.log(currentVal, direction)
    }
  }
}
</script>

<style lang="scss" scoped>
.smart{
  margin: 15px 20px;
}
.ui-container{
  text-align: center;
}
.search-bar{
  text-align: left;
  margin-left: 20px;

  .ob-form{
    display: inline-block;
  }
  .inblock.el-input{
    width: 196px;
  }
}
</style>
