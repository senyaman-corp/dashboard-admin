<template>
  <component
    :is="to ? NuxtLink : 'button'"
    :to="to ? to : undefined"
    :class="['btn', `btn-${size}`, `btn-${variant}`, { 'btn-block': block }]"
    :type="to ? undefined : type"
    :disabled="!to && disabled"
  >
    <slot />
  </component>
</template>

<script setup>
import { NuxtLink } from "#components";

defineProps({
  variant: { type: String, default: "primary" },
  type: { type: String, default: "button" },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  to: { type: String, default: null },
  size: { type: String, default: "md" },
});
</script>
