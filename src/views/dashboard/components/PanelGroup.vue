<template>
  <el-row :gutter="40" class="panel-group">
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="viewItemLog('AB')">
        <div class="card-panel-icon-wrapper icon-clipboard">
          <svg-icon icon-class="clipboard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">未修复缺陷总数</div>
          <count-to :start-val="0" :end-val="abFault" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel" @click="viewItemLog('RE')">
        <div class="card-panel-icon-wrapper icon-component">
          <svg-icon icon-class="component" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">已修复缺陷总数</div>
          <count-to :start-val="0" :end-val="reFault" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-dashboard">
          <svg-icon icon-class="dashboard" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">漏检点数据</div>
          <count-to :start-val="0" :end-val="omit" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
    <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper icon-documentation">
          <svg-icon icon-class="documentation" class-name="card-panel-icon" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">停检点总数</div>
          <count-to :start-val="0" :end-val="stop" :duration="2000" class="card-panel-num" />
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<script>
import CountTo from 'vue-count-to'
import { getDashboardFourCount } from '@/api/dashboard'

export default {
  components: {
    CountTo
  },
  data() {
    return {
      abFault: null,
      reFault: null,
      omit: null,
      stop: null
    }
  },
  created() {
    getDashboardFourCount().then(response => {
      this.abFault = response.data.item_abnormal_count
      this.reFault = response.data.item_repaired_count
      this.omit = response.data.point_omit_count
      this.stop = response.data.point_stop_count
    })
  },
  methods: {
    viewItemLog(status) {
      this.$router.push({ path: '/example/itemLog', query: { status: status }})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.panel-group {

  .card-panel-col{
    margin-bottom: 32px;
  }
  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
    border-color: rgba(0, 0, 0, .05);
    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }
      .icon-clipboard {
         background: #40c9c6;
      }
      .icon-component {
        background: #36a3f7;
      }
      .icon-dashboard {
        background: #f4516c;
      }
      .icon-documentation {
        background: #34bfa3
      }
    }
    .icon-clipboard {
      color: #40c9c6;
    }
    .icon-component {
      color: #36a3f7;
    }
    .icon-dashboard {
      color: #f4516c;
    }
    .icon-documentation {
      color: #34bfa3
    }
    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }
    .card-panel-icon {
      float: left;
      font-size: 48px;
    }
    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;
      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }
      .card-panel-num {
        font-size: 20px;
      }
    }
  }
}
</style>
