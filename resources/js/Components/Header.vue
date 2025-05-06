<template>
    <nav class="navbar navbar-expand-md navbar-dark bg-dark px-4">
        <a class="navbar-brand" href="#">TaskApp</a>

        <!-- Toggle button for mobile -->
        <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#mainNavbar"
            aria-controls="mainNavbar"
            aria-expanded="false"
            aria-label="Toggle navigation"
        >
            <span class="navbar-toggler-icon"></span>
        </button>

        <!-- Collapsible content -->
        <div class="collapse navbar-collapse" id="mainNavbar">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                    <Link class="nav-link" href="/">Home</Link>
                </li>
                <li class="nav-item">
                    <Link class="nav-link" href="/tasks">Tasks</Link>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script setup>
import { Link } from "@inertiajs/inertia-vue3";
</script>
