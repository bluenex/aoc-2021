const sample = `2199943210
3987894921
9856789892
8767896789
9899965678`

const runner = (data) => {
  const parsed = data.trim().split('\n').map(x => x.split('').map(x => Number(x)))

  // console.log({ parsed })

  const q1 = q1runner(parsed)
  const q2 = q2runner(parsed)

  console.log()
  console.log({ q1, q2 })
}

module.exports = [runner, 'q09.txt']

// -- constants
// -- functions
const getDimensions = (data) => {
  const col = data && data[0] ? data[0].length : null
  const row = data ? data.length : null

  return [row, col]
}

const inBoundary = (coord, dimensions) => {
  const [maxY, maxX] = dimensions
  const [row, col] = coord

  if ((row >= 0 && row < maxY) && (col >= 0 && col < maxX)) {
    return true
  }

  return false
}

const getAdjacentCoords = (coord, dimensions) => {
  const [row, col] = coord

  // [0, 0] => [-1, 0], [1, 0], [0, 1], [0, -1]
  const left = [row, col - 1]
  const right = [row, col + 1]
  const up = [row - 1, col]
  const down = [row + 1, col]

  return [left, right, up, down].filter(x => inBoundary(x, dimensions))
}

const getValues = (data, coords) => {
  return coords.map(([row, col]) => data[row][col])
}

const sumRiskLevel = (lowPoints) => {
  return lowPoints.reduce((a, c) => a + c + 1, 0)
}

const scoutBasin = (data, coord, basin = []) => {
  const dim = getDimensions(data)

  const [row, col] = coord
  const exist = basin.find(([r, c]) => r === row && c === col)

  if (inBoundary(coord, dim) && !exist) {

    const curVal = data[row][col]

    if (curVal < 9) {
      basin.push(coord)

      const adjs = getAdjacentCoords(coord, dim)

      adjs.forEach((co) => {
        return scoutBasin(data, co, basin)
      })
    }
  }

  return basin
}

// -- runners
const q1runner = (data) => {
  let lowPoints = []
  const dim = getDimensions(data)

  data.forEach((row, rowInd) => {
    row.forEach((col, colInd) => {
      const curVal = col
      const adjs = getValues(data, getAdjacentCoords([rowInd, colInd], dim))

      if (curVal < 9 && Math.min(...adjs, curVal) === curVal) {
        lowPoints.push(curVal)
      }
    })
  })

  // console.log({ lowPoints })

  return sumRiskLevel(lowPoints)
}

const q2runner = (data) => {
  let lowPointCoords = []
  const dim = getDimensions(data)

  data.forEach((row, rowInd) => {
    row.forEach((col, colInd) => {
      const curVal = col
      const adjs = getValues(data, getAdjacentCoords([rowInd, colInd], dim))

      if (curVal < 9 && Math.min(...adjs, curVal) === curVal) {
        lowPointCoords.push([rowInd, colInd])
      }
    })
  })

  const basins = lowPointCoords
    .map(lpCoord => scoutBasin(data, lpCoord))
    .map(vals => getValues(data, vals))

  const basinLengths = basins.map(x => x.length).sort((a, b) => b - a)
  const topThree = basinLengths.slice(0, 3)

  return topThree.reduce((a, c) => a * c, 1)
}