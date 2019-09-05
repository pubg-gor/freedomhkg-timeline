
<script>
  import { onMount } from 'svelte'
  import * as sapper from '@sapper/app'
  import { DateTime } from 'luxon'
  import { createEvent } from '../../services/eventService'

  let formData = {
    description: 'first custom event!',
    date: DateTime.local().toISODate(),
    hour: DateTime.local().toFormat('HH'),
    minute: DateTime.local().toFormat('mm')
  }
  const handleSubmit = async () => {
    console.log('submiteed form data', formData)
    await createEvent(formData)
    sapper.goto('/')
  }

  onMount(async () => {
    console.log('create event')
    await createEvent({ a: 1 })
  })

</script>

<style>
  form {
    display: flex;
    flex-direction: column;
  }
  form-item {
    margin-top: 16px;
    display: flex;
  }
  form-label {
    vertical-align: top;
    width: 120px;
  }
  .submitButton {
    margin-top: 16px;
  }
</style>

<svelte:head>
	<title>Add event</title>
</svelte:head>

<h2>Create event</h2>

<form on:submit|preventDefault={handleSubmit}>

<form-item>
  <form-label>date: </form-label>
  <input type='date' bind:value={formData.date} />
</form-item>

<form-item>
  <form-label>time: </form-label>
  <input type='number' max={23} min={0} bind:value={formData.hour} /> :
  <input type='number' max={59} min={0} bind:value={formData.minute} />
</form-item>

<form-item>
  <form-label>description: </form-label>
  <textarea cols={70} rows={10} bind:value={formData.description} placeholder="write something"></textarea>
</form-item>

<input class='submitButton' type='submit' value='Submit' />

</form>

