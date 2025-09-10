import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown } from "antd";
import type { MenuProps } from "antd";
import { useNavigate } from "react-router-dom";
import { clearToken } from "../../../lib/auth";

export default function Navbar() {
  const items: MenuProps["items"] = [
    // {
    //   key: "profile",
    //   label: "Профил",
    //   icon: <UserOutlined />,
    // },
    {
      key: "logout",
      label: "Изход",
      icon: <LogoutOutlined />,
    },
  ];
  const navigate = useNavigate();

  const onMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      clearToken();
      navigate("/login", { replace: true });
    }
  };

  return (
    <header className="flex items-center justify-between bg-white/95 backdrop-blur-sm shadow-md px-4 h-16">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-md flex items-center justify-center text-white font-semibold">
            TS
          </div>
          <div className="xs:block">
            <div className="font-semibold">Cloud Touchsale</div>
            <div className="text-xs text-gray-500">
              Система за управление на ресторанти
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <Dropdown
          menu={{ items, onClick: onMenuClick }}
          trigger={["click"]}
          placement="bottomRight"
        >
          <div className="flex items-center gap-2 cursor-pointer">
            <Avatar
              style={{ backgroundColor: "#108ee9" }}
              icon={<UserOutlined />}
            />
          </div>
        </Dropdown>
      </div>
    </header>
  );
}
