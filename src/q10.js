let sample
// sample = `[({(<(())[]>[[{[]{<()<>>
// [(()[<>])]({[<{<<[]>>(
// {([(<{}[<>[]}>{[]{[(<()>
// (((({<>}<{<{<>}{[]{[]{}
// [[<[([]))<([[{}[[()]]]
// [{[{({}]{}}([{[{{{}}([]
// {<[[]]>}<{[{[{[]{()[[[]
// [<(<(<(<{}))><([]([]()
// <{([([[(<>()){}]>(<<{{
// <{([{{}}[<[[[<>{}]]]>[]]`

const runner = (data) => {
  const parsed = (sample || data).trim().split('\n')

  // console.log({ parsed })

  const q1 = q1runner(parsed)
  const q2 = q2runner(parsed)

  console.log()
  console.log({ q1, q2 })
}

module.exports = [runner, 'q10.txt']

// -- constants
const pairs = {
  open: ['(', '[', '{', '<'],
  close: [')', ']', '}', '>'],
}

const corruptedScore = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const completeScore = {
  ')': 1,
  ']': 2,
  '}': 3,
  '>': 4,
}

const illegalTypes = {
  incomplete: 'INCOMPLETE',
  corrupted: 'CORRUPTED',
}

// -- functions
const getPair = (lone) => {  
  const openInd = pairs.open.indexOf(lone)
  const closeInd = pairs.close.indexOf(lone)

  if (openInd >= 0) {
    return pairs.close[openInd]
  }

  return pairs.open[closeInd]
}

const isCorrectPair = (open, close) => {
  const openInd = pairs.open.indexOf(open)
  const closeInd = pairs.close.indexOf(close)

  return openInd === closeInd
}

const isIllegal = (chunks) => {
  const stack = []

  let illegalType = illegalTypes.incomplete
  let firstIllegalChar = null

  const splitChunks = chunks.split('')

  for (let i = 0; i < splitChunks.length; i++) {
    const curHalf = splitChunks[i]

    if (pairs.open.includes(curHalf)) {
      stack.push(curHalf)
    }

    if (pairs.close.includes(curHalf)) {
      const lastOpen = stack[stack.length - 1]
      const isPairCompleted = isCorrectPair(lastOpen, curHalf)

      if (!isPairCompleted) {
        // console.log(`Expected ${getPair(lastOpen)}, but found ${curHalf} instead.`)

        illegalType = illegalTypes.corrupted
        firstIllegalChar = curHalf
      }

      // pop the complete one out of stack
      stack.pop()
    }
  }

  return {
    chunks,
    type: illegalType,
    firstIllegalChar,
    finalStack: stack.join(''),
  }
}

// -- runners
const q1runner = (data) => {
  const illegalChecked = data.map(x => isIllegal(x))
  const illegalChars = illegalChecked.map(x => x.firstIllegalChar).filter(x => x)

  // console.log({ illegalChecked })

  return illegalChars.reduce((a,c) => a + corruptedScore[c], 0)
}

const q2runner = (data) => {
  const illegalChecked = data.map(x => isIllegal(x))
  const incompleteChunks = illegalChecked.filter(x => x.type === illegalTypes.incomplete)

  const completeAdded = incompleteChunks.map(x => {
    const complete = x.finalStack.split('').reverse().map(y => getPair(y)).join('')

    return {
      ...x,
      complete,
    }
  })

  const allScores = completeAdded.reduce((a,c) => {
    const scoreFactor = 5

    const thisChunkScore = c.complete.split('').reduce((aa, cc) => (aa * scoreFactor) + completeScore[cc], 0)

    return [...a, thisChunkScore]
  }, []).sort((a,b) => a - b)

  console.log({ allScores })

  return allScores[Math.floor(allScores.length / 2)]
}

/**
 * [({(<(())[]>[[{[]{<()<>> - Complete by adding }}]])})].
 * [(()[<>])]({[<{<<[]>>( - Complete by adding )}>]}).
 * (((({<>}<{<{<>}{[]{[]{} - Complete by adding }}>}>)))).
 * {<[[]]>}<{[{[{[]{()[[[] - Complete by adding ]]}}]}]}>.
 * <{([{{}}[<[[[<>{}]]]>[]] - Complete by adding ])}>.
 */