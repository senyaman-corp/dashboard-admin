<template>
  <div>
    <Navbar />
    <client-only>
      <Sidebar />
    </client-only>
    <div class="main-content">
      <div class="page-content">
        <div class="container-fluid">
          <NuxtPage />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style></style>
