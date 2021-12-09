const runner = (data) => {
  const parsed = data.trim().split('\n')

  const reduced = parsed.reduce((acc, cur) => {
    if (!acc.prev) {
      return { ...acc, prev: cur }
    }

    if (Number(acc.prev) < Number(cur)) {
      return { ...acc, prev: cur, inc: acc.inc + 1 }
    }

    return { ...acc, prev: cur }
  }, { prev: undefined, inc: 0 })

  console.log({ reduced })
}

module.exports = [runner, 'q01.txt']