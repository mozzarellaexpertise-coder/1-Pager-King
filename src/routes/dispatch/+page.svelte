<script lang="ts">
  import { enhance } from '$app/forms';
  export let data; // Contains profiles from our load function
</script>

<h1>Pager Dispatch</h1>

<form method="POST" use:enhance>
  <label>
    Recipient:
    <select name="to_user" required>
      {#each data.profiles as profile}
        <option value={profile.id}>{profile.display_name ?? 'Unknown'}</option>
      {/each}
    </select>
  </label>

  <label>
    Message:
    <textarea name="message" required placeholder="Type urgent alert..."></textarea>
  </label>

  <button type="submit">Send Page</button>
</form>