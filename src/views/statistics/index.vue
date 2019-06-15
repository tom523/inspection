<template>
  <div class="dashboard-editor-container">
    <div style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span style="margin-left: 75%">选择专业</span>
      <el-select v-model="dutyLogProfessions" placeholder="请选择" clearable>
        <el-option
          v-for="item in professions"
          :key="item.id"
          :label="item.related_professions"
          :value="item.related_professions"
        />
      </el-select>
      <bar-chart :chart-data="dutyData" />
    </div>
    <div style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span style="margin-left: 75%">选择专业</span>
      <el-select v-model="turnProfessions" placeholder="请选择" clearable>
        <el-option
          v-for="item in professions"
          :key="item.id"
          :label="item.related_professions"
          :value="item.related_professions"
        />
      </el-select>
      <bar-chart :chart-data="turnData" />
    </div>
    <div style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <span style="margin-left: 75%">选择专业</span>
      <el-select v-model="staffProfessions" placeholder="请选择" clearable>
        <el-option
          v-for="item in professions"
          :key="item.id"
          :label="item.related_professions"
          :value="item.related_professions"
        />
      </el-select>
      <bar-chart :chart-data="staffData" />
    </div>
    <!-- <el-row >
      <div id="linear" style="width:100%; height:350px; " />

    </el-row> -->
    <!--     <div class="block" style="width:100%; height:60px;padding:8px 8px 0;background:#fff; margin-bottom:5px; ">
      <span class="demonstration">选择专业</span>
      <el-select v-model="formData.profession" placeholder="请选择" value-key="id" @change="handleSelectProfession(formData)">
        <el-option
          v-for="item in professions"
          :key="item.id"
          :label="item.cnName"
          :value="item.id"/>
      </el-select>
      <span class="demonstration">时间</span>
      <el-select v-model="formData.days" placeholder="请选择" value-key="id" @change="handleSelectProfession(formData)">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
    </div> -->
    <!--     <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div id="bargraph" style="width:100%; height:450px; " />
      <bar-chart :chart-data="turnData"/>
    </el-row> -->

    <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <div id="bargraph" style="width:100%; height:450px; " />
      <bar-chart :chart-data="staffData"/>
    </el-row> -->
  </div>
</template>

<script>
// import echarts from 'echarts'
import BarChart from './components/BarChart'
// import LineChart from './components/LineChart'
import { getRelatedTurnProfession, getStaffTimeConsumed, getTurnLogTimeConsumed, getDutyLogTimeConsumed } from '@/api/misc'
// import { getCurTime, getAnyTime } from '@/utils/tool'
export default {
  name: 'Insreport',
  components: {
    BarChart
    // LineChart
  },

  data() {
    return {
      dutyData: {},
      turnData: {},
      staffData: {},
      workingSchedule: {
        startEndDate: null
      },
      insreportStart: null,
      insreportEnd: null,
      professionId: '',
      // teams: [],
      dutyDate__gte: null,
      dutyDate__lte: null,
      formData: {
        profession: null,
        days: null
      },
      options: [{
        value: '3',
        label: '3天'
      }, {
        value: '5',
        label: '5天'
      }, {
        value: '7',
        label: '7天'
      }],
      // temp: {
      //   id: '',
      //   cnName: '',
      //   profession: {},
      //   isValid: true,
      //   team: {},
      //   reviewTeam: {}
      // },
      professions: [],
      dutyLogProfessions: null,
      turnProfessions: null,
      staffProfessions: null
    }
  },
  watch: {
    dutyLogProfessions: function() {
      getDutyLogTimeConsumed({ related_professions: this.dutyLogProfessions }).then(response => {
        this.dutyData = {
          title: '班次巡检时长统计',
          xAxis: response.data.duty_log_statistic.map(item => { return item.name }),
          series: [{
            name: '班次统计',
            type: 'bar',
            data: response.data.duty_log_statistic.map(item => { return item.time_consumed / 60 })
          }]
        }
      })
    },
    turnProfessions: function() {
      getTurnLogTimeConsumed({ related_professions: this.turnProfessions }).then(response => {
        this.turnData = {
          title: '轮次巡检时长统计',
          xAxis: response.data.turn_log_statistic.map(item => { return item.plan_start_time }),
          series: [{
            name: '轮次统计',
            type: 'bar',
            data: response.data.turn_log_statistic.map(item => { return item.time_consumed / 60 })
          }]
        }
      })
    },
    staffProfessions: function() {
      getStaffTimeConsumed({ related_professions: this.staffProfessions }).then(response => {
        this.staffData = {
          title: '员工巡检时长统计',
          xAxis: response.data.staff_time_statistic.map(item => { return item.name }),
          series: [{
            name: '员工统计',
            type: 'bar',
            data: response.data.staff_time_statistic.map(item => { return item.time_consumed / 60 })
          }]
        }
      })
    }
  },
  created() {
    // barStart = new Date()
    // barEnd = new Date()
    // barEnd.setTime(barEnd.getTime() - 3600 * 1000 * 24 * 7)
    // console.log(barStart)
    // console.log(barEnd)
    this.fetchData()
  },
  mounted() {
  },
  methods: {
    fetchData() {
      getRelatedTurnProfession().then(response => {
        this.professions = response.data
        this.dutyLogProfessions = this.professions[0].related_professions
        this.turnProfessions = this.professions[0].related_professions
        this.staffProfessions = this.professions[0].related_professions
      })
    //   getStatisticData().then(res => {
    //     const duty_log_statistic = res.data.duty_log_statistic
    //     const turn_log_statistic = res.data.turn_log_statistic
    //     const staff_time_statistic = res.data.staff_time_statistic
    //     this.dutyData = {
    //       title: '班次巡检时长统计',
    //       xAxis: duty_log_statistic.map(item => {return item.name + '|'
    //         + item.related_professions + '|'
    //         + item.related_team + '|' + item.start_time}),
    //       // xAxis: duty_log_statistic.map(item => {return item.name + '|'
    //       //   + item.related_professions + '|'
    //       //   + item.related_team + '|' + item.start_time}),
    //       series: [{
    //         name: '班次统计',
    //         type: 'bar',
    //         data: duty_log_statistic.map(item => {return item.time_consumed})
    //       }],
    //       team: '班次统计'
    //     }
    //     this.turnData = {
    //       title: '轮次巡检时长统计',
    //       xAxis: turn_log_statistic.map(item => {return item.plan_start_time}),
    //       // xAxis: turn_log_statistic.map(item => {return item.name + '|'
    //       //   + item.related_professions + '|'
    //       //   + item.duty_log__name + '|' + item.plan_start_time}),
    //       series: [{
    //         name: '轮次统计',
    //         type: 'bar',
    //         data: duty_log_statistic.map(item => {return item.time_consumed})
    //       }],
    //       team: '轮次统计'
    //     }
    //     this.staffData = {
    //       title: '员工巡检时长统计',
    //       xAxis: staff_time_statistic.map(item => {return item.name}),
    //       // xAxis: turn_log_statistic.map(item => {return item.name + '|'
    //       //   + item.related_professions + '|'
    //       //   + item.duty_log__name + '|' + item.plan_start_time}),
    //       series: [{
    //         name: '员工统计',
    //         type: 'bar',
    //         data: staff_time_statistic.map(item => {return item.time_consumed})
    //       }],
    //       team: '员工统计'
    //     }
    //   })
    // }
    // handleSelectProfession(value) {
    //   // this.professionId = value.id
    //   // const params = {
    //   //   profession: this.professionId,
    //   //   days: 3
    //   // }
    //   this.getTeam(value)
    //   // this.getProfession({ days: 7 })
    // },
    // getTeam(params) {
    //   getTeamData(params).then(response => {
    //     this.barChartData = response
    //   })
    // },
    // getProfession(params) {
    //   getProfessionData(params).then(response => {
    //     this.lineChartData = response
    //   })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}
</style>
