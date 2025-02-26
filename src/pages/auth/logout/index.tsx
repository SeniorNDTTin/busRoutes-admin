import { useNavigate } from "react-router-dom";

import { Button } from "antd";
import {LogoutOutlined} from "@ant-design/icons"

import styles from "../../../assets/admin/logout/index.module.scss"

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    navigate("/admin/auth/login");
  }

  return (
    <>
      <Button type="primary" className={`${styles.logout} button-danger`} onClick={handleLogout}><LogoutOutlined className={styles.icon}/></Button>
    </>
  );
}

export default Logout;