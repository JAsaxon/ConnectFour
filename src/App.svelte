<script lang="ts">
  import svelteLogo from './assets/svelte.svg'
  import Counter from './lib/Counter.svelte'
  import BoardLogic from "./lib/BoardLogic.svelte"
</script>

<main>
  <div class="title">
    <h1>Connect Four!</h1>
    <h2>Beat Your Friends!</h2>
  </div>
 <BoardLogic/>
</main>

