export function convertExcelToJson(excelData) {
  const point = []
  var profession = ''
  var device = ''
  let pointSub = -1
  for (let i = 0; i < excelData.length; i++) {
    const line = excelData[i]
    if ('A' in line) {
      pointSub = pointSub + 1
      if (line.F) {
        profession = line.F
      } else {
        profession = ''
      }
      if (line.G) {
        device = line.G
      } else {
        device = ''
      }
      point.push({
        name: line.B,
        location: line.C,
        longitude: line.D,
        latitude: line.E,
        items: [{
          name: line.H,
          type: line.I,
          threshold: line.J,
          comparisonOperator: line.K,
          symbolUnit: line.L,
          cnUnit: line.M,
          device: device,
          profession: profession,
          desc: ''
        }]
      })
    } else if ('F' in line) {
      profession = line.F
      if (line.G) {
        device = line.G
      } else {
        device = ''
      }
      point[pointSub].items.push({
        name: line.H,
        type: line.I,
        threshold: line.J,
        comparisonOperator: line.K,
        symbolUnit: line.L,
        cnUnit: line.M,
        device: device,
        profession: profession,
        desc: ''
      })
    } else if ('G' in line) {
      device = line.G
      point[pointSub].items.push({
        name: line.H,
        type: line.I,
        threshold: line.J,
        comparisonOperator: line.K,
        symbolUnit: line.L,
        cnUnit: line.M,
        device: device,
        profession: profession,
        desc: ''
      })
    } else if ('H' in line) {
      point[pointSub].items.push({
        name: line.H,
        type: line.I,
        threshold: line.J,
        comparisonOperator: line.K,
        symbolUnit: line.L,
        cnUnit: line.M,
        device: device,
        profession: profession,
        desc: ''
      })
    }
  }
  return point
}

// 返回当前时间接口格式 年，月，日，时，分，秒
export function getCurTime() {
  var curtime = new Date()
  var curDate = curtime.getFullYear() + '-' + Number(curtime.getMonth() + 1) + '-' + curtime.getDate() + ' ' + curtime.getHours() + ':' + curtime.getMinutes() + ':' + curtime.getSeconds()
  return curDate
}

// 返回当时间， 年，月，日
export function getDate() {
  var curtime = new Date()
  var curDate = curtime.getFullYear() + '-' + Number(curtime.getMonth() + 1) + '-' + curtime.getDate()
  return curDate
}

// 选择框全选
export function allSelect(option, selected, key) {
  for (var i = 0; i < selected.length; i++) {
    if (key === undefined) {
      if (option.filter(item => item === selected[i]).length === 0) {
        option.push(selected[i])
      }
    } else {
      if (option.filter(item => item === selected[i][key]).length === 0) {
        option.push(selected[i][key])
      }
    }
  }
  return option
}

// js 对象按照某一属性值排序
export function compare(property) {
  return function(obj1, obj2) {
    var value1 = obj1[property]
    var value2 = obj2[property]
    return value1 - value2
  }
}
