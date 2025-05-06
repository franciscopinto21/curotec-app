import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { createApp, h } from "vue";
import { createInertiaApp } from "@inertiajs/inertia-vue3";
import { createPinia } from "pinia";
import "toastr/build/toastr.min.css";
import toastr from "toastr";

window.toastr = toastr;

toastr.options = {
    positionClass: "toast-top-right",
    newestOnTop: true,
    progressBar: true,
    closeButton: true,
    timeOut: 3000,
    offset: 40,
};

// Dynamically import all Vue components located under /Pages using Vite's glob import feature
const pages = import.meta.glob("./Pages/**/*.vue");

createInertiaApp({
    // Resolve each page component by its name (e.g., 'Home' will resolve to './Pages/Home.vue')
    resolve: async (name) => {
        const component = await pages[`./Pages/${name}.vue`]();
        return component.default;
    },

    // Core setup function for mounting the Vue + Inertia application
    setup({ el, App, props, plugin }) {
        const pinia = createPinia();

        // Create the Vue application, inject Inertia plugin and Pinia store, then mount it to the DOM
        createApp({ render: () => h(App, props) })
            .use(plugin)
            .use(pinia)
            .mount(el);
    },
});
