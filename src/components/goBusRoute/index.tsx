import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { ArrowLeftOutlined } from "@ant-design/icons";
import configs from "../../configs";
function GoBusRoute() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/${configs.prefixAdmin}/bus-routes/update-information`)
  }

  return (
    <>
       <Button type="primary" onClick={handleClick} icon={<ArrowLeftOutlined />} />
    </>
  );
}

export default GoBusRoute;