<template>
</template>

<script>
  export default {
    middleware({ store, route, redirect }) {
      const uuid = store.getters['auth/uuidUser'];
      return redirect(`/social/account/${uuid}`);
    }
  }
</script>

<style>

</style>