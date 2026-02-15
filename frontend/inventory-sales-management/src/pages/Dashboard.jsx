import {
  Grid,
  Card,
  Text,
  Table,
  Badge,
  Group,
  ThemeIcon,
} from "@mantine/core";
import { useDashboardReport } from "../hooks/reports/useDashboardReport";
import TableLoading from "../components/TableLoading";
import {
  IconCalendarMonth,
  IconCalendarWeek,
  IconTrendingUp,
} from "@tabler/icons-react";

export default function Dashboard() {
  const { data, isLoading } = useDashboardReport();

  if (isLoading) return <TableLoading message="Loading dashboard..." />;

  const { lowStock, salesSummary, topProducts } = data;

  return (
    <>
      <Grid mb="lg">
        {/* Daily Sales */}
        <Grid.Col span={4}>
          <Card withBorder radius="md" padding="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="sm" c="dimmed">
                  Daily Sales
                </Text>
                <Text fw={700} size="xl">
                  {salesSummary.daily}
                </Text>
              </div>

              <ThemeIcon variant="light" color="green" size="lg" radius="md">
                <IconTrendingUp size={18} />
              </ThemeIcon>
            </Group>

            <Text size="xs" c="green" mt="sm">
              +12% compared to yesterday
            </Text>
          </Card>
        </Grid.Col>

        {/* Weekly Sales */}
        <Grid.Col span={4}>
          <Card withBorder radius="md" padding="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="sm" c="dimmed">
                  Weekly Sales
                </Text>
                <Text fw={700} size="xl">
                  {salesSummary.weekly}
                </Text>
              </div>

              <ThemeIcon variant="light" color="blue" size="lg" radius="md">
                <IconCalendarWeek size={18} />
              </ThemeIcon>
            </Group>

            <Text size="xs" c="blue" mt="sm">
              +8% compared to last week
            </Text>
          </Card>
        </Grid.Col>

        {/* Monthly Sales */}
        <Grid.Col span={4}>
          <Card withBorder radius="md" padding="md">
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="sm" c="dimmed">
                  Monthly Sales
                </Text>
                <Text fw={700} size="xl">
                  {salesSummary.monthly}
                </Text>
              </div>

              <ThemeIcon variant="light" color="violet" size="lg" radius="md">
                <IconCalendarMonth size={18} />
              </ThemeIcon>
            </Group>

            <Text size="xs" c="violet" mt="sm">
              +15% compared to last month
            </Text>
          </Card>
        </Grid.Col>
      </Grid>

      <Group align="flex-start" grow>
        <Card withBorder>
          <Text fw={600} mb="sm">
            Low Stock Products
          </Text>
          <Table>
            <Table.Tbody>
              {lowStock.map((p) => (
                <Table.Tr key={p.id}>
                  <Table.Td>{p.name}</Table.Td>
                  <Table.Td w={80}>
                    <Badge color="red">
                      {p.stock} / {p.reorderLevel}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>

        <Card withBorder>
          <Text fw={600} mb="sm">
            Top Selling Products
          </Text>
          <Table>
            <Table.Tbody>
              {topProducts.map((p) => (
                <Table.Tr key={p.product.id}>
                  <Table.Td>{p.product.name}</Table.Td>
                  <Table.Td w={40}>{p.quantitySold}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Card>
      </Group>
    </>
  );
}
