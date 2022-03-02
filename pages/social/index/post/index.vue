<template>
  <div class="container">
    <h1>Post index</h1>
     <pre>{{ $route.fullPath }}</pre>
  </div>
</template>

<script>
export default {
  middleware({ store, redirect }) {
    redirect('/social')
  }
}
</script>
