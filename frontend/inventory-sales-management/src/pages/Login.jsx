import { useState } from "react";
import { TextInput, PasswordInput, Button, Stack } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { login as loginApi } from "../services/auth.service";
import AuthLayout from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

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
    <AuthLayout>
      <form onSubmit={handleSubmit}>
        <Stack>
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
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <Button type="submit" loading={loading} fullWidth>
            Sign in
          </Button>
        </Stack>
      </form>
    </AuthLayout>
  );
}
