import Logout from "../../pages/auth/logout";

import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="inner-logo">
          <img src="/image/admin/logo.jpg" alt="" />
      </div>
      <div className="inner-auth">
        <Logout />
      </div>
    </header>
  );
}

export default Header;