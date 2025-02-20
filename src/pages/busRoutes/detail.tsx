import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";

import busRouteService from "../../services/busRoute.service";
import IBusRoute from "../../interfaces/busRoute";

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

  return (
    <>

        <GoBack />

        <BoxHead title="Tạo Mới Tuyến Bus" />

        <BoxInput label="Tên" value={busRoute.name ?? ""} onChange={() => {}} />
        <BoxInput label="Độ dài tuyến" value={busRoute.fullDistance ?? 0 } onChange={() => {}} />
        <BoxInput label="Giá vé tuyến" value={busRoute.fullPrice ?? 0} onChange={() => {}} />
        <BoxInput label="Giờbắt đầu chuyến đầu tiên" value={busRoute.firstFlightStartTime ?? ""} onChange={() => {}} />
        <BoxInput label="Giờ bắt đầu chuyến cuối cùng" value={busRoute.lastFlightStartTime ?? ""} onChange={() => {}} />
        <BoxInput label="Khoảng thời gian giữa hai chuyến" value={busRoute.timeBetweenTwoFlight ?? ""} onChange={() => {}} />
    </>
  );
}

export default BusRouteDetail;