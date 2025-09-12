import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAppSelector } from "../store/hooks";

export default function AuthorizedRoute({
  children,
  requiredParentId,
}: {
  children: ReactNode;
  requiredParentId: number;
}) {
  const roles = useAppSelector((s) => s.auth.roles);

  const isRoleObject = (v: unknown): v is { parentId?: number | string } =>
    typeof v === "object" && v !== null && "parentId" in v;

  const has =
    Array.isArray(roles) &&
    roles.some((r) => {
      if (isRoleObject(r)) {
        return Number(r.parentId) === requiredParentId;
      }
      return String(r) === String(requiredParentId);
    });

  if (!has) return <Navigate to="/" replace />;
  return <>{children}</>;
}
