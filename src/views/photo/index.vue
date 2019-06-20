<template>
  <div class="app-container">
    <el-col>
      <span style="margin-left: 6.6%">选择来源：</span>
      <el-select v-model="source" multiple collapse-tags clearable placeholder="请选择">
        <el-option
          v-for="item in sources"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <span style="margin-left: 27%">选择专业：</span>
      <el-select v-model="listQuery.profession" :disabled="professionDisabled" clearable filterable placeholder="请先选择来源">
        <el-option
          v-for="item in professions"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-col>
    <el-col style="margin-top: 20px">
      <span style="margin-left: 6.6%">选择时间：</span>
      <el-date-picker
        v-model="actual_check_time"
        style="width: 300px"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <span style="margin-left: 21%">选择巡检点：</span>
      <el-select v-model="listQuery.point" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in points"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
    </el-col>
    <el-col
      v-for="(photo, index) in photos"
      :key="index"
      style="width: 40%; margin-left: 6.6%; margin-right: auto; margin-top: 50px"
      :span="8"
    >
      <el-card :body-style="{ padding: '0px' }">
        <img :src="photo.photo" class="image">
        <div style="padding: 14px; margin-left: 5%">
          <el-row>
            <el-col :span="12">
              <div v-if="photo.inspection_level" style="margin-top: 10px">
                <span>{{ '检查级别：' + inspLevelFilter(photo.inspection_level) }}</span>
              </div>
              <div style="margin-top: 10px">
                <span>{{ '描述：' + photo.comments }}</span>
              </div>
              <div style="margin-top: 10px">
                <span>{{ '时间：' + photo.actual_check_time }}</span>
              </div>
              <div class="bottom clearfix">
                <span>{{ '拍照人：' + photo.staff }}</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div v-if="photo.profession" style="margin-top: 10px">
                <span>{{ '专业：' + photo.profession }}<br></span>
              </div>
              <div v-if="photo.team" style="margin-top: 10px">
                <span>{{ '值：' + photo.team }}</span>
              </div>
              <div v-if="photo.point" style="margin-top: 10px">
                <span>{{ '巡检点：' + photo.point }}<br></span>
              </div>
              <div v-if="photo.device" style="margin-top: 10px">
                <span>{{ '设备：' + photo.device }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-card>
    </el-col>
    <el-col>
      <el-pagination
        style="margin-top: 50px; margin-left: 6.6%; margin-bottom: 10%"
        :current-page="listQuery.page"
        :total="total"
        background
        prev-text="上一页"
        next-text="下一页"
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
      />
    </el-col>
  </div>
</template>

<script>
import { getPhoto } from '@/api/photoAndDaily'
import { getRoleUser } from '@/api/user'
import { getAllPoint } from '@/api/insp'
export default {
  data() {
    return {
      photos: null,
      total: null,
      page: 1,
      listQuery: {
        profession: null,
        point: null,
        actual_check_time__gte: null,
        actual_check_time__lte: null,
        source: null
      },
      professions: null,
      points: null,
      actual_check_time: null,
      sources: [{
        label: '拍照',
        value: 'photo'
      },
      {
        label: '巡检项',
        value: 'item'
      },
      {
        label: '修复项',
        value: 'repair'
      }],
      source: []
    }
  },
  computed: {
    professionDisabled: function() {
      return !(this.source.length > 0 && this.source.filter(item => item === 'item' || item === 'repair').length > 0)
    }
  },
  watch: {
    listQuery: {
      handler: function() {
        this.listQuery.page = 1
        this.fetchData()
      },
      deep: true
    },
    actual_check_time: function() {
      console.log(this.actual_check_time)
      if (this.actual_check_time) {
        this.listQuery.actual_check_time__gte = this.actual_check_time[0] + ' 00:00:00'
        this.listQuery.actual_check_time__lte = this.actual_check_time[1] + ' 23:59:59'
      } else {
        this.listQuery.actual_check_time__gte = null
        this.listQuery.actual_check_time__lte = null
      }
    },
    source: function() {
      this.listQuery.source = this.source.toString()
    },
    professionDisabled: function() {
      debugger
      this.professionDisabled ? this.listQuery.profession = null : console.log()
    }
  },
  created() {
    this.fetchData()
    this.fetchSelect()
  },
  methods: {
    inspLevelFilter(key) {
      const map = {
        1: '巡检',
        2: '复检',
        3: '抽检',
        9: '管线巡检'
      }
      return map[key]
    },
    handleCurrentChange(index) {
      this.listQuery.page = index
      this.fetchData()
    },
    fetchData() {
      getPhoto(this.listQuery).then(response => {
        this.total = response.count
        this.photos = response.items
      })
    },
    fetchSelect() {
      getRoleUser({ role_type__in: 'PROFESSION,PIPE_PROFESSION' }).then(response => {
        this.professions = response.data
      })
      getAllPoint().then(response => {
        this.points = response.data
      })
    }
  }
}
</script>
<style>
  .time {
    font-size: 13px;
    color: #999;
  }

  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 90%;
    margin-top: 20px;
    margin-left: 5%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }

  .clearfix:after {
      clear: both
  }
</style>

