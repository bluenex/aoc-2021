const runner = (data) => {
  const parsed = data.trim().split('\n')
  const [rawDraw, ...rawBoards] = parsed
  const draws = rawDraw.split(',')

  const boards = rawBoards.reduce((acc, cur, ind) => {
    if (cur === '') {
      return [...acc, []]
    }

    const row = cur.trim().split(/\s+/)
    const last = acc[acc.length - 1]

    last.push(row)

    return [...acc.slice(0, -1), last]
  }, [])

  const checkMatchRound = (board, drawVal) => {
    let found = null;

    board.forEach((r, ind) => {
      const foundCol = r.indexOf(drawVal)

      if (foundCol >= 0) {
        found = [ind, foundCol]
      }
    })

    return found
  }

  const checkIfWin = (boardMatch) => {
    let winner = null
    let marked = boardMatch

    const counts = boardMatch.reduce((acc, cur, ind) => {
      const [cRow, cCol] = cur
      const { rowCount, colCount } = acc

      const updatedRowCount = (rowCount[cRow] || 0) + 1
      const updatedColCount = (colCount[cCol] || 0) + 1

      rowCount[cRow] = updatedRowCount
      colCount[cCol] = updatedColCount

      if (updatedRowCount === 5) {
        winner = [cRow]
      }
      if (updatedColCount === 5) {
        winner = [, cCol]
      }

      return {
        rowCount,
        colCount
      }
    }, { rowCount: {}, colCount: {} })

    return {
      ...counts,
      winner,
      marked,
    }
  }

  const removeMarked = (board, marked) => {
    const updatedBoard = board.reduce((acc, cur, ind) => {
      const markedOfRow = marked.filter(([r]) => Number(r) === ind)
      const markedCol = markedOfRow.map(([,c]) => Number(c))
      const updatedRow = cur.filter((_, ind) => !markedCol.includes(ind))

      return [...acc, ...updatedRow]
    }, [])

    return updatedBoard.map(x => Number(x))
  }

  const getMarked = (board, marked) => {
    const updatedBoard = board.reduce((acc, cur, ind) => {
      const markedOfRow = marked.filter(([r]) => Number(r) === ind)
      const markedCol = markedOfRow.map(([,c]) => Number(c))
      const updatedRow = cur.filter((_, ind) => markedCol.includes(ind))

      return [...acc, ...updatedRow]
    }, [])

    return updatedBoard.map(x => Number(x))
  }

  const drawMarked = (marked) => {
    const board = [
      Array.from({ length: 5 }).map(() => 'x'),
      Array.from({ length: 5 }).map(() => 'x'),
      Array.from({ length: 5 }).map(() => 'x'),
      Array.from({ length: 5 }).map(() => 'x'),
      Array.from({ length: 5 }).map(() => 'x'),
    ]

    const updatedBoard = board.reduce((acc, cur, ind) => {
      const markedOfRow = marked.filter(([r]) => Number(r) === ind)
      const markedCol = markedOfRow.map(([,c]) => Number(c))
      const updatedRow = cur.map((x, ind) => markedCol.includes(ind) ? 'O' : x)

      return [...acc, updatedRow]
    }, [])

    return updatedBoard
  }

  // ---- MAIN
  const results = {}
  let foundWinner = false
  // final answer variables
  /**
   * -- structure --
   * {
   *   round: null,
   *   boards: [
   *     {
   *       board: null,
   *       marked: null,
   *       lastFraw: null,
   *     }
   *   ],
   * }
   */
  let winnersIndex = []
  let lastWinner = {}
  let foundLastWinner = false
  // let winnerBoard
  // let winnerMarked
  // let lastDraw

  for (let i = 0; i < draws.length; i++) {
    const draw = draws[i]

    if (foundLastWinner) {
      console.log({ lastWinner })
      break
    }

    // console.log(`>>>> DRAW ROUND: ${i} GETS ${draw}`)

    for (let j = 0; j < boards.length; j++) {
      if (winnersIndex.length === boards.length) {
        foundLastWinner = true
        break
      }

      if (winnersIndex.includes(j)) {
        console.log(`BOARD ${j} has already won`)
        continue
      }

 
      // console.log(`  ---- AT BOARD: ${j}`)
      const board = boards[j]

      const roundChecked = checkMatchRound(board, draw)

      if (roundChecked) {
        results[j] = results[j] ? [...results[j], roundChecked] : [roundChecked]

        if (results[j] && results[j].length >= 5) {
          const winChecked = checkIfWin(results[j])

          // console.log(drawMarked(winChecked.marked))

          if (winChecked.winner) {
            // console.log(`FOUND WINNER AT BOARD ${j}!`)
            foundWinner = true
            winnersIndex.push(j)

            // calculate score
            const unmarked = removeMarked(board, winChecked.marked)
            const marked = getMarked(board, winChecked.marked)
            const sumUnmarked = unmarked.reduce((a,c) => a + c, 0)
            const finalScore = Number(draw) * sumUnmarked

            // const winnersObj = winners.find(x => x.round === i) || { round: i, boards: [] }
            const thisBoard = {
              board,
              // marked: winChecked.marked,
              marked: drawMarked(winChecked.marked),
              lastDraw: draw,
              finalScore,
            }
            // winnersObj.boards.push(thisBoard)
            lastWinner = thisBoard

            // console.log(`>>>> DRAW ROUND: ${i} GETS ${draw}`)
            // console.log(`  ---- AT BOARD: ${j}`)
            // console.log(`FOUND WINNER!`)

            // console.log({
            //   round: i,
            //   ...thisBoard
            //   // finalScore
            // })
          }
        }
      }

      // foundWinner = false
    }

    // if (i > 20) {
    //   break
    // }

    // console.log('\n========\n')
  }
  // ----

  // console.log({ 
  //   winners
  // })
}

module.exports = [runner, 'q04.txt']