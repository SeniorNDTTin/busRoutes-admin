import { useNavigate } from "react-router-dom";

import { Button } from "antd";

function Logout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    
    navigate("/admin/auth/login");
  }

  return (
    <>
      <Button type="primary" className="button-danger" onClick={handleLogout}>Đăng xuất</Button>
    </>
  );
}

export default Logout;