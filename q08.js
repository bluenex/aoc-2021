const sample = `be cfbegad cbdgef fgaecd cgeb fdcge agebfd fecdb fabcd edb | fdgacbe cefdb cefbgd gcbe
edbfga begcd cbg gc gcadebf fbgde acbgfd abcde gfcbed gfec | fcgedb cgb dgebacf gc
fgaebd cg bdaec gdafb agbcfd gdcbef bgcad gfac gcb cdgabef | cg cg fdcagb cbg
fbegcd cbd adcefb dageb afcb bc aefdc ecdab fgdeca fcdbega | efabcd cedba gadfec cb
aecbfdg fbg gf bafeg dbefa fcge gcbea fcaegb dgceab fcbdga | gecf egdcabf bgf bfgea
fgeab ca afcebg bdacfeg cfaedg gcfdb baec bfadeg bafgc acf | gebdcfa ecba ca fadegcb
dbcfg fgd bdegcaf fgec aegbdf ecdfab fbedc dacgb gdcebf gf | cefg dcbef fcge gbcadfe
bdfegc cbegaf gecbf dfcage bdacg ed bedf ced adcbefg gebcd | ed bcgafe cdgba cbgef
egadfb cdbfeg cegd fecab cgb gbdefca cg fgcdab egfdb bfceg | gbdfcae bgc cg cgb
gcafb gcf dcaebfg ecagb gf abcdeg gaef cafbge fdbac fegbdc | fgae cfgab fg bagce
`

const runner = (data) => {
  const parsed = data.trim().split('\n')
  const signal = parsed.map(x => parseSignal(x))

  console.log({
    signal: signal[0],
    uniqueDigits
  })

  const q1 = q1runner(signal)
  const q2 = q2runner(signal)

  console.log()
  console.log({ q1, q2 })
}

module.exports = [runner, 'q08.txt']

// -- constants
const digitMap = {
  0: 'abcefg',
  1: 'cf',
  2: 'acdeg',
  3: 'acdfg',
  4: 'bcdf',
  5: 'abdfg',
  6: 'abdefg',
  7: 'acf',
  8: 'abcdefg',
  9: 'abcdfg',
}

const occurrenceMap = Object.entries(digitMap).map(([,v]) => v).reduce((acc, cur, ind, arr) => {
  const number = ind
  const countOccurrence = cur.split('').reduce((cAcc, cCur) => cAcc + arr.filter(y => y.includes(cCur)).length, 0)

  return {
    ...acc,
    [countOccurrence]: number,
  }
}, {})

const uniqueDigits = Object.entries(digitMap).reduce((acc, cur, ind, arr) => {
  const uniques = Object.values(arr).map(x => x[1].length).filter((x, ind, uarr) => ![...uarr.slice(0, ind), ...uarr.slice(ind + 1)].includes(x))

  if (uniques.includes(cur[1].length)) {
    return [...acc, cur]
  }

  return acc
}, [])

// -- functions
const parseSignal = (text) => {
  const [patterns, output] = text.split(' | ')
  return {
    patterns: patterns.split(' '),
    output: output.split(' '),
  }
}

const getOutputAsNumber = (entry) => {
  const { patterns, output } = entry

  const countOccurrence = output.map((x, ind) => {
    return x.split('').reduce((cAcc, cCur) => cAcc + patterns.filter(y => y.includes(cCur)).length, 0)
  })
  const mapped = countOccurrence.map((x) => occurrenceMap[x])

  return parseInt(mapped.join(''), 10)
}

const q1runner = (parsedSignal) => {
  let counter = 0
  const uniques = uniqueDigits.map(([, v]) => v.length)

  parsedSignal.forEach(({ output }) => {
    const count = output.filter(x => uniques.includes(x.length)).length

    counter += count
  })

  return counter
}

/** @description my head went blank after finish the first part,
 * had to scroll around looking for ideas and found this that reminds
 * me of uniqueness of 10 digits entry
 * 
 * @see https://www.reddit.com/r/adventofcode/comments/rbj87a/comment/hns8lcv/?utm_source=reddit&utm_medium=web2x&context=3
*/
const q2runner = (parsedSignal) => {
  const decoded = parsedSignal.map(entry => {
    return getOutputAsNumber(entry)
  })

  const sum = decoded.reduce((a, c) => a+c, 0)

  return sum
}