<template>
  <div class="dashboard-editor-container">
    <panel-group />
    <el-row style="height: auto; background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <el-col :span="12" style="padding:16px 16px 0;margin-bottom:32px;">
        <Recent-Dutylog />
      </el-col>
      <el-col :span="12" style="padding:16px 16px 0;margin-bottom:32px;">
        <Pie-chart :chart-data="statusData" />
      </el-col>
    </el-row>
    <el-row>
      <el-col style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <ABfault-chart :chart-data="ABchartData" />
      </el-col>
    </el-row>
    <el-row>
      <el-col style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <REfault-chart :chart-data="REchartData" />
      </el-col>
    </el-row>
    <el-row class="box">
      <el-col style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <STpoint-chart :chart-data="STchartData" />
      </el-col>
    </el-row>
    <el-row>
      <el-col style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
        <OMpoint-chart :chart-data="OMchartData" />
      </el-col>
    </el-row>
    <!--     <el-card>
      <el-row>
        <el-col :span="number">
          <stop />
        </el-col>
        <el-col :span="number">
          <omit />
        </el-col>
      </el-row>
    </el-card> -->
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import ABfaultChart from './components/faultABchart'
import REfaultChart from './components/faultREchart'
import STpointChart from './components/pointSTchart'
import OMpointChart from './components/pointOMchart'
import RecentDutylog from './components/RecentDutylog'
import PieChart from './components/PieChart'
import { getDashboardCount } from '@/api/dashboard'
import { getDayPointCount } from '@/api/photoAndDaily'
export default {
  name: 'DashboardAdmin',
  components: {
    PanelGroup,
    ABfaultChart,
    REfaultChart,
    OMpointChart,
    STpointChart,
    RecentDutylog,
    PieChart
  },
  data() {
    return {
      ABchartData: {
        data: [],
        dateList: []
      },
      REchartData: {
        data: [],
        dateList: []
      },
      OMchartData: {
        data: [],
        dateList: []
      },
      STchartData: {
        data: [],
        dateList: []
      },
      statusData: {}
      // lineChartDataAll: {},

    }
  },
  created() {
    this.fetchData()
  },

  methods: {
    fetchData() {
      getDashboardCount().then(response => {
        this.ABchartData.dateList = response.data.date_list
        this.ABchartData.data = response.data.fault_item_abnormal_count
        this.REchartData.dateList = response.data.date_list
        this.REchartData.data = response.data.fault_item_repaired_count
        this.STchartData.dateList = response.data.date_list
        this.STchartData.data = response.data.point_stop_count
        this.OMchartData.dateList = response.data.date_list
        this.OMchartData.data = response.data.point_omit_count
      })
      getDayPointCount().then(response => {
        this.statusData = {
          title: '巡检状态统计图',
          legend_data: response.data.map(item => { return item.name }),
          series_data: response.data
        }
      })
    }
  //   handleSetLineChartData(type) {
  //     this.lineChartData = this.lineCharDataAll[type]
  //     this.genChartDate = this.lineChartDataAll[type]
  //     this.meterChartDate = this.lineChartDataAll[type]
  //     this.missedChartDate = this.lineChartDataAll[type]
  //     this.stopChartDate = this.lineChartDataAll[type]
  //     console.log(this.stopChartDate)
  //   }
  // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .box {
    display: flex;
  };
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
