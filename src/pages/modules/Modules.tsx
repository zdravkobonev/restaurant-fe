// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
// import Sidebar from "./components/Sidebar";
import {
  TagOutlined,
  SettingOutlined,
  MonitorOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const Modules = () => {
  // const [collapsed, setCollapsed] = useState(true);
  const navigate = useNavigate();

  const modules = [
    {
      key: "tagging",
      title: "Маркиране",
      desc: "Маркирай продукти и артикули за продажба",
      icon: <TagOutlined className="!text-sky-600 text-xl" />,
      path: "/ordering",
    },
    {
      key: "configuration",
      title: "Конфигурация",
      desc: "Настройки на системата и интеграции",
      icon: <SettingOutlined className="!text-sky-600 text-xl" />,
      path: "/configuration",
    },
    {
      key: "monitors",
      title: "Монитори",
      desc: "Следи процеси и системни метрики в реално време",
      icon: <MonitorOutlined className="!text-sky-600 text-xl" />,
      path: "/monitors",
    },
    {
      key: "reports",
      title: "Справки",
      desc: "Генерирай отчети и статистики",
      icon: <FileTextOutlined className="!text-sky-600 text-xl" />,
      path: "/reports",
    },
    {
      key: "reservations",
      title: "Резервации",
      desc: "Управлявай резервации и графици",
      icon: <CalendarOutlined className="!text-sky-600 text-xl" />,
      path: "/reservations",
    },
    {
      key: "inventory",
      title: "Складова база",
      desc: "Следи наличности и доставки",
      icon: <DatabaseOutlined className="!text-sky-600 text-xl" />,
      path: "/inventory",
    },
  ];

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
              {modules.map((m) => (
                <div
                  key={m.key}
                  onClick={() => navigate(m.path)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") navigate(m.path);
                  }}
                  className="p-4 bg-white rounded-lg shadow flex items-center gap-3 cursor-pointer hover:shadow-md"
                >
                  {m.icon}
                  <div>
                    <div className="font-medium">{m.title}</div>
                    <div className="text-sm text-gray-500 mt-1">{m.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Modules;
