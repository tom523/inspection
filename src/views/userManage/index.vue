<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col>
        <el-button class="el-table-add-row" type="primary" @click="add_row">+ 添加用户</el-button>
      </el-col>
      <el-col>
        <el-table
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 10px"
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
            label="超级管理员"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.is_superuser | chooseType }}
              <div v-if="scope.row.select_show && scope.row.id">
                <el-select
                  v-model="scope.row.is_superuser"
                  width="100%"
                >
                  <el-option
                    v-for="item in userType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="管理员"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.is_staff | chooseType }}
              <div v-if="scope.row.select_show && scope.row.id">
                <el-select
                  v-model="scope.row.is_staff"
                  width="100%"
                >
                  <el-option
                    v-for="item in userType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
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
            width="300"
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
            </template>
          </el-table-column>
        </el-table>
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
  filters: {
    chooseType(info) {
      if (info === true) {
        info = '是'
      } else if (info === false) {
        info = '否'
      }
      return info
    }
  },
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
      userType: [{
        value: true,
        label: '是'
      }, {
        value: false,
        label: '否'
      }],
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
      changePassDialog: false
    }
  },
  created() {
    this.fecthdata()
  },
  methods: {
    editRowOrConfirm(row, index) {
      // 点击确定
      if (this.tableData[row].select_show) {
        if (index.id === undefined) {
          // 添加用户
          addAccountUser({
            username: index.username,
            chname: index.chname,
            phone: index.phone
          }).then(response => {
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }).catch(err => {
            console.log(err)
          })
        } else {
          // 更新用户
          updataAccountUser(index.id, index).then(response => {
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          })
        }
        this.tableData[row].select_show = false
      } else {
        // 点击编辑
        this.rowUsername = JSON.parse(JSON.stringify(index.username))
        this.rowChname = JSON.parse(JSON.stringify(index.chname))
        this.rowIsSuperuser = JSON.parse(JSON.stringify(index.is_superuser))
        this.rowIsStaff = JSON.parse(JSON.stringify(index.is_staff))
        this.rowPhone = JSON.parse(JSON.stringify(index.phone))
        this.tableData[row].select_show = true
      }
    },
    deleteRowOrCancel(row, index) {
      if (this.tableData[row].select_show) {
        // 点击取消
        this.tableData[row].username = this.rowUsername
        this.tableData[row].chname = this.rowChname
        this.tableData[row].is_superuser = this.rowIsSuperuser
        this.tableData[row].is_staff = this.rowIsStaff
        this.tableData[row].phone = this.rowPhone
        this.tableData[row].select_show = false
      } else {
        // 点击删除，删除值
        deleteAccoutUser(index.id).then(response => {
          this.tableData.splice(row, 1)
          this.$message({
            type: 'success',
            message: '删除成功'
          })
        })
      }
    },
    // 点击修改密码
    changePassword(data) {
      debugger
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
    add_row() {
      // 点击添加
      this.tableData.push({
        username: '',
        chname: '',
        phone: '',
        select_show: true
      })
    },
    async fecthdata() {
      // 获取用户
      const userData = await getAccountUser()
      var data = userData.data.items
      data.map(item => {
        item.select_show = false
      })
      this.tableData = data
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
  .el-table-add-row {
    width: 10%;
    margin-left: 80%;
    margin-right: auto;
    height: 40px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
}
</style>
