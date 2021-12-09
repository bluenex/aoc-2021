const sample = `16,1,2,0,4,2,7,1,2,14`

const runner = (data) => {
  const parsed = data.trim()
  const crabs = parseCrab(parsed)

  // console.log({
  //   median1: median1(crabs),
  //   median2: median2(crabs)
  // })

  const q1 = brute1(crabs)
  const q2 = brute2(crabs)

  console.log()
  console.log({ q1, q2 })
}

module.exports = [runner, 'q07.txt']

// -- functions
const parseCrab = raw => raw.split(',').map(x => Number(x)).sort((a,b) => a-b)

const calculateFuel1 = (crabs, target) => crabs.reduce((a,c) => a + Math.abs(c - target), 0)

const brute1 = data => {
  const maxPosition = data[data.length - 1]
  const allFuels = Array.from({ length: maxPosition }).map((_, ind) => calculateFuel1(data, ind))
  const lowestCost = allFuels[allFuels.indexOf(Math.min(...allFuels))]

  return lowestCost
}

// https://github.com/EnisBerk/adventofcode/blob/master/day7/tools.py
const median1 = data => {
  const point = data[Math.floor(data.length / 2)]

  return calculateFuel1(data, point)
}

/**
 * @see https://letstalkscience.ca/educational-resources/backgrounders/gauss-summation
 */
const gaussSum = (n) => (n * (n+1)) / 2

const calculateFuel2 = (crabs, target) => crabs.reduce((a,c) => a + gaussSum(Math.abs(c - target)), 0)

const brute2 = data => {
  const maxPosition = data[data.length - 1]
  const allFuels = Array.from({ length: maxPosition }).map((_, ind) => calculateFuel2(data, ind))
  const lowestCost = allFuels[allFuels.indexOf(Math.min(...allFuels))]

  return lowestCost
}

const median2 = data => {
  const point = data[Math.floor(data.length / 2)]
  let initialFuel = calculateFuel2(data, point)

  data.forEach((_, ind) => {
    const thisFuel = calculateFuel2(data, ind)

    if (thisFuel < initialFuel) {
      initialFuel = thisFuel
    }
  })

  return initialFuel
}