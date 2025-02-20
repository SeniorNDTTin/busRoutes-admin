import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";

import IBusRoute from "../../interfaces/busRoute";
import IOneWayTicketPrice from "../../interfaces/OneWayTicketPrices.ts";
import oneWayTicketPriceService from "../../services/oneWayTicketPrices.ts";
import busRouteService from "../../services/busRoute.service";

function OneWayTicketPriceDetail() {
  const { id } = useParams();

  const [busRouteId, setBusRouteId] = useState("");
  const [maxKilometer, setMaxKilometer] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);
  const [ticketPrices, setTicketPrices] = useState<IOneWayTicketPrice[]>([]);

  // Lấy danh sách tuyến đường & giá vé
  useEffect(() => {
    const fetchData = async () => {
      try {
        const routeResponse = await busRouteService.get();
        const priceResponse = await oneWayTicketPriceService.get();
        setBusRoutes(routeResponse.data);
        setTicketPrices(priceResponse.data);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };
    fetchData();
  }, []);

  // Lấy thông tin giá vé khi có ID
  useEffect(() => {
    if (!id) return;
    const fetchTicketPrice = async () => {
      const ticketPrice = (await oneWayTicketPriceService.getById(id)).data;
      setBusRouteId(ticketPrice.busRouteId);
      setMaxKilometer(ticketPrice.maxKilometer.toString());
      setUnitPrice(ticketPrice.unitPrice.toString());
    };
    fetchTicketPrice();
  }, [id]);

  // Xử lý khi chọn tuyến đường
  const handleRouteChange = (selectedRouteId: string) => {
    setBusRouteId(selectedRouteId);

    // Tìm giá vé tương ứng với tuyến đường đã chọn
    const selectedPrice = ticketPrices.find(price => price.busRouteId === selectedRouteId);

    if (selectedPrice) {
      setMaxKilometer(selectedPrice.maxKilometer.toString());
      setUnitPrice(selectedPrice.unitPrice.toString());
    } else {
      setMaxKilometer("");
      setUnitPrice("");
    }
  };

  return (
    <>
      <GoBack />
      <BoxHead title="Chi Tiết Giá Vé Một Chiều" />

      {busRoutes.length > 0 && (
        <BoxSelect
          value={busRouteId}
          label="Tuyến xe buýt"
          options={busRoutes.map(route => ({
            value: route._id,
            label: route.name,
          }))}
          onChange={handleRouteChange}
        />
      )}

      <BoxInput label="Số Km Tối Đa" value={maxKilometer} onChange={() => {}} type="number" />
      <BoxInput label="Giá tiền" value={unitPrice} onChange={() => {}} type="number" />
    </>
  );
}

export default OneWayTicketPriceDetail;
