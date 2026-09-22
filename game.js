

const START_MAP = [
  "##########",
  "#........#",
  "#.##..##.#",
  "#........#",
  "#.##..##.#",
  "#........#",
  "#.##..##.#",
  "#........#",
  "#........#",
  "##########",
];


let grid, pac, ghost, score;




function init() {
  grid  = START_MAP.map(row => row.split(""));  
  pac   = { r: 1, c: 1 };
  ghost = { r: 8, c: 8 };
  score = 0;
  msg("Arrow keys to move");
  draw();
}



function draw() {

  const display = grid.map(row => [...row]);

  display[pac.r][pac.c]     = "C";   
  display[ghost.r][ghost.c] = "G";   


  document.getElementById("board").textContent =
    display.map(row => row.join("")).join("\n");
}




document.addEventListener("keydown", function(e) {
  const moves = {
    ArrowUp:    { r: -1, c:  0 },
    ArrowDown:  { r:  1, c:  0 },
    ArrowLeft:  { r:  0, c: -1 },
    ArrowRight: { r:  0, c:  1 },
  };

  const move = moves[e.key];
  if (!move) return;                         

  const newR = pac.r + move.r;
  const newC = pac.c + move.c;

  if (grid[newR][newC] === "#") return;       

  pac.r = newR;
  pac.c = newC;

  if (grid[pac.r][pac.c] === ".") {          
    grid[pac.r][pac.c] = " ";               
    score++;
  }

  check();
  draw();
});




setInterval(function() {
  const nextStep = bfs(ghost, pac);   // ask BFS: what's the next step?
  if (nextStep) {
    ghost.r = nextStep.r;
    ghost.c = nextStep.c;
  }
  check();
  draw();
}, 600);

// BFS: finds the shortest path from `start` to `target`
// Returns the first step ghost should take, or null if no path
function bfs(start, target) {
  const queue   = [{ r: start.r, c: start.c, firstStep: null }];
  const visited = new Set();
  visited.add(start.r + "," + start.c);

  const dirs = [[-1,0],[1,0],[0,-1],[0,1]];

  while (queue.length > 0) {
    const curr = queue.shift();   // take the front of the queue

    for (const [dr, dc] of dirs) {
      const nr = curr.r + dr;
      const nc = curr.c + dc;
      const key = nr + "," + nc;

      if (grid[nr][nc] === "#") continue;   // skip walls
      if (visited.has(key))    continue;   // skip already visited

      visited.add(key);

      // The first step is the direction taken from the start cell
      const firstStep = curr.firstStep || { r: nr, c: nc };

      if (nr === target.r && nc === target.c) {
        return firstStep;   // found pac-man! return the first step
      }

      queue.push({ r: nr, c: nc, firstStep });
    }
  }

  return null;  // no path found
}




function check() {
  if (pac.r === ghost.r && pac.c === ghost.c) {
    msg(" Ghost got you!  Score: " + score);
  }

  const dotsLeft = grid.flat().filter(cell => cell === ".").length;
  if (dotsLeft === 0) {
    msg("You win!");
  }
}

function msg(text) {
  document.getElementById("msg").textContent = text;
}



init();
