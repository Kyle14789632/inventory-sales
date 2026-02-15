import { Center, Stack, Loader, Text } from "@mantine/core";

export default function TableLoading({ message = "Loading..." }) {
  return (
    <Center py="xl">
      <Stack align="center" gap="xs">
        <Loader size="sm" />
        <Text size="sm" c="dimmed">
          {message}
        </Text>
      </Stack>
    </Center>
  );
}
