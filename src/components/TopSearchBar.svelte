<script>
	import { fade } from 'svelte/transition'
  import TimelineSearch from '../components/TimelineSearch'
  let y
  $: visible = y > 300
</script>

<style>
  top-search-bar {
    position: fixed;
    top: 0px;
    width: 100%;
    display: flex;
    justify-content: center;
    background: #FED826;
    padding: 4px;
  }
</style>

<svelte:window bind:scrollY={y} />
{#if visible}
  <top-search-bar transition:fade="{{ duration: 200 }}">
    <TimelineSearch manualEnter={true} />
  </top-search-bar>
{/if}