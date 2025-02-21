import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxSelect from "../../components/boxSelect";
import BoxInput from "../../components/boxInput";

import monthTicketPriceService from "../../services/monthTicketPrice.service";
import IBusRoute from "../../interfaces/busRoute";
import busRouteService from "../../services/busRoute.service";

function MonthTicketPriceDetail() {
  const { id } = useParams();

  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [price, setPrice] = useState("");
  const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);
  const [busRouteId, setBusRouteId] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const busRoutes = (await busRouteService.get()).data;
      setBusRoutes(busRoutes);
    }
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      const monthTicketPrice = (await monthTicketPriceService.getById(id as string)).data;
      setTimeStart(monthTicketPrice.timeStart);
      setTimeEnd(monthTicketPrice.timeEnd);
      setPrice(monthTicketPrice.price.toString());
      setBusRouteId(monthTicketPrice.busRouteId);
    }
    fetchApi();
  }, [id]);

  return (
    <>
      <GoBack />

      <BoxHead title="Chi Tiết Giá Vé Tháng Của Tuyến" />

      <div style={{ display: "flex", gap: "16px" }}>
        <BoxInput type="date" label="TG Bắt Đầu" value={timeStart} onChange={() => { }} />
        <BoxInput type="date" label="TG Kết Thúc" value={timeEnd} onChange={() => { }} />
      </div>

      <BoxInput type="number" label="Giá Vé" value={price} onChange={() => { }} />

      <BoxSelect
        value={busRouteId}
        label="Tuyến"
        options={busRoutes?.map(item => ({ value: item._id, label: item.name })) || []}
        onChange={() => { }}
      />

    </>
  );
}

export default MonthTicketPriceDetail;