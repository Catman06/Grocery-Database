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
  font-size:2.5rem;
  font-weight:700;
  margin: 0 auto 2rem;
  background-color: 
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
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
