<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col>
        <el-button class="el-table-add-row" type="primary" @click="add_row">+ 添加专业</el-button>
      </el-col>
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
            label="专业"
            width="100"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.name }}
              <div v-if="scope.row.select_show">
                <el-input v-model="scope.row.name" />
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="专业类型"
            width="180"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show && scope.row.id === undefined ? '' : scope.row.role_type | chooseProfessionType }}
              <div v-if="scope.row.select_show && scope.row.id===undefined">
                <el-select
                  v-model="scope.row.role_type"
                  style="width = 100%"
                >
                  <el-option
                    v-for="item in professionType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
            </template>>
          </el-table-column>
          <el-table-column
            align="center"
            label="巡检频率"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show && scope.row.role_type !== 'PROFESSION'">
                <el-select
                  v-model="scope.row.desc"
                  style="width=100"
                >
                  <el-option
                    v-for="item in frequency"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div v-else>{{ scope.row.role_type === 'PROFESSION' ? '--' : scope.row.desc | chooseFrequency }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="绑定专业"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show && scope.row.role_type === 'REVIEW_PROFESSION'">
                <el-select
                  v-model="scope.row.access"
                  multiple
                  style="width=100"
                >
                  <el-option
                    v-for="item in professions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </div>
              <div v-else>{{ scope.row.role_type !== 'REVIEW_PROFESSION' ? '--' : scope.row.access.toString() }}</div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="用户"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show ? '' : scope.row.members.toString() }}
              <div v-if="scope.row.select_show">
                <el-select
                  v-model="scope.row.members"
                  style="width: 100%"
                  multiple
                >
                  <el-option
                    v-for="item in members"
                    :key="item.username"
                    :lable="item.id"
                    :value="item.username"
                  />
                </el-select>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="180"
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
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </div>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getRoleUser, getAccountUser, addRoleUser, updataRoleUser, deleteRoleUser } from '@/api/user'

export default {
  filters: {
    chooseProfessionType: function(info) {
      if (info === 'PROFESSION') {
        info = '普通专业'
      } else if (info === 'REVIEW_PROFESSION') {
        info = '复检专业'
      } else if (info === 'PIPE_PROFESSION') {
        info = '管线专业'
      }
      return info
    },
    chooseFrequency: function(info) {
      if (info === 'WE') {
        info = '每周'
      } else if (info === 'MO') {
        info = '每月'
      } else if (info === 'QU') {
        info = '每季度'
      }
      return info
    }
  },
  data() {
    return {
      frequency: [{
        value: 'WE',
        label: '每周'
      },
      {
        value: 'MO',
        label: '每月'
      }, {
        value: 'QU',
        label: '每季度'
      }],
      loading: true,
      professionType: [{
        value: 'PROFESSION',
        label: '普通专业'
      }, {
        value: 'REVIEW_PROFESSION',
        label: '复检专业'
      }, {
        value: 'PIPE_PROFESSION',
        label: '管线专业'
      }],
      tableData: [],
      rowMember: [],
      members: [],
      professions: []
    }
  },
  created() {
    this.fecthdata()
    this.fecthUser()
  },
  methods: {
    editRowOrConfirm(index, obj) {
      // 点击确定
      if (this.tableData[index].select_show) {
        obj.members = obj.members.toString()
        obj.access = obj.access.toString()
        // 新建专业
        if (obj.id === undefined) {
          addRoleUser(obj).then(response => {
            obj.members = obj.members.split(',')
            this.fecthdata()
            this.$message({
              type: 'success',
              message: '添加成功'
            })
          }).catch(err => {
            this.tableData[index].select_show = true
            this.$message({
              type: 'warning',
              message: err.response.data.data.members
            })
            console.log(err)
          })
        } else {
          // 更新专业
          updataRoleUser(obj.id, obj).then(response => {
            obj.members = obj.members.split(',')
            this.fecthdata()
            this.$message({
              type: 'success',
              message: '更新成功'
            })
          }).catch(err => {
            this.tableData[index].select_show = true
            this.$message({
              type: 'warning',
              message: err.response.data.data.members
            })
            console.log(err)
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowMember = JSON.parse(JSON.stringify(obj.members))
        this.tableData[index].select_show = true
      }
    },
    deleteRowOrCancel(index, obj) {
      if (this.tableData[index].select_show) {
        // 点击取消
        if (obj.id === undefined) {
          this.tableData.splice(index, 1)
        } else {
          this.tableData[index].members = this.rowMember
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除
        this.$confirm('此操作将删除' + obj.name + ',是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleUser(obj.id).then(response => {
            this.tableData.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      }
    },
    add_row() {
      // 点击添加
      this.tableData.push({
        role_type: '',
        name: '',
        members: '',
        access: '',
        desc: '',
        role_key: '',
        access_name: '',
        select_show: true
      })
    },
    async fecthdata() {
      // 获取专业
      const professionData = await getRoleUser({ role_type__in: 'PROFESSION,REVIEW_PROFESSION,PIPE_PROFESSION' })
      var data = professionData.data
      data.map(item => {
        item.select_show = false
        item.members = item.members.split(',')
        item.access = item.access.split(',')
        item.members.pop()
        item.members.shift()
        item.access.pop()
        item.access.shift()
      })
      this.professions = data.filter(item => item.role_type === 'PROFESSION')
      this.tableData = data
      this.loading = false
    },
    async fecthUser() {
      // 获取用户
      const membersData = await getAccountUser()
      this.members = membersData.data.items
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
    margin-top: 5px;
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
