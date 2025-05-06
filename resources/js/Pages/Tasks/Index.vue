<template>
    <div class="d-flex flex-column min-vh-100">
        <Header />

        <main class="flex-grow-1 container py-4">
            <div class="row">
                <!-- Form -->
                <div class="col-12 col-lg-3 mb-4">
                    <h4 class="mb-3">
                        {{ editingId ? "Edit Task" : "New Task" }}
                    </h4>

                    <div
                        v-if="$page.props.flash?.success"
                        class="alert alert-success"
                    >
                        {{ $page.props.flash.success }}
                    </div>

                    <form @submit.prevent="submitTask">
                        <div class="mb-3">
                            <input
                                v-model="form.title"
                                type="text"
                                class="form-control"
                                placeholder="Task title"
                            />
                            <div
                                v-if="form.errors.title"
                                class="text-danger small mt-1"
                            >
                                {{ form.errors.title }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <textarea
                                v-model="form.description"
                                class="form-control"
                                placeholder="Task description"
                            ></textarea>
                            <div
                                v-if="form.errors.description"
                                class="text-danger small mt-1"
                            >
                                {{ form.errors.description }}
                            </div>
                        </div>

                        <button
                            type="submit"
                            class="btn btn-primary w-100"
                            :disabled="form.processing"
                        >
                            <span
                                v-if="form.processing"
                                class="spinner-border spinner-border-sm me-2"
                            ></span>
                            {{ editingId ? "Update Task" : "Add Task" }}
                        </button>

                        <button
                            v-if="editingId"
                            type="button"
                            class="btn btn-secondary mt-2 w-100"
                            @click="cancelEdit"
                            :disabled="form.processing"
                        >
                            Cancel Edit
                        </button>
                    </form>
                </div>

                <!-- Table -->
                <div class="col-12 col-lg-9">
                    <h4 class="mb-3">Task List</h4>

                    <table
                        class="table table-bordered table-hover align-middle"
                    >
                        <thead class="table-light">
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Status</th>
                                <th class="text-end">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="task in tasks" :key="task.id">
                                <td>{{ task.title }}</td>
                                <td>{{ task.description }}</td>
                                <td>
                                    <span
                                        :class="
                                            task.completed
                                                ? 'text-success'
                                                : 'text-muted'
                                        "
                                    >
                                        {{
                                            task.completed
                                                ? "✔ Done"
                                                : "⏳ Pending"
                                        }}
                                    </span>
                                </td>
                                <td class="text-end">
                                    <button
                                        class="btn btn-sm btn-outline-success me-2"
                                        @click="toggleStatus(task)"
                                        :disabled="isLoading(task.id, 'toggle')"
                                    >
                                        <span
                                            v-if="isLoading(task.id, 'toggle')"
                                            class="spinner-border spinner-border-sm me-1"
                                        ></span>
                                        {{
                                            task.completed
                                                ? "Mark as Pending"
                                                : "Mark as Done"
                                        }}
                                    </button>

                                    <button
                                        class="btn btn-sm btn-outline-primary me-2"
                                        @click="startEdit(task)"
                                        :disabled="form.processing"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        class="btn btn-sm btn-outline-danger"
                                        @click="askDelete(task.id)"
                                        :disabled="isLoading(task.id, 'delete')"
                                    >
                                        <span
                                            v-if="isLoading(task.id, 'delete')"
                                            class="spinner-border spinner-border-sm me-1"
                                        ></span>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
        <ConfirmModal
            :taskId="taskToDelete"
            :show="showModal"
            @confirm="confirmDelete"
            @closed="closeModal"
        />

        <Footer />
    </div>
</template>

<script setup>
import Header from "@/Components/Header.vue";
import Footer from "@/Components/Footer.vue";
import ConfirmModal from "@/Components/ConfirmModal.vue";
import { useForm } from "@inertiajs/inertia-vue3";
import { Inertia } from "@inertiajs/inertia";
import { ref } from "vue";

// Props received from Laravel backend
defineProps({
    tasks: Array,
});

// Reactive form object managed by Inertia
const form = useForm({
    title: "",
    description: "",
    completed: false,
});

// Track whether we're editing an existing task
const editingId = ref(null);

// Track which task is currently triggering an async action (for button spinners)
const loadingAction = ref(null);

// Utility: show spinner only on the matching task and action type
function isLoading(id, type) {
    if (type === "toggle" || type === "delete") {
        return (
            loadingAction.value &&
            loadingAction.value.id === id &&
            loadingAction.value.type === type
        );
    }

    return form.processing;
}

// === Modal Delete ===
const showModal = ref(false);
const taskToDelete = ref(null);

// Open the modal and store the task ID
function askDelete(id) {
    taskToDelete.value = id;
    showModal.value = true;
}

// Callback fired from modal after confirm
function confirmDelete(id) {
    showModal.value = false;
    deleteTask(id);
}

// Ensure state is clean if user closes modal any other way
function closeModal() {
    showModal.value = false;
    loadingAction.value = null;
}

// Delete a task using POST with method spoofing
function deleteTask(id) {
    loadingAction.value = { id, type: "delete" };

    Inertia.post(
        `/tasks/${id}`,
        { _method: "delete" },
        {
            onSuccess: () => {
                toastr.success("Task deleted successfully.");
            },
            onFinish: () => {
                loadingAction.value = null;
            },
        }
    );
}

// === Create / Update Task ===
function submitTask() {
    if (editingId.value) {
        // Update task using method spoofing
        Inertia.post(
            `/tasks/${editingId.value}`,
            {
                _method: "put",
                ...form.data(),
            },
            {
                onSuccess: () => {
                    toastr.success("Task updated successfully.");
                    form.reset();
                    editingId.value = null;
                },
            }
        );
    } else {
        // Create new task
        form.post("/tasks", {
            onSuccess: () => {
                toastr.success("Task created successfully.");
                form.reset();
            },
        });
    }
}

// === Edit Mode Handling ===
function startEdit(task) {
    form.title = task.title;
    form.description = task.description;
    form.completed = task.completed;
    editingId.value = task.id;
}

// Cancel edit and reset form
function cancelEdit() {
    form.reset();
    editingId.value = null;
}

// Toggle task status (Done <-> Pending) using POST with _method spoofing
function toggleStatus(task) {
    loadingAction.value = { id: task.id, type: "toggle" };

    Inertia.post(
        `/tasks/${task.id}`,
        {
            _method: "put",
            title: task.title,
            description: task.description,
            completed: !task.completed,
        },
        {
            onFinish: () => {
                loadingAction.value = null;
            },
        }
    );
}
</script>
