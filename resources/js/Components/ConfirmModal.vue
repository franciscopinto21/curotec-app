<!-- resources/js/Components/ConfirmModal.vue -->
<template>
    <div
        class="modal fade"
        id="confirmModal"
        tabindex="-1"
        aria-labelledby="confirmModalLabel"
        aria-hidden="true"
        ref="modalElement"
    >
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="confirmModalLabel">
                        Confirm Deletion
                    </h5>
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                    ></button>
                </div>
                <div class="modal-body">
                    Are you sure you want to delete this task?
                </div>
                <div class="modal-footer">
                    <button
                        type="button"
                        class="btn btn-secondary"
                        data-bs-dismiss="modal"
                        @click="cancel"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        class="btn btn-danger"
                        @click="confirm"
                    >
                        Yes, Delete
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import * as bootstrap from "bootstrap";
import { ref, watch } from "vue";

const props = defineProps({
    taskId: Number,
    show: Boolean,
});

const emit = defineEmits(["confirm", "closed"]);

const modalElement = ref(null);

watch(
    () => props.show,
    (value) => {
        if (value && modalElement.value) {
            const modalInstance = new bootstrap.Modal(modalElement.value);

            // Exibe o modal
            modalInstance.show();

            // Garante que vamos emitir "closed" se ele for fechado de qualquer forma
            modalElement.value.addEventListener(
                "hidden.bs.modal",
                () => {
                    emit("closed");
                },
                { once: true }
            );
        }
    }
);

function confirm() {
    const modal = bootstrap.Modal.getInstance(modalElement.value);
    modal.hide();
    emit("confirm", props.taskId);
}

function cancel() {
    emit("closed");
}
</script>
