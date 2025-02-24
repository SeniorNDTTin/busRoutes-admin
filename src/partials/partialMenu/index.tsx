import { useNavigate, useLocation } from 'react-router-dom';

import { MdDashboard } from "react-icons/md";
import { CiLocationArrow1 } from "react-icons/ci";
import { FaUserFriends } from "react-icons/fa";
import { FaBusAlt } from "react-icons/fa";
import { FaArrowRightArrowLeft } from "react-icons/fa6";
import { RiMapPinRangeFill } from "react-icons/ri";
import { HiOutlineTicket } from "react-icons/hi2";
import { LuTicketsPlane } from "react-icons/lu";

import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import {FullscreenOutlined} from "@ant-design/icons"
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
    icon: <FaBusAlt />
  },
  {
    key: `/${admin}/directions`,
    label: "Tuyến Đường",
    icon: <FaArrowRightArrowLeft />
  },
  {
    key: `/${admin}/bus-stops`,
    label: "Trạm Dừng",
    icon: <RiMapPinRangeFill  />
  },
  {
    key: `/${admin}/bus-routes`,
    label: "Quản lý các tuyến",
    icon: <FullscreenOutlined />,
    children: [
      { key: `/${admin}/bus-routes/show-network`, label: 'Hiển thị mạng lưới' },
      { key: `/${admin}/bus-routes/update-information`, label: 'Cập nhật thông tin' },
    ],
  },
  {
    key: `/${admin}/month-ticket-prices`,
    label: "Giá Vé Tháng",
    icon: <LuTicketsPlane  />
  },
  {
    key: `/${admin}/one-way-ticket-prices`,
    label: "Giá Vé Lượt",
    icon: <HiOutlineTicket />
  },
  {
    key: `/${admin}/customers`,
    label: "Khách hàng",
    icon: < FaUserFriends />
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
