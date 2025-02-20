import { useNavigate } from "react-router-dom";

import { Button } from "antd";

import "./navigateDetail.css"

interface props {
  id: string
};

function ButtonNavigateDetail({ id }: props) {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`detail/${id}`);
  }

  return (
    <Button type="primary" className="button-primary detail" onClick={handleNavigate}>Xem</Button>
  );
}

export default ButtonNavigateDetail;