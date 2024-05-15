<script setup>
import { RouterLink, RouterView } from 'vue-router'

</script>

<script>
// A prototype object for an item
export const itemPrototype = {
	code: "000000000000",
	given_name: "name",
	off_name: "name",
	number: "0",
	allergens: [],
	tags: [],
	favorite: false
}
</script>

<template>
	<header>
		<div class="title">Grocery Database</div>
		<div class="wrapper">
			<nav>
				<RouterLink to="/">Table</RouterLink>
				<RouterLink to="/scanner">Scanner</RouterLink>
			</nav>
		</div>
	</header>
	<Suspense>
		<RouterView />
	</Suspense>
</template>

<style scoped>
header {
	display: flex;
	width: 100%;
	line-height: 1.5;
	background-color: var(--accent-green);
	align-items: center;
}

.title {
	margin: 0 1rem;
	text-align: center;
	font-size: 2rem;
	font-weight: 700;
}

nav {
	font-size: 1rem;
	text-align: center;
	max-height: max-content;
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

	/* nav {

} */
	nav a {
		padding: .75rem;
	}
}
</style>
