<template>
  <form @submit.prevent="$emit('submit', model)">
    <slot />
  </form>
</template>

<script setup>
defineEmits(["submit"]);
</script>