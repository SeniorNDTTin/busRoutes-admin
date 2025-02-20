import { Button } from "antd";
import { useNavigate } from "react-router-dom";

import { ArrowLeftOutlined } from "@ant-design/icons";

function GoBack() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(-1);
  }

  return (
    <>
       <Button type="primary" onClick={handleClick} icon={<ArrowLeftOutlined />} />
    </>
  );
}

export default GoBack;