import { Menu } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import "./Sidebar.css";
import { useNavigate, useLocation } from "react-router-dom";

type Props = {
  collapsed: boolean;
  onToggle?: () => void;
  onClose?: () => void; // used on mobile
};

export default function Sidebar({ collapsed, onToggle }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
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
          selectedKeys={[
            location.pathname === "/configuration" ||
            location.pathname === "/configuration/"
              ? "1"
              : location.pathname.startsWith("/configuration/users")
              ? "2"
              : "",
          ]}
          inlineCollapsed={false}
          onClick={(info) => {
            if (info.key === "1") navigate("/configuration");
            if (info.key === "2") navigate("/configuration/users");
          }}
          items={[
            { key: "1", icon: <HomeOutlined />, label: "Табло" },
            { key: "2", icon: <TeamOutlined />, label: "Потребители" },
          ]}
        />
      </div>
    </motion.nav>
  );
}
