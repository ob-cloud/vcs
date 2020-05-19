<template>
  <div class="device smart ui-container">
    <div class="search-bar">
      <el-form class="ob-form" ref="search" autoComplete="on" :rules="searchRules" :model="search">
        <el-form-item prop="scene_name">
          <el-input v-model="search.scene_name" class="inblock" clearable placeholder="输入场景命名规则"></el-input>
        </el-form-item>
      </el-form>
      <el-button class="inblock" type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>
    </div>

    <el-transfer
      v-loading="tableLoading"
      class="transfer"
      v-model="transferValue"
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
import SceneAPI from '@/api/scene'
export default {
  props: {
    height: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      tableLoading: false,
      search: {
        scene_name: '',
      },
      searchRules: {
        scene_name: [{ required: true, message: '输入场景命名规则', trigger: 'blur' }]
      },
      transferValue: [],
      tableData: []
    }
  },
  created () {

  },
  methods: {
    getSceneListByUser () {
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
    getSceneListByRoom () {
      SceneAPI.getSceneList(this.search).then(res => {
        if (res.status === 200) {
          this.transferValue = res.data.scenes.filters(item => item.scene_number)
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

    },
    unbindScene (sceneNumbers) {

    },
    handleChange (val, direction) {
      direction === 'right' ? this.bindScene(val) : this.unbindScene(val)
      console.log(val, direction)
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
  margin-left: 6%;

  .ob-form{
    display: inline-block;
  }
  .inblock.el-input{
    width: 196px;
  }
}
</style>
