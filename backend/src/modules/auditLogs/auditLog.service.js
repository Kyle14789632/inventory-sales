import prisma from "../../prisma/client.js";

export async function getAuditLogs({
  page,
  limit,
  sortBy = "createdAt",
  sortOrder = "desc",
}) {
  const skip = (page - 1) * limit;

  const [data, total] = await prisma.$transaction([
    prisma.auditLog.findMany({
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
    }),
    prisma.auditLog.count(),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function logAudit({
  req,
  action,
  entity,
  entityId = null,
  description = "",
}) {
  if (!req.user) return;

  return prisma.auditLog.create({
    data: {
      userId: req.user.id,
      userEmail: req.user.email,
      role: req.user.role,
      action,
      entity,
      entityId,
      description,
      ipAddress: req.ip,
      userAgent: req.headers["user-agent"],
    },
  });
}
