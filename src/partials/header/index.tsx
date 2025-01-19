import Logout from "../../pages/auth/logout";

import "./header.css";

function Header() {
  return (
    <header className="header">
      <div className="inner-logo">
        LOGO
      </div>
      <div className="inner-auth">
        <Logout />
      </div>
    </header>
  );
}

export default Header;