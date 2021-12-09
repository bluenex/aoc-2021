const runner = (data) => {
  const parsed = data.trim().split('\n')
  const vFactor = {
    up: -1,
    down: 1,
  }

  /**
   * hPos -> horizontal position
   * vPos -> vertical position -> aim in the question
   * depth -> hPos * vPos
   */
  const reduced = parsed.reduce((acc, cur) => {
    const [operation, unit] = cur.split(' ')
    const parsedUnit = parseInt(unit, 10)

    if (operation === 'forward') {
      const newHPos = acc.hPos + parsedUnit

      return { ...acc, hPos: newHPos, depth: acc.depth + (parsedUnit * acc.vPos) }
    } else {
      return { ...acc, vPos: acc.vPos + (parsedUnit * vFactor[operation])}
    }
  }, { hPos: 0, vPos: 0, depth: 0 })

  console.log({ reduced, result: reduced.hPos * reduced.depth })
}

module.exports = [runner, 'q02.txt']

/**
 * forward 5 adds 5 to your horizontal position, a total of 5. Because your aim is 0, your depth does not change.
 * down 5 adds 5 to your aim, resulting in a value of 5.
 * forward 8 adds 8 to your horizontal position, a total of 13. Because your aim is 5, your depth increases by 8*5=40.
 * up 3 decreases your aim by 3, resulting in a value of 2.
 * down 8 adds 8 to your aim, resulting in a value of 10.
 * forward 2 adds 2 to your horizontal position, a total of 15. Because your aim is 10, your depth increases by 2*10=20 to a total of 60.
 * 
 * 
 * f 0+5 a 0+5 d 0
 * f 5 a 5 d 0
 * f 5+8 a 5 d 8*5
 * f 13 a 5-3 d 40
 * f 13 d 2+8 d 40
 * f 13+2 d 10 d 2*10
 */