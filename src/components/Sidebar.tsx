import { Menu } from "antd";
import {
  HomeOutlined,
  PieChartOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import "./Sidebar.css";

type Props = {
  collapsed: boolean;
  onToggle?: () => void;
  onClose?: () => void; // used on mobile
};

export default function Sidebar({ collapsed, onToggle }: Props) {
  return (
    <motion.nav
      initial={false}
      animate={{ width: collapsed ? "3rem" : "10rem" }}
      transition={{ duration: 0.22 }}
      className={`sidebar ${
        collapsed ? "is-collapsed" : ""
      } bg-white/95 backdrop-blur-sm shadow-md h-full`}
    >
      <div className="h-full relative">
        {/* Toggle button at the bottom center of the sidebar */}
        <div className="absolute bottom-1 left-1/2 z-20 transform -translate-x-1/2">
          <div
            role="button"
            onClick={onToggle}
            aria-label={collapsed ? "Разгъни меню" : "Свий меню"}
            className={`ant-menu-item flex items-center gap-3 justify-${
              collapsed ? "center" : "start"
            } !rounded-md !px-3 !py-2 cursor-pointer`}
          >
            <div className="flex items-center justify-center">
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </div>
            {!collapsed && <div className="ant-menu-title-content"></div>}
          </div>
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          inlineCollapsed={false}
          items={[
            { key: "1", icon: <HomeOutlined />, label: "Табло" },
            { key: "2", icon: <PieChartOutlined />, label: "Продажби" },
            { key: "3", icon: <SettingOutlined />, label: "Настройки" },
          ]}
        />
      </div>
    </motion.nav>
  );
}
