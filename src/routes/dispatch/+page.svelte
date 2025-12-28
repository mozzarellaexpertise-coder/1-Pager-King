<script lang="ts">
  import { enhance } from '$app/forms';
  let { data, form } = $props(); // Svelte 5 syntax
</script>

<h1>📟 Pager Dispatch Center</h1>

{#if form?.success}
  <p style="color: green;">✅ Message sent successfully!</p>
{/if}

{#if form?.error}
  <p style="color: red;">❌ {form.error}</p>
{/if}

<form method="POST" use:enhance>
  <div class="field">
    <label for="to_user">Select Recipient:</label>
    <select name="to_user" id="to_user" required>
      <option value="">-- Choose a user --</option>
      {#each data.profiles as profile}
        <option value={profile.id}>{profile.display_name ?? 'Unnamed User'}</option>
      {/each}
    </select>
  </div>

  <div class="field">
    <label for="message">Alert Message:</label>
    <textarea name="message" id="message" required rows="4" placeholder="Emergency alert details..."></textarea>
  </div>

  <button type="submit">Broadcast Page</button>
</form>

<style>
  .field { margin-bottom: 1rem; display: flex; flex-direction: column; }
  label { font-weight: bold; margin-bottom: 0.5rem; }
  select, textarea { padding: 0.5rem; font-size: 1rem; border-radius: 4px; }
  button { padding: 0.75rem; background: #3b82f6; color: white; border: none; cursor: pointer; }
</style>