const runner = (data) => {
  const parsed = data.trim().split('\n')
  const windowSize = 3

  const reduced = parsed.reduce((acc, cur, ind, arr) => {
    return [...acc, Number(cur) + Number(arr[ind+1]) + Number(arr[ind+2])]
  }, [])

  const checked = reduced.reduce((acc, cur) => {
    if (!acc.prev) {
      return { ...acc, prev: cur }
    }

    if (Number(acc.prev) < Number(cur)) {
      return { ...acc, prev: cur, inc: acc.inc + 1 }
    }

    return { ...acc, prev: cur }
  }, { prev: undefined, inc: 0 })

  console.log({ reduced, checked })
}

module.exports = [runner, 'q01.txt']