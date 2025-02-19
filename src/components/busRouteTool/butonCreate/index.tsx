import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { Button } from "antd";
import styles from "../../../assets/admin/busRoutes/update_info/index.module.scss"

const ButtonCreate = ()=> {

  const nav = useNavigate()
   const handleNavigate = () => {
      nav("create/", { state: { openModal: true } });
       
   }
  return (
    <Button className ={styles.add_busRoutes} color="default" variant="solid" onClick={handleNavigate}>+</Button>
  );
}
// 
export default ButtonCreate;