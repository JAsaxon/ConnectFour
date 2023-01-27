<script lang="ts">
  import { each, onMount } from "svelte/internal";
  import { fly } from "svelte/transition";
  import { io } from "socket.io-client";
  const socket = io("https://connectfourserver-2ucedebk7a-wn.a.run.app");
  import axios from "axios";
  let BoardArray = [];
  let player = 1;
  let maxHeight = [5, 5, 5, 5, 5, 5];
  let currentPlayer = "";
  socket.on("get", (board) => {
    BoardArray = board.board;
    maxHeight = board.maxHeight;
    currentPlayer = getColor(board.currentPlayer === 1 ? 2 : 1);
    console.log(maxHeight);
  });
  let ourPlayer = ""
  async function getPlayer(id) {
    const players = await axios.get("http://localhost:3000", {

    })
    const index = await players.data.arr.indexOf(id)
    console.log(index)
    ourPlayer = await getColor( index+1 ) === "blue" ? "red" : "blue"
    if(index === -1){
      location.reload()
    }
  }
  socket.on("connect", () => {
    const id = socket.id;
    getPlayer(id)
  });

  socket.on("end", () => {
    state.winner = null;
  });
  const horizontalCheck = [
    [0, 0],
    [0, 1],
    [0, 2],
    [0, 3],
  ];
  const verticalCheck = [
    [0, 0],
    [1, 1],
    [2, 2],
    [3, 3],
  ];
  const NegativeVerticalCheck = [
    [0, 0],
    [-1, 1],
    [-2, 2],
    [-3, 3],
  ];
  function getColor(num) {
    if (num === 0) {
      return "";
    }
    if (num === 1) {
      return "red";
    }
    if (num === 2) {
      return "blue";
    }
    return "nulle"
  }

  function handleClick(y, x) {
    if (maxHeight[y] !== -1) {
      player = (player % 2) + 1;
      socket.emit("move", [maxHeight[y], y, player, socket.id]);
      maxHeight[y] -= 1;
    }
  }
  const numberToName = {
    1: "Red",
    2: "Blue",
  };
  function checkWin(x, y) {
    let results = [];
    // Get neighbors
    let won;
    results[0] = horizontalCheck.map((offset) => {
      return BoardArray?.[x + offset[0]]?.[y + offset[1]] || 0;
    });

    results[1] = horizontalCheck.map((offset) => {
      return BoardArray?.[x + offset[1]]?.[y + offset[0]] || 0;
    });

    results[2] = verticalCheck.map((offset) => {
      return BoardArray?.[x + offset[1]]?.[y + offset[0]] || 0;
    });
    results[3] = NegativeVerticalCheck.map((offset) => {
      return BoardArray?.[x + offset[1]]?.[y + offset[0]] || 0;
    });
    results = results.map((arr) => {
      return arr.every((el) => el !== 0 && el === arr[0]);
    });
    won = results.some((el) => el !== false);
    if (won) {
      const winner = numberToName[BoardArray[x][y]];
      socket.emit("end", true);
      return winner;
    } else {
      return false;
    }
  }
  $: {
    if (BoardArray === undefined) {
      BoardArray = [
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0],
      ];
    }
    for (let x = 0; x < BoardArray.length; x++) {
      for (let y = 0; y < BoardArray[0].length; y++) {
        let win = checkWin(y, x);
        if (win !== false) {
          state.winner = win;
        }
      }
    }
  }
  let state = {
    draw: null,
    winner: null,
  };
  $: {
    console.log(state.winner);
  }
</script>
  {ourPlayer}
	{#if currentPlayer === ourPlayer}
	<h1>
	  Its your turn make a move
	</h1>
	{/if}
	{#if currentPlayer !== ourPlayer}
	  <h1>
	   Wait For the other player.
	  </h1>
	{/if}
<div class="board">
  {#each BoardArray as arr, y}
    <div class="row">
      {#each arr as el, x}
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <div class={`el ${getColor(el)}`} on:click={() => handleClick(y, x)} />
      {/each}
    </div>
  {/each}
</div>
{#if state.winner !== null}
  <h1 in:fly={{ x: -1200, duration: 1000 }}>
    <span class={state.winner}>{state.winner}</span>
    Won!
  </h1>
{/if}
