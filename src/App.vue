<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <title>Grocery Database</title>
    <div class="wrapper">
      <nav>
        <RouterLink to="/table">Table</RouterLink>
        <RouterLink to="/scanner">Scanner</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

title {
  display: block;
  text-align: center;
  font-size:2.5rem;
  font-weight:700;
  margin: 0 auto 2rem;
  background-color: var(--accent-green);
  border-radius: 20px;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
  background-color: var(--accent-green);
}

nav a.router-link-exact-active {
  color: var(--font-color);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}
/* Horizontal Display */
@media (min-width: 1024px) {
title {
  margin: 0px;
}
nav {

}
nav a {
  padding: .75rem;
}
}
</style>
