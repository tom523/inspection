<template>
  <div class="app-container">
    <div id="allmap" style="height:660px" />
  </div>
</template>

<script>

export default {
  filters: {
  },
  data() {
    return {
      value1: '',
      activeProfessionCnName: '',
      activeTeamCnName: '',
      activeNameTwo: 'first',
      professions: [],
      meterItemLogs: [],
      teams: [],
      checkpoints: [],
      turns: [],
      normalItemLogs: [],
      companyId: '',
      cpDialogTableVisible: false,
      info: '',
      activeTeamId: '',
      demo: '',
      tnt: ''
    }
  },
  computed: {
  },
  created() {
  },
  mounted() {
    // 百度地图API功能
    // var lng='';
    // var lat='';
    var map = new window.BMap.Map('allmap') // 创建地图实例
    var point = new window.BMap.Point(120.304195, 31.569868) // 创建点坐标
    // 缩放地图
    map.enableScrollWheelZoom() // 启用滚轮放大缩小，默认禁用
    map.enableContinuousZoom() // 启用地图惯性拖拽，默认禁用
    map.centerAndZoom(point, 15)
    // 编写自定义函数,创建标注
    function addMarker(point) {
      var marker = new window.BMap.Marker(point)
      map.addOverlay(marker)
    }
    // 随机向地图添加25个标注
    var bounds = map.getBounds()
    var sw = bounds.getSouthWest()
    var ne = bounds.getNorthEast()
    var lngSpan = Math.abs(sw.lng - ne.lng)
    var latSpan = Math.abs(ne.lat - sw.lat)
    for (var i = 0; i < 25; i++) {
      point = new window.BMap.Point(sw.lng + lngSpan * (Math.random() * 0.7), ne.lat - latSpan * (Math.random() * 0.7))
      addMarker(point)
    }
  },
  methods: {
  }
}
</script>

<style>
  .box-card {
    width: 280px;
  }
  .el-step__head:hover {
    color: #67c23a;
    border-color: #67c23a;
  }
  .el-row {
    margin-bottom: 20px;
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>
