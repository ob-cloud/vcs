<template>
  <section>
    <ura-brand></ura-brand>
    <nav class="navbar navbar-static-top is-dialog">
      <div class="navbar-custom-menu">
        <el-dropdown trigger="click" class="uv-user-menu" @command="handleCommand">
          <el-button class="uv-menu-btn">
            <div class="user uv-user-menu">
              <a href="javascript:;" class="dropdown-toggle" data-toggle="dropdown">
                <span class="hidden-xs">{{name}}</span>
                <i class="el-icon-arrow-down el-icon--right"></i>
              </a>
            </div>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="rename">重命名</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <ura-nav-menu class="navbar-menu-nav"></ura-nav-menu>

      <el-dialog title="修改名称" width="600px" :visible.sync="dialogVisible" :close-on-click-modal="false">
        <el-form autoComplete="on" :rules="modelRules" :model="model"  ref="rename" label-position="right" label-width="18%">
          <el-form-item label="名称:" prop="name">
            <el-input class="filter-item" placeholder="输入名称" v-model="model.name">
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer text-center" >
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="rename()">确 认</el-button>
        </div>
      </el-dialog>
    </nav>
  </section>
</template>

<script>
import UraBrand from '@/views/layout/Brand.vue'
import UraNavMenu from '@/views/layout/NavMenu.vue'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      loading: false,
      dialogVisible: false,
      model: {
        name: ''
      },
      modelRules: {
        name: [{ required: true, trigger: 'blur', message: '名称不能为空' }]
      }
    }
  },
  mounted () {
    this.model.name = this.name
  },
  components: { UraBrand, UraNavMenu },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  watch: {
    dialogVisible (visbile) {
      if (visbile === false) {
        this.$refs.rename.resetFields()
      }
    }
  },
  methods: {
    handleCommand (command) {
      command === 'logout' ? this.logout() : (this.dialogVisible = true)
    },
    switchSidebarCollapse () {
      this.$store.dispatch('switchSidebarCollapse', !this.sidebarCollapse)
    },
    logout () {
      this.$store.dispatch('logOut').then(() => {
        location.reload()
      })
    },
    rename () {
      this.$refs.rename.validate(valid => {
        this.$store.dispatch('renameHotel', this.model.name).then(() => {
          this.$message({type: 'success', message: '重命名成功'})
          this.dialogVisible = false
        })
      })
    }
  }
}
</script>
