import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function GoBack() {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(-1);
  }

  return (
    <>
      <Button type="primary" onClick={handleClick}>Go Back</Button>
    </>
  );
}

export default GoBack;