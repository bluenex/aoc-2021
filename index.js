/*
Thanks for using Replit for Advent of Code!

Here are a few tips:

1. To install packages, just import them and Replit will install them for you, or click on the cube in the sidebar to install manually.
2. If you're stuck, try using the debugger in the sidebar shaped like a play/pause button.
3. When you're done, you can share your project by clicking the project name and then "Publish"
3.a When you share your project, use the #adventofcode hashtag!

4. Have fun, and good luck!
*/

const fs = require('fs')

const [runner, dataFileName] = require('./src/q11')

/*
Place your question data into the data.txt file.
You may need to parse the data!
*/
const data = fs.readFileSync(`./data/${dataFileName}`, 'utf8')

console.time("Elapsed time")

runner(data)

console.timeEnd('Elapsed time');

// q1-1
// q1-2
// q2-1
// q2-2
// q3-1
// q3-2