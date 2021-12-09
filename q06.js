const sample = `3,4,3,1,2`

const runner = (data) => {
  const parsed = data.trim()
  const initial = parseFish(parsed)

  // // this is a straight forward (brute-forced to be exact) method
  // // to visualize just like an example
  // // only works with small set of data or days
  // visualize(parseFish(sample.trim()), 18)

  // // more efficiency method
  // finder({
  //   initial: parseFish(sample.trim()),
  //   days: 18,
  //   log: false,
  // })

  const q1 = finder({
    initial,
    days: 80,
  })
  const q2 = finder({
    initial,
    days: 256,
  })

  console.log()
  console.log({ q1, q2 })
}

module.exports = [runner, 'q06.txt']

// -- functions
const parseFish = raw => raw.split(',').map(x => Number(x))

const updateTimer = fishes => {
  const updated = fishes.reduce((acc, cur) => {
    return {
      fishes: [...acc.fishes, cur === 0 ? 6 : cur - 1],
      toBeBorn: cur === 1 ? acc.toBeBorn + 1 : acc.toBeBorn
    }
  }, { fishes: [], toBeBorn: 0 })

  return updated
}

const countFishes = fishes => {
  return fishes.length
}

const draw = days => {
  days.forEach(({ fishes }, ind) => {
    if (ind === 0) {
      console.log(`Initial state: ${fishes.join(',')} => ${countFishes(fishes)}`)
      return
    }

    console.log(`After ${String(ind).length === 1 ? ` ${ind}` : ind} days: ${fishes.join(',')} => ${countFishes(fishes)}`)
  })
}

// for visualizing only small data
const visualize = (initial, days) => {
  const memo = Array.from({ length: days + 1 }).reduce((acc, _, ind) => {
    process.stdout.write(`running day: ${ind} ..\r`)

    if (ind === 0) {
      return acc
    }

    const { fishes, toBeBorn } = acc[ind - 1]
    const updated = updateTimer(fishes)

    if (toBeBorn > 0) {
      for (let j = 0; j < toBeBorn; j++) {
        updated.fishes.push(8)
      }
    }

    return [
      ...acc,
      updated,
    ]
  }, [
    {
      fishes: initial,
      toBeBorn: 0,
    }
  ])

  console.log('\n')
  draw(memo)
}

// 8
// 7
// 6
// 5
// 4
// 3
// 2
// 1
// 0
/**
 * @see with the help from https://www.reddit.com/r/adventofcode/comments/r9z49j/2021_day_6_solutions/hngl60u/?utm_source=reddit&utm_medium=web2x&context=3
 */
const finder = ({ initial, days, log }) => {
  const existings = {
    0:0, 1:0, 2:0, 3:0, 4:0,
    5:0, 6:0, 7:0, 8:0,
  }

  const existingLength = Object.keys(existings).length

  // set initial value
  initial.forEach((x) => existings[x] += 1)

  // loop through days
  Array.from({ length: days }).forEach((_, day) => {
    let toBeProduced

    for (let i = 0; i < existingLength; i++) {
      if (i === 0) {
        // to be produced next round is all the 0 day fishes
        toBeProduced = existings[0]
        // these fishes will be 6 next round
        existings[7] += existings[0]
        // skip this round
        continue
      }

      existings[i - 1] = existings[i]
    }
    existings[8] = toBeProduced

    if (log) {
      console.log(`day ${day + 1} => ${Object.values(existings).reduce((a,c) => a+c, 0)}`)
    }
  })

  if (log) {
    console.log()
    console.log({ existings })
  }

  return Object.values(existings).reduce((a,c) => a+c, 0)
}
