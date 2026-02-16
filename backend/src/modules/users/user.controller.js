import { createUserSchema } from "./user.schema.js";
import { createUser, getUsers, toggleUserStatus } from "./user.service.js";
import { logAudit } from "../auditLogs/auditLog.service.js";

export async function createUserController(req, res) {
  const payload = createUserSchema.parse(req.body);
  const user = await createUser(payload);

  await logAudit({
    req,
    action: "CREATE",
    entity: "USER",
    entityId: user.id,
    description: `Created user ${user.email} (${user.role})`,
  });

  res.status(201).json(user);
}

export async function getUsersController(req, res) {
  const users = await getUsers();
  res.json(users);
}

export async function toggleUserStatusController(req, res) {
  const { isActive } = req.body;
  const user = await toggleUserStatus(req.params.id, isActive);

  await logAudit({
    req,
    action: "UPDATE",
    entity: "USER",
    entityId: user.id,
    description: `Updated user status to ${isActive}`,
  });

  res.json(user);
}
