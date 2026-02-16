import { useState } from "react";
import {
  Button,
  Center,
  Container,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { login as loginApi } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import logo from "../assets/logo.png";

export default function Login() {
  const navigate = useNavigate();
  const auth = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await loginApi(form);
      auth.login(data);
      notifications.show({
        title: "Login successful",
        message: "Welcome back!",
        color: "green",
      });
      navigate("/");
    } catch (err) {
      notifications.show({
        title: "Login failed",
        message: err.response?.data?.message || "Something went wrong",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Center mih="100vh" px="md" py={{ base: "xl", md: 96 }}>
      <Container size={512} w="100%">
        <Paper withBorder shadow="md" p={{ base: "xl", md: 48 }} radius="md">
          <Stack gap="xl">
            <Stack align="center" gap="sm">
              <img src={logo} alt="App logo" width={350} />
            </Stack>

            <form onSubmit={handleSubmit}>
              <Stack gap="lg">
                <TextInput
                  label="Email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />

                <PasswordInput
                  label="Password"
                  required
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />

                <Button type="submit" loading={loading} fullWidth>
                  Sign in
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Container>
    </Center>
  );
}
