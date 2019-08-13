<script>
  export let description

  import sanitizeHtml from 'sanitize-html'
  import {textToHtml} from '../utils/formatUtil'

  let descriptionForDisplay = ''
  $: descriptionForDisplay = textToHtml(sanitizeHtml(description))
</script>

<span>{@html descriptionForDisplay}</span>