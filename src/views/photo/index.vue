<template>
  <div class="app-container">
    <el-col
      v-for="(photo, index) in photos"
      :key="index"
      style="width: 40%; margin-left: 6.6%; margin-right: auto; margin-top: 20px"
      :span="8"
    >
      <el-card :body-style="{ padding: '0px' }">
        <img :src="photo.photo" class="image">
        <div style="padding: 14px; margin-left: 5%">
          <span>{{ '描述：' + photo.comments }}</span>
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
</template>

<script>
import { getPhoto } from '@/api/photoAndDaily'
export default {
  data() {
    return {
      photos: null,
      page: 1,
      total: null
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
    fetchData() {
      getPhoto({ page: this.page }).then(response => {
        this.total = response.data.count
        this.photos = response.data.items
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

