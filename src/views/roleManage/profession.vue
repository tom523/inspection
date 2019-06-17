<template>
  <div class="app-container">
    <div style="margin-top: 30px">
      <el-button style="margin-left: 54%; width: 12%;" type="primary" @click="generateLogPipe">生成管线巡检记录</el-button>
      <el-button style="width: 12%" type="primary" @click="generateLogReview">生成复检巡检记录</el-button>
      <el-button style="width: 10%" type="primary" @click="add_row">+ 添加专业</el-button>
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
            width="120"
          >
            <template slot-scope="scope">
              {{ scope.row.select_show && scope.row.id === undefined ? '' : scope.row.role_type | chooseProfessionType }}
              <div v-if="scope.row.select_show && scope.row.id===undefined">
                <el-select
                  v-model="scope.row.role_type"
                  clearable
                  style="width: 100%"
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
            width="100"
            label="巡检频率"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show && scope.row.role_type !== 'PROFESSION'">
                <el-select
                  v-model="scope.row.desc"
                  clearable
                  style="width: 100%"
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
            width="120"
            label="绑定专业/分组"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.select_show && scope.row.role_type === 'REVIEW_PROFESSION'">
                <el-select
                  v-model="scope.row.access"
                  multiple
                  filterable
                  collapse-tags
                  reserve-keyword
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in professions"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                  />
                </el-select>
              </div>
              <div v-else-if="scope.row.select_show && scope.row.role_type === 'PROFESSION'">
                <el-select
                  v-model="scope.row.access"
                  filterable
                  clearable
                  style="width: 100%"
                >
                  <el-option
                    v-for="item in group"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </div>
              <div v-else>{{ scope.row.role_type === 'PROFESSION' ? scope.row.access : scope.row.access.toString() }}</div>
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
                  clearable
                  collapse-tags
                  filterable
                  reserve-keyword
                  multiple
                >
                  <el-button type="text" style="margin-left: 80%" @click="allSelectMembers(scope.row.members)">全选</el-button>
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
      <el-dialog
        width="40%"
        :before-close="clearDate"
        :visible.sync="generateLogDialog"
      >
        <el-form v-model="generateData">
          <el-form-item>
            <el-radio-group v-model="generateData.this_period">
              <el-radio label="true">生成本周期巡检记录</el-radio>
              <el-radio label="false">生成下周期巡检记录</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="专业">
            <el-select
              v-model="generateData.profession_id"
              clearable
              style="width: 80%"
            >
              <el-option
                v-for="item in professions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <el-button style="margin-left: 80%" type="primary" @click="generateLogByFrequency">确定</el-button>
      </el-dialog>
    </div>
  </div>
</template>

<script>
// import { getList } from '@/api/table'
import { getRoleUser, getAllUser, addRoleUser, updataRoleUser, deleteRoleUser } from '@/api/user'
import { genLogByFrequencyREviewAndPipe } from '@/api/duty'
import { getPorfessionGroup } from '@/api/insp'
import { allSelect, compare } from '@/utils/tool'
import { MessageBox, Message } from 'element-ui'

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
      rowAccess: null,
      rowDesc: null,
      members: [],
      professions: [],
      generateData: {
        this_period: null,
        profession_id: null
      },
      generateLogDialog: false,
      group: []
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
        obj.access ? obj.access = obj.access.toString() : obj.access = ''
        // 新建专业
        if (obj.id === undefined) {
          addRoleUser(obj).then(response => {
            obj.members = obj.members.split(',')
            this.fecthdata()
            Message({
              type: 'success',
              message: '添加成功'
            })
          }).catch(err => {
            this.tableData[index].select_show = true
            Message({
              type: 'warning',
              message: err.response.data.data.members || err.response.data.data.non_field_errors
            })
            console.log(err)
          })
        } else {
          // 更新专业
          updataRoleUser(obj.id, obj).then(response => {
            obj.members = obj.members.split(',')
            this.fecthdata()
            Message({
              type: 'success',
              message: '更新成功'
            })
          }).catch(err => {
            this.tableData[index].select_show = true
            Message({
              type: 'warning',
              message: err.response.data.data.members
            })
            console.log(err)
          })
        }
        this.tableData[index].select_show = false
      } else {
        // 点击编辑
        this.fecthUser()
        obj.role_type === 'PROFESSION' ? this.rowAccess = obj.access : this.rowAccess = JSON.parse(JSON.stringify(obj.access))
        this.rowMember = JSON.parse(JSON.stringify(obj.members))
        this.rowDesc = JSON.parse(JSON.stringify(obj.desc))
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
          this.tableData[index].access = this.rowAccess
          this.tableData[index].desc = this.rowDesc
          this.tableData[index].select_show = false
        }
      } else {
        // 点击删除
        MessageBox.confirm('此操作将删除' + obj.name + ',是否继续', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteRoleUser(obj.id).then(response => {
            this.tableData.splice(index, 1)
            Message({
              type: 'success',
              message: '删除成功！'
            })
          }).catch(err => {
            console.log(err)
          })
        }).catch(() => {
          Message({
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
        if (item.role_type !== 'PROFESSION') {
          item.access = item.access.substring(1, item.access.length - 1)
          item.access = item.access.split(',')
        } else {
          item.access = item.access.substring(1, item.access.length - 1)
        }
        item.members = item.members.substring(1, item.members.length - 1)
        item.members = item.members.split(',')
        item.role_type === 'PROFESSION' ? item.inspection_leval = 1 : item.role_type === 'REVIEW_PROFESSION' ? item.inspection_leval = 2 : item.inspection_leval = 3
      })
      this.professions = data.filter(item => item.role_type === 'PROFESSION')
      data.sort(compare('inspection_leval'))
      this.tableData = data
      this.loading = false
    },
    fecthUser() {
      // 获取用户
      getAllUser().then(response => {
        this.members = response.data
      })
      getPorfessionGroup().then(response => {
        this.group = response.data
      })
    },
    // 生成复检巡检记录
    generateLogReview() {
      this.generateLogDialog = true
      getRoleUser({ role_type: 'REVIEW_PROFESSION' }).then(response => {
        this.professions = response.data
      })
    },
    // 生成管线巡检记录
    generateLogPipe() {
      this.generateLogDialog = true
      getRoleUser({ role_type: 'PIPE_PROFESSION' }).then(response => {
        this.professions = response.data
      })
    },
    generateLogByFrequency() {
      console.log(this.generateData)
      genLogByFrequencyREviewAndPipe(this.generateData).then(response => {
        Message({
          type: 'success',
          message: '生成记录成功！'
        })
      }).catch(err => {
        console.log(err)
      })
      // if (this.professions[0].role_type === 'REVIEW_PROFESSION') {
      //   genLogByFrequencyREview(this.generateData).then(response => {
      //     Message({
      //       type: 'success',
      //       message: '生成复检巡检记录成功！'
      //     })
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // } else if (this.professions[0].role_type === 'PIPE_PROFESSION') {
      //   genLogByFrequencyPipe(this.generateData).then(response => {
      //     Message({
      //       type: 'success',
      //       message: '生成管线巡检记录成功！'
      //     })
      //   }).catch(err => {
      //     console.log(err)
      //   })
      // }
      this.clearDate()
      this.generateLogDialog = false
    },
    clearDate() {
      this.generateLogDialog = false
      this.generateData = {
        this_period: null,
        profession_id: null
      }
    },
    allSelectMembers(rowMember) {
      rowMember = allSelect(rowMember, this.members, 'username')
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
