const sample = `0,9 -> 5,9
8,0 -> 0,8
9,4 -> 3,4
2,2 -> 2,1
7,0 -> 7,4
6,4 -> 2,0
0,9 -> 2,9
3,4 -> 1,4
0,0 -> 8,8
5,5 -> 8,2`

const runner = (data) => {
  const parsed = data.trim().split('\n')
  const lines = parsed.map(x => parseLine(x))
  const hvlines = lines.filter(x => getLineType(x) === 'horizontal' || getLineType(x) === 'vertical')
  const maxCoords = getMaxCoords(lines)

  const q1MinifiedPath = draw({
    maxCoords,
    lines: hvlines,
    log: false,
  })

  const q2MinifiedPath = draw({
    maxCoords,
    lines,
    log: false,
  })

  const q1 = q1MinifiedPath.reduce((acc, cur) => typeof cur === 'number' && cur >= 2 ? acc + 1 : acc, 0)
  const q2 = q2MinifiedPath.reduce((acc, cur) => typeof cur === 'number' && cur >= 2 ? acc + 1 : acc, 0)

  console.log({ q1, q2 })
}

module.exports = [runner, 'q05.txt']

// -- functions
const parseLine = (string) => {
  const [rStart, rEnd] = string.split(' -> ')
  const start = rStart.split(',').map(x => Number(x))
  const end = rEnd.split(',').map(x => Number(x))
  const line = [start, end]

  return line
}

const getLineType = (line) => {
  const [start, end] = line

  const [x1, y1] = start
  const [x2, y2] = end

  if (y1 === y2) {
    return 'horizontal'
  }

  if (x1 === x2) {
    return 'vertical'
  }

  // 45 degrees diagonal
  // abs(x1-x2) === abs(y1-y2)
  if (Math.abs(x1-x2) === Math.abs(y1-y2)) {
    return 'diagonal'
  }

  return null
}

const getMaxCoords = (lines) => {
  return lines.reduce((acc, cur) => {
    const [start, end] = cur
    const [x1, y1] = start
    const [x2, y2] = end
    
    const updatedX = Math.max(x1, x2, acc.maxX)
    const updatedY = Math.max(y1, y2, acc.maxY)

    return {
      maxX: updatedX,
      maxY: updatedY,
    }
  }, { maxX: 0, maxY: 0 })
}

const transposeDiagonalLine = (line) => {
  const [start, end] = line
  const [x1, y1] = start
  const [x2, y2] = end

  // x1-x2 = y1-y2 = length
  const length = Math.abs(x1-x2) + 1
  const xop = x1 > x2 ? -1 : 1
  const yop = y1 > y2 ? -1 : 1
  
  const x = Array.from({ length }).map((_, ind) => x1 + (xop * ind))
  const y = Array.from({ length }).map((_, ind) => y1 + (yop * ind))

  return { x, y }
}

const draw = ({ maxCoords, lines, log }) => {
  const { maxX, maxY } = maxCoords
  const row = Array.from({ length: maxX + 1 }).map(() => '.')
  let canvas = Array.from({ length: maxY + 1 }).map(() => row)

  if (lines) {
    lines.forEach((line, lineInd) => {
      process.stdout.write(`processing line: ${lineInd} ..\r`)

      const lineType = getLineType(line)
      const [start, end] = line
      const [x1, y1] = start
      const [x2, y2] = end

      if (lineType === 'horizontal') {
        // loop along x (y1 = y2 = y)
        canvas = canvas.reduce((acc, cur, rowInd) => {
          if (rowInd === y1) {
            return [
              ...acc,
              cur.map((x, colInd) => {
                if (
                  (colInd >= x1 && colInd <= x2)
                  || (colInd >= x2 && colInd <= x1)
                ) {
                  return typeof x === 'number' ? x + 1 : 1
                }
                return x
              }),
            ]
          }

          return [...acc, cur]
        }, [])
      }
      if (lineType === 'vertical') {
        // loop along y (x1 = x2 = x)
        canvas = canvas.reduce((acc, cur, rowInd) => {
          if (
            (rowInd >= y1 && rowInd <= y2)
            || (rowInd >= y2 && rowInd <= y1)
          ) {
            return [
              ...acc,
              cur.map((x, colInd) => {
                if (colInd === x1) {
                  return typeof x === 'number' ? x + 1 : 1
                }
                return x
              }),
            ]
          }

          return [...acc, cur]
        }, [])
      }
      if (lineType === 'diagonal') {
        const diagCoords = transposeDiagonalLine(line)
        const { x: diagCols, y: diagRows } = diagCoords

        canvas = canvas.reduce((acc, cur, rowInd) => {
          const matchInd = diagRows.indexOf(rowInd)

          if (matchInd >= 0) {
            return [
              ...acc,
              cur.map((x, colInd) => {
                if (colInd === diagCols[matchInd]) {
                  return typeof x === 'number' ? x + 1 : 1
                }
                return x
              }),
            ]
          }

          return [...acc, cur]
        }, [])
      }
    })

    console.log('')
  }

  const asString = canvas.reduce((acc, cur) => {
    const row = cur.join(' ')

    return `${acc}\n${row}`
  }, '')

  if (!!log) {
    console.log(`${asString}\n`)
  }

  return canvas.flat()
}