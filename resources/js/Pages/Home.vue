<template>
    <div class="d-flex flex-column min-vh-100">
        <Header />

        <main class="flex-grow-1 container py-4">
            <h1 class="mb-4 fw-bold">Welcome to the Task Manager App</h1>
            <p class="mb-4 lead text-muted">
                Manage your tasks efficiently using Laravel 10, Vue 3,
                Inertia.js, and Bootstrap.
            </p>
            <a href="/tasks" class="btn btn-primary btn-lg"> Go to Tasks </a>
        </main>

        <Footer />
    </div>
</template>

<script setup>
import Header from "@/Components/Header.vue";
import Footer from "@/Components/Footer.vue";
</script>
