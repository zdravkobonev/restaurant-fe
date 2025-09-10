import { useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import {
  TagOutlined,
  SettingOutlined,
  MonitorOutlined,
  FileTextOutlined,
  CalendarOutlined,
  DatabaseOutlined,
} from "@ant-design/icons";

const Modules = () => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <div className="flex flex-1">
        {/* Sidebar for large screens */}
        <div className="xs:block">
          <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((c) => !c)}
          />
        </div>

        {/* Main content area */}
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-lg shadow flex items-center gap-3">
                <TagOutlined className="!text-sky-600 text-xl" />
                <div>
                  <div className="font-medium">Маркиране</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Маркирай продукти и артикули за продажба
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow flex items-center gap-3">
                <SettingOutlined className="!text-sky-600 text-xl" />
                <div>
                  <div className="font-medium">Конфигурация</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Настройки на системата и интеграции
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow flex items-center gap-3">
                <MonitorOutlined className="!text-sky-600 text-xl" />
                <div>
                  <div className="font-medium">Монитори</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Следи процеси и системни метрики в реално време
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow flex items-center gap-3">
                <FileTextOutlined className="!text-sky-600 text-xl" />
                <div>
                  <div className="font-medium">Справки</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Генерирай отчети и статистики
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow flex items-center gap-3">
                <CalendarOutlined className="!text-sky-600 text-xl" />
                <div>
                  <div className="font-medium">Резервации</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Управлявай резервации и графици
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white rounded-lg shadow flex items-center gap-3">
                <DatabaseOutlined className="!text-sky-600 text-xl" />
                <div>
                  <div className="font-medium">Складова база</div>
                  <div className="text-sm text-gray-500 mt-1">
                    Следи наличности и доставки
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Modules;
