import { Container, Paper, Title } from "@mantine/core";

export default function AuthLayout({ children }) {
  return (
    <Container size={420} my={100}>
      <Title align="center" mb="lg">
        Inventory & Sales Management
      </Title>

      <Paper withBorder shadow="md" p="xl" radius="md">
        {children}
      </Paper>
    </Container>
  );
}
