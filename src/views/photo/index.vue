<template>
  <div class="app-container">
    <el-col>
      <span style="margin-left: 6.6%">选择专业：</span>
      <el-select v-model="listQuery.professions" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in professions"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <span style="margin-left: 32px">选择巡检点：</span>
      <el-select v-model="listQuery.point" clearable filterable placeholder="请选择">
        <el-option
          v-for="item in points"
          :key="item.id"
          :label="item.name"
          :value="item.name"
        />
      </el-select>
      <span style="margin-left: 32px">选择时间：</span>
      <el-date-picker
        v-model="actual_check_time"
        style="width: 300px"
        type="daterange"
        value-format="yyyy-MM-dd"
        range-separator="~"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
    </el-col>
    <el-col
      v-for="(photo, index) in photos"
      :key="index"
      style="width: 40%; margin-left: 6.6%; margin-right: auto; margin-top: 20px"
      :span="8"
    >
      <el-card :body-style="{ padding: '0px' }">
        <img :src="photo.photo" class="image">
        <div style="padding: 14px; margin-left: 5%">
          <div v-if="photo.profession">
            <span>{{ '专业：' + photo.profession }}<br></span>
          </div>
          <div v-if="photo.point" style="margin-top: 10px">
            <span>{{ '巡检点：' + photo.point }}<br></span>
          </div>
          <div style="margin-top: 10px">
            <span>{{ '描述：' + photo.comments }}</span>
          </div>
          <div style="margin-top: 10px">
            <span>{{ '时间：' + photo.actual_check_time }}</span>
          </div>
          <div class="bottom clearfix">
            <span>{{ '拍照人:' + photo.staff }}</span>
          </div>
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
        actual_check_time__lte: null
      },
      professions: null,
      points: null,
      actual_check_time: null
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
    }
  },
  created() {
    this.fetchData()
    this.fetchSelect()
  },
  methods: {
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
      getRoleUser({ role_type__in: 'PROFESSION,REVIEW_PROFESSION,PIPE_PROFESSION' }).then(response => {
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

