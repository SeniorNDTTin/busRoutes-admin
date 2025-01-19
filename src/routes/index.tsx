import { BrowserRouter, Route, Routes } from "react-router-dom";

import LayoutAuth from "../layouts/auth";

import Login from "../pages/auth/login";

import configs from "../configs/index";
import LayoutAdmin from "../layouts/admin";
import Dashboard from "../pages/dashboard";
import Address from "../pages/address";
import AddressList from "../pages/address/list";
import AddressCreate from "../pages/address/create";
import AddressUpdate from "../pages/address/update";
import AddressDetail from "../pages/address/detail";

function AppRoutes() {
  const admin = configs.prefixAdmin;

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path={`/${admin}/auth`} element={<LayoutAuth />}>
            <Route path="login" element={<Login />} />
          </Route>

          <Route path={`/${admin}`} element={<LayoutAdmin />}>
            <Route path="dashboard" element={<Dashboard />} />

            {/* Addresses */}
            <Route path="addresses" element={<Address />} >
              <Route path="" element={<AddressList />} />
              <Route path="detail/:id" element={<AddressDetail />} />
              <Route path="create" element={<AddressCreate />} />
              <Route path="update/:id" element={<AddressUpdate />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRoutes;