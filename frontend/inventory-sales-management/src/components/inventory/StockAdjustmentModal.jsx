import {
  Modal,
  Select,
  NumberInput,
  Textarea,
  Button,
  Stack,
  Text,
} from "@mantine/core";
import { useState } from "react";

export default function StockAdjustmentModal({
  opened,
  onClose,
  product,
  onSubmit,
  submitting,
}) {
  const [type, setType] = useState("IN");
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState("");

  const reset = () => {
    setType("IN");
    setQuantity(1);
    setReason("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={`Adjust Stock — ${product?.name || ""}`}
      centered
    >
      <Stack>
        <Text size="sm" c="dimmed">
          Manual adjustments affect inventory immediately.
        </Text>

        <Select
          label="Adjustment type"
          data={[
            { value: "IN", label: "Add stock" },
            { value: "OUT", label: "Remove stock" },
          ]}
          value={type}
          onChange={setType}
          required
        />

        <NumberInput
          label="Quantity"
          min={1}
          value={quantity}
          onChange={setQuantity}
          required
        />

        <Textarea
          label="Reason"
          placeholder="Required for audit trail"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <Button
          color={type === "OUT" ? "red" : "blue"}
          loading={submitting}
          disabled={!reason || !quantity}
          onClick={() =>
            onSubmit({
              productId: product.id,
              type,
              quantity,
              note: reason,
            })
          }
        >
          Confirm Adjustment
        </Button>
      </Stack>
    </Modal>
  );
}
