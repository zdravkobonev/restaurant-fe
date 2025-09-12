// import { useState } from "react";
import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { fetchUserRoles } from "../../store/authSlice";
// import Sidebar from "./components/Sidebar";
import {
  TagOutlined,
  SettingOutlined,
  MonitorOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DatabaseOutlined,
  TruckOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { useEffect } from "react";

const Modules = () => {
  // const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();
  const roles = useAppSelector((s) => s.auth.roles);
  const dispatch = useAppDispatch();
  // roles may be an array of objects like { parentId: number, roles: [...] }
  // or a flat string array (legacy). We only care about parentId numbers.
  const userHasParent = (parentId: number) => {
    if (!roles) return false;
    // handle array of objects
    if (Array.isArray(roles) && roles.length > 0) {
      const first = roles[0];
      // if elements are objects with parentId
      if (typeof first === "object" && first !== null && "parentId" in first) {
        type RoleItem = { parentId?: number | string } & Record<
          string,
          unknown
        >;
        const roleItems = roles as unknown as RoleItem[];
        return roleItems.some((r) => Number(r.parentId) === parentId);
      }
      // otherwise if it's an array of strings/numbers containing the parentId
      const prim = roles as unknown[];
      return prim.some((r) => String(r) === String(parentId));
    }
    return false;
  };
  type Module = {
    parentId?: number;
    key: string;
    title: string;
    desc: string;
    icon: React.ReactNode;
    path: string;
  };

  const modules: Module[] = React.useMemo(
    () => [
      {
        parentId: 13,
        key: "tagging",
        title: "Маркиране",
        desc: "Маркирай продукти и артикули за продажба",
        icon: <TagOutlined className="!text-sky-600 text-xl" />,
        path: "/ordering",
      },
      {
        parentId: 19,
        key: "configuration",
        title: "Конфигурация",
        desc: "Настройки на системата и интеграции",
        icon: <SettingOutlined className="!text-sky-600 text-xl" />,
        path: "/configuration",
      },
      {
        parentId: 22,
        key: "monitors",
        title: "Монитори",
        desc: "Следи процеси и системни метрики в реално време",
        icon: <MonitorOutlined className="!text-sky-600 text-xl" />,
        path: "/monitors",
      },
      {
        parentId: 26,
        key: "reports",
        title: "Справки",
        desc: "Генерирай отчети и статистики",
        icon: <FileTextOutlined className="!text-sky-600 text-xl" />,
        path: "/reports",
      },
      {
        parentId: 31,
        key: "reservations",
        title: "Резервации",
        desc: "Управлявай резервации и графици",
        icon: <CalendarOutlined className="!text-sky-600 text-xl" />,
        path: "/reservations",
      },
      {
        parentId: 34,
        key: "inventory",
        title: "Складова база",
        desc: "Следи наличности и доставки",
        icon: <DatabaseOutlined className="!text-sky-600 text-xl" />,
        path: "/inventory",
      },
      {
        parentId: 40,
        key: "discounts",
        title: "Отстъпки",
        desc: "Управлявай отстъпки и промоции",
        icon: <TagsOutlined className="!text-sky-600 text-xl" />,
        path: "/discounts",
      },
      {
        parentId: 37,
        key: "delivery",
        title: "Доставки",
        desc: "Управлявай доставки и куриерски услуги",
        icon: <TruckOutlined className="!text-sky-600 text-xl" />,
        path: "/delivery",
      },
    ],
    []
  );

  // extract parentIds the user has into a deduplicated number array
  const userParentIds = React.useMemo(() => {
    if (!roles || !Array.isArray(roles) || roles.length === 0)
      return [] as number[];
    const first = roles[0];
    if (typeof first === "object" && first !== null && "parentId" in first) {
      type RoleItem = { parentId?: number | string } & Record<string, unknown>;
      const roleItems = roles as unknown as RoleItem[];
      return Array.from(
        new Set(roleItems.map((r) => Number(r.parentId)).filter(Boolean))
      );
    }
    // primitives
    return Array.from(
      new Set(
        (roles as unknown[])
          .map((r) => Number(r))
          .filter((n) => !Number.isNaN(n))
      )
    );
  }, [roles]);

  // If user has exactly one parentId, redirect directly to that module
  useEffect(() => {
    // if no roles loaded yet, fetch them from backend
    if (!roles || (Array.isArray(roles) && roles.length === 0)) {
      // fire-and-forget; slice will keep existing roles on failure
      dispatch(fetchUserRoles());
    }

    if (userParentIds.length === 1) {
      const parent = userParentIds[0];
      const match = modules.find((m) => m.parentId === parent);
      if (match) navigate(match.path);
    }
    // only run on mount or when modules/roles change
  }, [navigate, userParentIds, modules, dispatch, roles]);
  // (duplicate declarations removed)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar for large screens */}
        {/* <div className="xs:block">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
          />
        </div> */}

        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userParentIds.length === 0 ? (
                <div className="p-6 bg-white rounded-lg shadow col-span-1 md:col-span-2">
                  <div className="font-medium mb-2">Нямате добавени роли</div>
                  <div className="text-sm text-gray-600">
                    За да имате достъп до модулите, трябва да ви бъдат добавени
                    роли/права. Моля, свържете се с администратор.
                  </div>
                </div>
              ) : userParentIds.length === 1 ? (
                <div className="p-6 bg-white rounded-lg shadow col-span-1 md:col-span-2">
                  <div className="font-medium">Пренасочване...</div>
                  <div className="text-sm text-gray-600">
                    Насочваме ви към вашия модул.
                  </div>
                </div>
              ) : (
                modules
                  .filter((m: Module) => {
                    // if module has no parentId, show by default
                    if (typeof m.parentId === "undefined") return true;
                    return userHasParent(m.parentId as number);
                  })
                  .map((m: Module) => (
                    <div
                      key={m.key}
                      onClick={() => navigate(m.path)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ")
                          navigate(m.path);
                      }}
                      className="p-4 bg-white rounded-lg shadow flex items-center gap-3 cursor-pointer hover:shadow-md"
                    >
                      {m.icon}
                      <div>
                        <div className="font-medium">{m.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {m.desc}
                        </div>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Modules;
