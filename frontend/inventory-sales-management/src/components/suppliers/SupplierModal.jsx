import { Modal } from "@mantine/core";
import SupplierForm from "./SupplierForm";

export default function SupplierModal({
  opened,
  onClose,
  initialValues,
  onSubmit,
  submitting,
  isEdit,
}) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit supplier" : "Add supplier"}
      centered
    >
      <SupplierForm
        initialValues={initialValues}
        submitting={submitting}
        submitLabel={isEdit ? "Update supplier" : "Save supplier"}
        onSubmit={onSubmit}
      />
    </Modal>
  );
}
