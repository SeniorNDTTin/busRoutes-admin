import { useNavigate } from 'react-router-dom';

import { MdDashboard } from "react-icons/md";
import { CiLocationArrow1} from "react-icons/ci";

import {FullscreenOutlined} from "@ant-design/icons"

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
    key: `/${admin}/busRoutes`,
    label: "Quản lý các tuyến",
    icon: <FullscreenOutlined />,
    children: [
      { key: `/${admin}/busRoutes/show-network`, label: 'Hiển thị mạng lưới' },
      { key: `/${admin}/busRoutes/update-information`, label: 'Cập nhật thông tin' },
    ],
  }
];

function PartialMenu() {
  const pathName = window.location.pathname;

  const navigate = useNavigate();

  const handleNavigate: MenuProps['onClick'] = (e) => {
    const key = e.key;
    navigate(key);
  };

  return (
    <Menu
      onClick={handleNavigate}
      style={{ width: 256 }}
      defaultSelectedKeys={[pathName]}
      defaultOpenKeys={[pathName]}
      mode="inline"
      items={items}
    />
  );
}

export default PartialMenu;