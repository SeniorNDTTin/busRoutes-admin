import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "antd";
import styles from "../../../assets/admin/busRoutes/update_info/index.module.scss"

interface props { id: string }

const ButtonDetail: React.FC<props> = ({ id }) => { 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate()
  
  const handleNavigate = () => {
    navigate(`detail/${id}`);
    setIsModalOpen(true);
  }

  return (
    <Button color="default" variant="solid" className={styles.details} onClick={ handleNavigate} ><i className="fa-solid fa-eye" style={{color: 'black'}}></i></Button>
  );
}
// 
export default ButtonDetail;