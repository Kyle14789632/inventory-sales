import { Center, Stack, Text, Button } from "@mantine/core";
import { IconInbox } from "@tabler/icons-react";

export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}) {
  return (
    <Center py="xl">
      <Stack align="center" gap="xs">
        <IconInbox size={48} stroke={1.5} />
        <Text fw={600}>{title}</Text>
        <Text size="sm" c="dimmed" ta="center">
          {description}
        </Text>

        {actionLabel && (
          <Button mt="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Center>
  );
}
