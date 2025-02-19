import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "antd";

interface props { id: string }

const ButtonUpdate: React.FC<props> = ({ id }) => {
   const [isModalOpen, setIsModalOpen] = useState(false);
  
    const navigate = useNavigate()
    
    const handleNavigate = () => {
      navigate(`update/${id}`);
      setIsModalOpen(true);
    }
  return (
      <Button color="default" variant="solid" onClick={ handleNavigate}><i className="fa-regular fa-pen-to-square" style={{color: 'white'}}></i></Button>
  );
}

export default ButtonUpdate;