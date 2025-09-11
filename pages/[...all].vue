<script setup lang="ts">
// This page is intentionally left blank for the 404 page.
</script>

<template>
  <div class="not-found-container">
    <icon name="carbon:warning-alt" class="icon" />
    <h1>{{ $t('notFound.title') }}</h1>
    <p>{{ $t('notFound.description') }}</p>
    <NuxtLink to="/" class="home-link">
      {{ $t('notFound.goHome') }}
    </NuxtLink>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 80vh;
  text-align: center;
  font-family: "Roboto", sans-serif;
}

.icon {
  font-size: 6rem; /* 96px */
  color: #ef4444; /* A shade of red */
  margin-bottom: 1.5rem; /* 24px */
}

h1 {
  font-size: 2.5rem; /* 40px */
  font-weight: bold;
  margin-bottom: 1rem; /* 16px */
}

p {
  font-size: 1.125rem; /* 18px */
  color: #555;
  margin-bottom: 2.5rem; /* 40px */
}

.home-link {
  display: inline-block;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  background-color: #007bff;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  transition: background-color 0.2s ease-in-out, transform 0.2s ease-in-out;
}

.home-link:hover {
  background-color: #0056b3;
  transform: translateY(-2px);
}
</style>
