import { BrowserRouter, Route, Routes } from "react-router-dom";

import LayoutAuth from "../layouts/auth";

import Login from "../pages/auth/login";

import configs from "../configs/index";
import LayoutAdmin from "../layouts/admin";

import Dashboard from "../pages/dashboard";

import District from "../pages/districts";
import DistrictList from "../pages/districts/list";
import DistrictCreate from "../pages/districts/create";
import DistrictUpdate from "../pages/districts/update";
import DistrictDetail from "../pages/districts/detail";

import Ward from "../pages/wards";
import WardList from "../pages/wards/list";
import WardCreate from "../pages/wards/create";
import WardUpdate from "../pages/wards/update";
import WardDetail from "../pages/wards/detail";

import Street from "../pages/streets";
import StreetList from "../pages/streets/list";
import StreetCreate from "../pages/streets/create";
import StreetUpdate from "../pages/streets/update";
import StreetDetail from "../pages/streets/detail";

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
            <Route path="districts" element={<District />} >
              <Route path="" element={<DistrictList />} />
              <Route path="detail/:id" element={<DistrictDetail />} />
              <Route path="create" element={<DistrictCreate />} />
              <Route path="update/:id" element={<DistrictUpdate />} />
            </Route>

            {/* Wards */}
            <Route path="wards" element={<Ward />} >
              <Route path="" element={<WardList />} />
              <Route path="detail/:id" element={<WardDetail />} />
              <Route path="create" element={<WardCreate />} />
              <Route path="update/:id" element={<WardUpdate />} />
            </Route>

            {/* Streets */}
            <Route path="streets" element={<Street />} >
              <Route path="" element={<StreetList />} />
              <Route path="detail/:id" element={<StreetDetail />} />
              <Route path="create" element={<StreetCreate />} />
              <Route path="update/:id" element={<StreetUpdate />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default AppRoutes;