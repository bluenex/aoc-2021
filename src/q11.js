let sample
// sample = `5483143223
// 2745854711
// 5264556173
// 6141336146
// 6357385478
// 4167524645
// 2176841721
// 6882881134
// 4846848554
// 5283751526`

const runner = (data) => {
  const parsed = (sample || data).trim().split('\n').map(x => x.split('').map(y => Number(y)))

  // console.log({ parsed })

  const q1 = q1runner(parsed)
  const q2 = q2runner(parsed)

  console.log()
  console.log({ q1, q2 })
}

module.exports = [runner, 'q11.txt']

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
  // [-1, -1], [-1, 1], [1, -1], [1, 1]
  const left = [row, col - 1]
  const right = [row, col + 1]
  const up = [row - 1, col]
  const down = [row + 1, col]
  const topLeft = [row - 1, col - 1]
  const topRight = [row - 1, col + 1]
  const bottomLeft = [row + 1, col - 1]
  const bottomRight = [row + 1, col + 1]

  return [topLeft, up, topRight, left, right, bottomLeft, down, bottomRight].filter(x => inBoundary(x, dimensions))
}

const getValues = (data, coords) => {
  return coords.map(([row, col]) => data[row][col])
}

const getPointId = (point) => {
  return JSON.stringify(point)
}

const stepUpdate = (data, totalFlashed = []) => {
  // clone data
  const updatedData = data.map(r => ([...r]))
  // a collection of flashed id => [row,col] as string
  const thisStepFlashed = []

  // update normally
  for (let rowInd = 0; rowInd < updatedData.length; rowInd++) {
    for (let colInd = 0; colInd < updatedData[rowInd].length; colInd++) {
      const thisPoint = updatedData[rowInd][colInd]
      const thisPointId = getPointId([rowInd, colInd])
      
      updatedData[rowInd][colInd] += 1

      if (updatedData[rowInd][colInd] > 9 && !thisStepFlashed.includes(thisPointId)) {
        thisStepFlashed.push(thisPointId)
        adjacentsUpdate([rowInd, colInd], updatedData, thisStepFlashed)
      }
    } 
  }

  // reset energy
  const nextRoundData = updatedData.map(r => r.map(c => c > 9 ? 0 : c))

  totalFlashed.push(thisStepFlashed)

  return [nextRoundData, totalFlashed]
}

// should be recursive
const adjacentsUpdate = (coord, data, thisStepFlashed) => {
  const dim = getDimensions(data)
  const adjacents = getAdjacentCoords(coord, dim)

  for (let i = 0; i < adjacents.length; i++) {
    const [rowInd, colInd] = adjacents[i]
    const thisPoint = data[rowInd][colInd]
    const thisPointId = getPointId([rowInd, colInd])

    data[rowInd][colInd] += 1

    if (data[rowInd][colInd] > 9 && !thisStepFlashed.includes(thisPointId)) {
      thisStepFlashed.push(thisPointId)
      adjacentsUpdate(adjacents[i], data, thisStepFlashed)
    }
  }
}

const draw = (data) => {
  const asString = data.map(x => x.join(' ')).reduce((a,c) => `${a}${c}\n`, '')

  console.log(`\n\n${asString}`)
}

// -- runners
const q1runner = (data) => {
  const dim = getDimensions(data)
  const steps = 100

  let currentData = data
  let totalFlashed = []

  Array.from({ length: steps }).forEach((_, ind) => {
    [currentData, totalFlashed] = stepUpdate(currentData, totalFlashed)

    // console.log({ ind, totalFlashed })
    // draw(currentData)
  })

  return totalFlashed.reduce((a,c) => a + c.length, 0)
}

const q2runner = (data) => {
  const dim = getDimensions(data)
  let counter = 0
  let found = false

  let currentData = data
  let totalFlashed = []

  while (!found) {
    [currentData, totalFlashed] = stepUpdate(currentData, totalFlashed)

    const lastFlashedCount = totalFlashed[totalFlashed.length - 1].length

    if (lastFlashedCount === dim[0] * dim[1]) {
      found = true
    }

    counter += 1
  }

  return counter
}

/**
After step 1:
6594254334
3856965822
6375667284
7252447257
7468496589
5278635756
3287952832
7993992245
5957959665
6394862637

After step 2:
8807476555
5089087054
8597889608
8485769600
8700908800
6600088989
6800005943
0000007456
9000000876
8700006848

After step 3:
0050900866
8500800575
9900000039
9700000041
9935080063
7712300000
7911250009
2211130000
0421125000
0021119000
 */