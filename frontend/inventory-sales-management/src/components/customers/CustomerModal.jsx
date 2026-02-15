import { Modal, TextInput, Button, Stack } from "@mantine/core";
import { useEffect } from "react";
import { useCustomerMutations } from "../../hooks/customers/useCustomerMutations";
import { useCustomerForm } from "../../hooks/customers/useCustomerForm";

export default function CustomerModal({ opened, onClose, customer }) {
  const isEdit = Boolean(customer);
  const { createMutation, updateMutation } = useCustomerMutations();

  const form = useCustomerForm({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  useEffect(() => {
    if (customer) {
      form.setValues({
        name: customer.name || "",
        phone: customer.phone || "",
        email: customer.email || "",
        address: customer.address || "",
      });
    } else {
      form.reset();
    }
  }, [customer]);

  const handleSubmit = (values) => {
    if (isEdit) {
      updateMutation.mutate({
        id: customer.id,
        payload: values,
      });
    } else {
      createMutation.mutate(values);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? "Edit Customer" : "Add Customer"}
      centered
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput label="Name" required {...form.getInputProps("name")} />

          <TextInput label="Phone" {...form.getInputProps("phone")} />

          <TextInput label="Email" {...form.getInputProps("email")} />

          <TextInput label="Address" {...form.getInputProps("address")} />

          <Button
            type="submit"
            loading={createMutation.isPending || updateMutation.isPending}
          >
            {isEdit ? "Update" : "Create"}
          </Button>
        </Stack>
      </form>
    </Modal>
  );
}
