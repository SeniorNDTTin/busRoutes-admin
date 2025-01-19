import { Outlet } from "react-router-dom";

import Footer from "../../partials/footer";
import Header from "../../partials/header";
import PartialMenu from "../../partials/partialMenu";

import "./admin.css";

function LayoutAdmin() {
  return (
    <div className="layout-admin">
      <div className="layout-left">
        <PartialMenu />
      </div>

      <div className="layout-right">
        <Header />

        <main className="main">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default LayoutAdmin;