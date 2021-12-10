let sample
sample = ``

const runner = (data) => {
  const parsed = (sample || data).trim()

  console.log({ parsed })

  const q1 = q1runner()
  const q2 = q2runner()

  console.log()
  console.log({ q1, q2 })
}

module.exports = [runner, 'qxx.txt']

// -- constants
// -- functions
// -- runners
const q1runner = () => {
  return null
}

const q2runner = () => {
  return null
}