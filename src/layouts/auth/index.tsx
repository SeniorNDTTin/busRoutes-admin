import { Outlet } from "react-router-dom";

import "./auth.css";

function LayoutAuth() {
  return (
    <div className="layout-auth">
      <Outlet />
    </div>
  );
}

export default LayoutAuth;