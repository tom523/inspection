<template>
  <div class="app-container">
    <div style="margin-top: 50px">
      <el-col>
        <el-table
          v-loading="loading"
          element-loading-text="拼命加载中"
          :row-class-name="row_class"
          border
          :data="tableData"
          style="width: 80%; margin-left: auto; margin-right: auto; margin-top: 20px; margin-bottom: 10%"
        >
          <el-table-column
            align="center"
            type="index"
            label="序号"
            width="80"
          />
          <el-table-column
            align="center"
            prop="name"
            label="功能"
            width="100"
          />
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
                  collapse-tags
                  clearable
                  filterable
                  multiple
                  reserve-keyword
                >
                  <el-button type="text" style="margin-left: 90%" @click="allSelectmembers(scope.row.members)">全选</el-button>
                  <el-option
                    v-for="item in members"
                    :key="item.id"
                    :lable="item.username"
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
                :disabled="scope.row.name === '复检' || scope.row.name === '管线巡检' || scope.row.name === '巡检'"
                @click="editRowOrConfirm(scope.$index, scope.row)"
              >{{ scope.row.select_show ? '确定' : '编辑' }}</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="cancel(scope.$index, scope.row)"
              >取消</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </div>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getRoleUser, getAllUser, updataRoleUser } from '@/api/user'
import { allSelect } from '@/utils/tool'

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
    }
  },
  data() {
    return {
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
      loading: true
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
        // 更新功能
        updataRoleUser(obj.id, obj).then(response => {
          obj.members = obj.members.split(',')
          this.fecthdata()
          this.$message({
            type: 'success',
            message: '更新成功'
          })
        }).catch(err => {
          this.tableData[index].members = this.rowMember
          this.$message({
            type: 'warning',
            message: err.response.data.data.members || err.response.data.data.non_field_errors || err.response.data.data.detail
          })
          console.log(err)
        })
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.rowMember = JSON.parse(JSON.stringify(obj.members))
        this.tableData[index].select_show = true
      }
    },
    cancel(index, obj) {
      // 点击取消
      if (obj.select_show) {
        this.tableData[index].members = this.rowMember
        this.tableData[index].select_show = false
      }
    },
    async fecthdata() {
      // 获取功能
      const functionData = await getRoleUser({ role_type: 'ADMIN' })
      var data = functionData.data
      data.map(item => {
        item.select_show = false
        item.members = item.members.split(',')
        item.members.pop()
        item.members.shift()
      })
      this.tableData = data
      this.loading = false
    },
    async fecthUser() {
      // 获取用户
      getAllUser().then(response => {
        this.members = response.data
      })
    },
    allSelectmembers(rowMembers) {
      rowMembers = allSelect(rowMembers, this.members, 'username')
      // for (var i = 0; i < this.members.length; i++) {
      //   if (rowMembers.filter(item => item === this.members[i].username).length === 0) {
      //     rowMembers.push(this.members[i].username)
      //   }
      // }
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
