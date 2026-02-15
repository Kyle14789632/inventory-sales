import { AppShell, Group, Text, NavLink, Button } from "@mantine/core";
import {
  IconLayoutDashboard,
  IconCategory,
  IconPackage,
  IconLogout,
  IconBasketDown,
  IconBasket,
  IconBuildingWarehouse,
  IconBuildingStore,
  IconUsers,
  IconReportMoney,
  IconFileIsr,
} from "@tabler/icons-react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AppLayout() {
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogout = () => {
    auth.logout();
    navigate("/login");
  };

  return (
    <AppShell padding="md" navbar={{ width: 260 }} header={{ height: 60 }}>
      {/* HEADER */}
      <AppShell.Header p="md">
        <Group justify="space-between" h="100%">
          <Text fw={600}>Inventory & Sales Management</Text>
          <Text size="sm" c="dimmed">
            {auth.user?.email}
          </Text>
        </Group>
      </AppShell.Header>

      {/* SIDEBAR */}
      <AppShell.Navbar p="md">
        <NavLink
          label="Dashboard"
          leftSection={<IconLayoutDashboard size={18} />}
          onClick={() => navigate("/")}
        />

        <NavLink
          label="Customers"
          leftSection={<IconUsers size={18} />}
          onClick={() => navigate("/customers")}
        />

        <NavLink
          label="Suppliers"
          leftSection={<IconBuildingStore size={18} />}
          onClick={() => navigate("/suppliers")}
        />

        <NavLink
          label="Categories"
          leftSection={<IconCategory size={18} />}
          onClick={() => navigate("/categories")}
        />

        <NavLink
          label="Products"
          leftSection={<IconPackage size={18} />}
          onClick={() => navigate("/products")}
        />

        <NavLink
          label="Inventory"
          leftSection={<IconBuildingWarehouse size={18} />}
          onClick={() => navigate("/inventory")}
        />

        <NavLink
          label="Purchase Order"
          leftSection={<IconBasket size={18} />}
          onClick={() => navigate("/purchase-orders")}
        />

        <NavLink
          label="Sales Order"
          leftSection={<IconReportMoney size={18} />}
          onClick={() => navigate("/sales-orders")}
        />

        {auth?.user?.role === "ADMIN" && (
          <NavLink
            label="Audit Logs"
            leftSection={<IconFileIsr size={18} />}
            onClick={() => navigate("/audit-logs")}
          />
        )}

        <Button
          variant="subtle"
          color="red"
          leftSection={<IconLogout size={18} />}
          mt="auto"
          onClick={handleLogout}
          fullWidth
        >
          Logout
        </Button>
      </AppShell.Navbar>

      {/* MAIN CONTENT */}
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
