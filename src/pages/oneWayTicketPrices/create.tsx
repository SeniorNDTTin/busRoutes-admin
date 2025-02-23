import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxUpdate from "../../components/boxUpdate";
import BoxSelect from "../../components/boxSelect";

import configs from "../../configs";

import busRouteService from "../../services/busRoute.service";
import oneWayTicketPriceService from "../../services/oneWayTicketPrices.ts";

import IBusRoute from "../../interfaces/busRoute";

function OneWayTicketPriceCreate() {
  const navigate = useNavigate();

  const [busRouteId, setBusRouteId] = useState("");
  const [maxKilometer, setMaxKilometer] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const response = await busRouteService.get();
      setBusRoutes(response.data);
    };
    fetchApi();
  }, []);

  const onChangeBusRouteId = (value: string) => {
    setBusRouteId(value);
  };

  const onChangeMaxKilometer = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMaxKilometer(e.target.value);
  };

  const onChangeUnitPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitPrice(e.target.value);
  };

  const handleSubmit = async () => {
    if (!busRouteId || !maxKilometer || !unitPrice) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await oneWayTicketPriceService.create({
      busRouteId,
      maxKilometer: Number(maxKilometer),
      unitPrice: Number(unitPrice),
    });

    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/one-way-ticket-prices`);
  };

  return (
    <>
      <GoBack />
      <BoxHead title="Tạo Mới Giá Vé Một Chiều" />

      {busRoutes.length > 0 && (
        <BoxSelect
          value={busRouteId}
          label="Tuyến xe buýt"
          options={busRoutes.map((route) => ({
            value: route._id,
            label: route.name,
          }))}
          onChange={onChangeBusRouteId}
        />
      )}

      <BoxInput label="Số Km Tối Đa" value={maxKilometer} onChange={onChangeMaxKilometer} type="number" />
      <BoxInput label="Giá tiền" value={unitPrice} onChange={onChangeUnitPrice} type="number" />

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default OneWayTicketPriceCreate;
