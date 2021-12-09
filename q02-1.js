const runner = (data) => {
  const parsed = data.trim().split('\n')
  const vFactor = {
    up: -1,
    down: 1,
  }

  const reduced = parsed.reduce((acc, cur) => {
    const [operation, unit] = cur.split(' ')
    const parsedUnit = parseInt(unit, 10)

    if (operation === 'forward') {
      return { ...acc, hPos: acc.hPos + parsedUnit }
    } else {
      return { ...acc, vPos: acc.vPos + (parsedUnit * vFactor[operation])}
    }
  }, { hPos: 0, vPos: 0 })

  console.log({ reduced, result: reduced.hPos * reduced.vPos })
}

module.exports = [runner, 'q02.txt']