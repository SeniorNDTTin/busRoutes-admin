import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from 'antd';

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import busRouteService from "../../services/busRoute.service";
import IBusRoute from "../../interfaces/busRoute";

import styles from "../../assets/admin/busRoute.module.scss"

function BusRouteDetail() {
  const { id } = useParams();
  const[busRoute, setBusRoute] = useState<Partial<IBusRoute>>({});

  useEffect(() => {
    const  fetchApi = async () => {
         const BusRoute = (await busRouteService.getById(id as string)).data
         setBusRoute(BusRoute)
     }
     fetchApi()
 },[id])

  const formatCurrency = (value?: number) => {
    if (!value) return "0";
    return new Intl.NumberFormat("vi-VN").format(value);
  };


  return (
    <>

        <GoBack />

        <BoxHead title="THÔNG TIN TUYẾN BUS" />


        <div className={styles.busRoutes}>
          <div className={styles.busRoutes_wrapper}>
            <div className={styles.list}>
              <div className={styles.item}>
                  <BoxInput label="Tên"  value={busRoute.name ?? ""} onChange={() => {}} />
              </div>

              <div className={styles.item}>
                  <div className={styles.child}>
                    <BoxInput label="Độ dài tuyến"  value={busRoute.fullDistance ?? 0} onChange={() => {}} />
                  </div>

                  <div className={styles.child1}>
                      <Input placeholder="Km" disabled/>
                  </div>             
              </div>

              <div className={styles.item}>
                <div className={styles.price}>
                  <BoxInput label="Giá vé tuyến" value={formatCurrency(busRoute.fullPrice)} onChange={() => {}} />
                </div>

                <div className={styles.vnd}>
                    <Input placeholder="VND" disabled/>
                </div>
              </div>
            </div>

            <div className={styles.list}>
              <div className={styles.item}>
                <BoxInput label="Thời gian toàn tuyến"  value={busRoute.time ?? 0} onChange={() => {}} />
              </div>

              <div className={styles.item}>
                <BoxInput label="Giờ bắt đầu chuyến đầu tiên" value={busRoute.firstFlightStartTime ?? ""} onChange={() => {}} />
              </div>

              <div className={styles.item}>
                <BoxInput label="Giờ bắt đầu chuyến cuối cùng"  value={busRoute.lastFlightStartTime ?? ""} onChange={() => {}} />
              </div>
            </div>
            
            <div className={styles.list_tool}>

              <BoxInput  label="Khoảng thời gian giữa hai chuyến"  value={busRoute.timeBetweenTwoFlight ?? ""} onChange={() => {}} />
            </div>
          </div>
      </div>
        {/* <BoxInput label="Tên" value={busRoute.name ?? ""} onChange={() => {}} />
        <BoxInput label="Độ dài tuyến" value={busRoute.fullDistance ?? 0 } onChange={() => {}} />
        <BoxInput label="Giá vé tuyến" value={busRoute.fullPrice ?? 0} onChange={() => {}} />
        <BoxInput label="Giờbắt đầu chuyến đầu tiên" value={busRoute.firstFlightStartTime ?? ""} onChange={() => {}} />
        <BoxInput label="Giờ bắt đầu chuyến cuối cùng" value={busRoute.lastFlightStartTime ?? ""} onChange={() => {}} />
        <BoxInput label="Khoảng thời gian giữa hai chuyến" value={busRoute.timeBetweenTwoFlight ?? ""} onChange={() => {}} /> */}
    </>
  );
}

export default BusRouteDetail;