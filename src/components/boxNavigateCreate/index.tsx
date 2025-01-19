import { useNavigate } from "react-router-dom";

import { Button } from "antd";

import "./buttonNavigateCreate.css";

function BoxNavigateCreate() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("create");
  }

  return (
    <div className="button-navigate-create">
      <Button className="button-success" onClick={handleNavigate}>Tạo</Button>
    </div>
  );
}

export default BoxNavigateCreate;