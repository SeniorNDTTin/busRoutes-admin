import { useNavigate, useLocation } from 'react-router-dom';

import { MdDashboard } from "react-icons/md";
import { CiLocationArrow1 } from "react-icons/ci";

import type { MenuProps } from 'antd';
import { Menu } from 'antd';

import configs from '../../configs';

type MenuItem = Required<MenuProps>['items'][number];

const admin = configs.prefixAdmin;

const items: MenuItem[] = [
  {
    key: `/${admin}/dashboard`,
    label: "Tổng Quan",
    icon: <MdDashboard />
  },
  {
    key: `/${admin}/districts`,
    label: "Quận/Huyện",
    icon: <CiLocationArrow1 />
  },
  {
    key: `/${admin}/wards`,
    label: "Xã/Phường",
    icon: <CiLocationArrow1 />
  },
  {
    key: `/${admin}/streets`,
    label: "Đường",
    icon: <CiLocationArrow1 />
  },
  {
    key: `/${admin}/buses`,
    label: "Xe Bus",
    icon: <CiLocationArrow1 />
  },
  {
    key: `/${admin}/directions`,
    label: "Tuyến Đường",
    icon: <CiLocationArrow1 />
  }
];


function PartialMenu() {
  const navigate = useNavigate();
  const location = useLocation(); // Lấy URL hiện tại

  const handleNavigate: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };

  return (
    <Menu
      onClick={handleNavigate}
      style={{ width: 256 }}
      selectedKeys={[location.pathname]} // Cập nhật khi thay đổi đường dẫn
      mode="inline"
      items={items}
    />
  );
}

export default PartialMenu;
