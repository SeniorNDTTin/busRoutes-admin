import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from 'antd';

import BoxHead from "../../components/boxHead";
import BoxInputBusRoute from "../../components/boxInputBusRoute";
import BoxInputBusRouteN from "../../components/boxInputBusRoute/number";

import GoBack from "../../components/goBack";

import busRouteService from "../../services/busRoute.service";
import styles from "../../assets/admin/busRoute.module.scss"

import configs from "../../configs";
import BoxCreate from "../../components/boxCreate";

function BusRouteCreate() {
    
  const navigate = useNavigate()

  const[busRoute, setBusRoute] = useState({
    name: "",
    fullDistance: 0,
    fullPrice: 0,
    time: "",
    firstFlightStartTime: "", 
    lastFlightStartTime: "",   
    timeBetweenTwoFlight: "",
});


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusRoute({
        ...busRoute,
        [name]: name === "fullPrice" || name === "fullDistance" ? Number(value) : value
    });
  };


  const handleSubmit = async () => {
    const data = {...busRoute}
    if(!busRoute.name || !busRoute.time|| !busRoute.firstFlightStartTime || !busRoute.lastFlightStartTime||!busRoute.timeBetweenTwoFlight){
        toast.error("Vui lòng không bỏ trống thông tin!");
        return;
    }

    if(busRoute.fullDistance <= 0 || busRoute.fullPrice <= 0){
        toast.error("Giá tiền hoặc độ dài toàn tuyến chưa hợp lệ !");
        return
    }
    const res = await (await busRouteService.create(data))

    if (res.code !== 201) {
        toast.error("Có lỗi xảy ra!");
        return;
    }
       
     toast.success("Tạo mới thành công");
    navigate(`/${configs.prefixAdmin}/bus-routes/update-information`);

  }

  return (
    <>
        <GoBack />

        <BoxHead title="TẠO MỚI TUYẾN BUS" />

         <div className={styles.busRoutes}>
          <div className={styles.busRoutes_wrapper}>
            <div className={styles.list}>
              <div className={styles.item}>
                  <BoxInputBusRoute label="Tên" name="name" value={busRoute.name ?? ""} onChange={handleChange} />
              </div>

              <div className={styles.item}>
                  <div className={styles.child}>
                    <BoxInputBusRouteN label="Độ dài tuyến" name="fullDistance" value={busRoute.fullDistance ?? 0} onChange={handleChange} />
                  </div>

                  <div className={styles.child1}>
                      <Input placeholder="Km" disabled/>
                  </div>             
              </div>

              <div className={styles.item}>
                <div className={styles.price}>
                  <BoxInputBusRouteN label="Giá vé tuyến" name="fullPrice" value={busRoute.fullPrice ?? 0} onChange={handleChange} />
                </div>

                <div className={styles.vnd}>
                    <Input placeholder="VND" disabled/>
                </div>
              </div>
            </div>

            <div className={styles.list}>
              <div className={styles.item}>
                <BoxInputBusRoute label="Thời gian toàn tuyến" name="time" value={busRoute.time ?? 0} onChange={handleChange} />
              </div>

              <div className={styles.item}>
                <BoxInputBusRoute label="Giờ bắt đầu chuyến đầu tiên" name="firstFlightStartTime" value={busRoute.firstFlightStartTime ?? ""} onChange={handleChange} />
              </div>

              <div className={styles.item}>
                <BoxInputBusRoute label="Giờ bắt đầu chuyến cuối cùng" name="lastFlightStartTime" value={busRoute.lastFlightStartTime ?? ""} onChange={handleChange} />
              </div>
            </div>
            
            <div className={styles.list_tool}>

              <BoxInputBusRoute  label="Khoảng thời gian giữa hai chuyến" name="timeBetweenTwoFlight" value={busRoute.timeBetweenTwoFlight ?? ""} onChange={handleChange} />
              <div className={styles.tool}>
                <BoxCreate onClick={handleSubmit} /> 
              </div>
            </div>
          </div>
         </div>
    </>
  );
}

export default BusRouteCreate;