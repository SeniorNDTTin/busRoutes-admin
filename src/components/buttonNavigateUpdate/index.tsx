import { useNavigate } from "react-router-dom";

import { Button } from "antd";

import "./buttonUpdate.css"

interface props {
  id: string
};

function  ButtonNavigateUpdate({ id }: props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`update/${id}`);
  }

  return (
    <Button type="primary" className="button-warning update" onClick={handleNavigate}>Sửa</Button>
  );
}

export default ButtonNavigateUpdate;