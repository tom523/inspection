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
