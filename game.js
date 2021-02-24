const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})
const mem = {
  player: 1,
  names: {},
  board: {
    a: [0, 0, 0],
    b: [0, 0, 0],
    c: [0, 0, 0],
  },
  moves: 0,
};
const changePlayer = () => {
  mem.player = mem.player === 2 ? 1 : 2;
}

const colorizeTextPlayer = (text, player) => {
  return `\x1b[3${player === 1 ? 5 : 6}m${text}\x1b[0m`
}

const ask1Name = () => {
  rl.question(`What is your name, ${colorizeTextPlayer('player 1', 1)}? \n`, (answer) => {
    mem.names[1] = answer;
    console.log();
    console.log(`Response accepted, ${answer}. Charmed, I'm sure.`, '\n');
    setTimeout(ask2Name, 300);
  })
}

const displayBoard = () => {
  const formatRow = (row) => (
    JSON.stringify(row).slice(1, 6).split(',').map((num) => displayLetter(Number(num))).join(' | ').concat(' :')
  )
  const displayLetter = (num) => {
    if (num === 0) {
      return ' ';
    }
    return num === 1 ? ('\x1b[35m' + 'X' + '\x1b[0m') : '\x1b[36m' + 'O' + '\x1b[0m';
  }
  const { a, b, c } = mem.board;
  console.log();
  console.log('        1   2   3');
  console.log('      .............');
  console.log(`    a : ${formatRow(a)}`);
  console.log('      : --------- :')
  console.log(`    b : ${formatRow(b)}`);
  console.log('      : --------- :')
  console.log(`    c : ${formatRow(c)}`);
  console.log('      .............');
  console.log();
}

const ask2Name = () => {
  rl.question(`And what should I call you, ${colorizeTextPlayer('player 2', 2)}? \n `, (answer) => {
    mem.names[2] = answer;
    console.log(`... if that is truly your preference, I shall refer to you as '${answer}'.`);
    console.log('now, let us get down to the task at hand.', '\n');
    console.log('Here is your board:', '\n')
    promptMove();
  })
}

const explainGameplay = () => {  console.log("\x1b[32m");
  console.log(`To play, specify the row and column where you'd like to place your piece.`);
  console.log(`responding "a1" will mark the space in the top left corner of the board.`);
  console.log(`"c2" would mark the middle space in the bottom row.`);
  console.log("\x1b[0m");
}

const promptMove = () => {
  displayBoard();
  const { player, moves } = mem;
  if (moves < 1) {
    explainGameplay();
  }
  const name = mem.names[player];
  rl.question(`What is your move, ${colorizeTextPlayer(name, player)}? \n`, (answer) => {
    handleInput(answer)
  })
}

const handleInput = (input) => {
  const rc = input.split('');
  const row = rc[0];
  const col = (Number(rc[1]) - 1);
  const validRow = (['a', 'b', 'c'].indexOf(row) !== -1);
  const validCol = (col % 1 === 0 && col >= 0 && col <= 2);
  let { board, player } = mem;
  if (validRow && validCol) {
    if (board[row][col] !== 0) {
      repeatInput();
    } else {
      board[row][col] = player;
      mem.moves ++;
      if (mem.moves === 9) {
        displayBoard();
        rl.close();
      } else {
        changePlayer();
        promptMove();
      }
    }
  } else {
    badInput(input.length);
  }
}
const repeatInput = () => {
  console.log();
  console.log("\x1b[31m", 'That space is already filled!');
  console.log("\x1b[33m", 'Please try again.', "\x1b[0m")
  promptMove();
}

const badInput = (l) => {
  console.log("\x1b[31m");
  if (l <= 2) {
    console.log(`Hm. I couldn't quite understand that.`)
  } else if (l <= 20) {
    console.log(`Huh?`)
    console.log(`Let's keep it nice and simple now.`)
  } else {
    console.log(`This is not a good place to practice your essay writing skills.`)
  }
  setTimeout(() => {
    console.log('respond with something like')
    console.log("\x1b[33m")
    console.log(        'a2')
    console.log("\x1b[31m")
    console.log(        'or')
    console.log("\x1b[33m")
    console.log(        'c1')
    console.log("\x1b[0m");
    setTimeout(promptMove, 2000);
  }, 300);
}

ask1Name();

// console.log('Thanks for playing, weirdo!', "\x1b[0m")