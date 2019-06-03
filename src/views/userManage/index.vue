<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-button style="margin-left: 80%; width: 10%" type="primary" @click="add_row">+ 添加用户</el-button>
      <el-col>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 20px"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            align="center"
            label="用户名"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.username }}
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.username" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="姓名"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.chname }}
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.chname" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="手机号码"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.phone }}
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.phone" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="400"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="editRowOrConfirm(scope.$index, scope.row)"
              >{{ scope.row.select_show ? '确定' : '编辑' }}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteRowOrCancel(scope.$index, scope.row)"
              >{{ scope.row.select_show ? '取消' : '删除' }}</el-button>
              <el-button
                size="mini"
                @click="changePassword(scope.row)"
              >修改密码</el-button>
              <el-button
                size="mini"
                @click="resetPassword(scope.row)"
              >重置密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col>
        <el-pagination
          style="margin-top: 20px; margin-left: 10%"
          :current-page="page"
          :total="total"
          background
          prev-text="上一页"
          next-text="下一页"
          layout="total, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
        />
      </el-col>
    </div>

    <el-dialog
      title="修改密码"
      :visible.sync="changePassDialog"
      width="30%"
      center
    >
      <el-form ref="changePasswordForm" :model="rowData" :rules="rules">
        <p>{{ rowData.username }}</p>
        <el-form-item :label="('新密码')" prop="newPassword">
          <el-input v-model="rowData.newPassword" type="password" placeholder="请输入新密码" />
        </el-form-item>
        <el-form-item :label="('确认密码')" prop="newPasswordConfirm">
          <el-input v-model="rowData.newPasswordConfirm" type="password" placeholder="请再次输入新密码" />
        </el-form-item>
        <el-button @click="changePassDialog = false">取消</el-button>
        <el-button type="primary" @click="updateModifyPasswordSubmit">确定</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { getAccountUser, addAccountUser, updataAccountUser, deleteAccoutUser, modifyPassword } from '@/api/user'
export default {
  data() {
    var checkCnName = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('名称不能为空'))
      } else {
        callback()
      }
    }
    var checkNewPassConfirm = (rule, value, callback) => {
      if (this.rowData.newPassword !== value) {
        return callback(new Error('两次输入不一致'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        username: [
          { validator: checkCnName, trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' }
        ],
        newPasswordConfirm: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { min: 6, max: 10, message: '长度在 6 到 10 个字符', trigger: 'blur' },
          { validator: checkNewPassConfirm, trigger: 'blur' }
        ]
      },
      tableData: [],
      rowUsername: '',
      rowChname: '',
      rowIsSuperuser: null,
      rowIsStaff: null,
      rowPhone: '',
      rowData: {
        newPassword: '',
        newPasswordConfirm: ''
      },
      changePassDialog: false,
      loading: true,
      page: 1,
      total: null,
      totalPage: null
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    handleCurrentChange(index) {
      this.page = index
      this.fetchData()
    },
    editRowOrConfirm(index, obj) {
      // 点击确定
      if (this.tableData[index].select_show) {
        if (obj.id === undefined) {
          // 添加用户
          addAccountUser({
            username: obj.username,
            chname: obj.chname,
            phone: obj.phone
          }).then(response => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }).catch(err => {
            this.tableData.splice(index, 1)
            console.log(err)
          })
        } else {
          // 更新用户
          updataAccountUser(obj.id, obj).then(response => {
            this.fetchData()
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowUsername = JSON.parse(JSON.stringify(obj.username))
        this.rowChname = JSON.parse(JSON.stringify(obj.chname))
        this.rowIsSuperuser = JSON.parse(JSON.stringify(obj.is_superuser))
        this.rowIsStaff = JSON.parse(JSON.stringify(obj.is_staff))
        this.rowPhone = JSON.parse(JSON.stringify(obj.phone))
        this.tableData[index].select_show = true
      }
    },
    deleteRowOrCancel(index, obj) {
      if (this.tableData[index].select_show) {
        // 点击取消
        if (obj.id === undefined) {
          this.tableData.splice(index, 1)
        } else {
          this.tableData[index].username = this.rowUsername
          this.tableData[index].chname = this.rowChname
          this.tableData[index].is_superuser = this.rowIsSuperuser
          this.tableData[index].is_staff = this.rowIsStaff
          this.tableData[index].phone = this.rowPhone
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除，删除值
        this.$confirm('此操作将删除' + obj.username + ',是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteAccoutUser(obj.id).then(response => {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    // 点击修改密码
    changePassword(data) {
      // this.rowData = data
      this.rowData.id = data.id
      this.rowData.newPassword = ''
      this.rowData.newPasswordConfirm = ''
      this.changePassDialog = true
    },
    // 修改密码
    updateModifyPasswordSubmit() {
      this.$refs['changePasswordForm'].validate((valid) => {
        if (valid) {
          const data = {
            password: this.rowData.newPassword
          }
          modifyPassword(this.rowData.id, data).then(response => {
            this.$message({
              type: 'success',
              message: '密码修改成功！'
            })
            this.changePassDialog = false
          }).catch(err => {
            console.log(err)
          })
        } else {
          return false
        }
      })
    },
    // 重置密码
    resetPassword(obj) {
      this.$confirm('此操作将重置' + obj.username + '的密码,是否继续', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        modifyPassword(obj.id, { password: '' }).then(response => {
          this.$message({
            type: 'success',
            message: '重置密码成功'
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    async add_row() {
      this.page = this.totalPage
      await this.fetchData()
      // 点击添加
      this.tableData.push({
        username: '',
        chname: '',
        phone: '',
        select_show: true
      })
    },
    async fetchData() {
      // 获取用户
      const userData = await getAccountUser({ page: this.page })
      this.total = userData.data.count
      this.totalPage = userData.data.total_page
      var data = userData.data.items
      data.map(item => {
        item.select_show = false
      })
      this.tableData = data
      this.loading = false
    },
    row_class({ row, rowIndex }) {
      if (rowIndex % 2 === 0) {
        return 'warning-row'
      } else if (rowIndex % 2 === 1) {
        return 'success-row'
      }
    }
  }
}
</script>
<style>
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }
</style>
