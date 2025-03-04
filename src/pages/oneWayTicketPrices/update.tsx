import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxCreate from "../../components/boxCreate";
import BoxSelect from "../../components/boxSelect";

import configs from "../../configs";
import busRouteService from "../../services/busRoute.service";
import oneWayTicketPriceService from "../../services/oneWayTicketPrices.service.ts";

import IBusRoute from "../../interfaces/busRoute";

function OneWayTicketPriceUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [busRouteId, setBusRouteId] = useState("");
  const [maxKilometer, setMaxKilometer] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Lấy danh sách tuyến xe buýt
        const routeResponse = await busRouteService.get();
        setBusRoutes(routeResponse.data);

        // Lấy thông tin giá vé cần cập nhật
        const priceResponse = await oneWayTicketPriceService.getById(id as string);
        console.log("API GetById Response:", priceResponse);

        if (priceResponse.code === 200 && priceResponse.data) {
          setBusRouteId(priceResponse.data.busRouteId);
          setMaxKilometer(priceResponse.data.maxKilometer.toString());
          setUnitPrice(priceResponse.data.unitPrice.toString());
        } else {
          toast.error(`Không tìm thấy giá vé! Mã lỗi: ${priceResponse.code}`);
        }
      } catch (error: any) {
        console.error("Lỗi khi lấy dữ liệu:", error.response?.data || error.message);
        toast.error("Lỗi khi lấy dữ liệu!");
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (!busRouteId || !maxKilometer || !unitPrice) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    try {
      const updateData = {
        busRouteId,
        maxKilometer: Number(maxKilometer),
        unitPrice: Number(unitPrice),
      };

      console.log("Dữ liệu gửi lên API:", updateData);
      const response = await oneWayTicketPriceService.update(id as string, updateData);

      console.log("API Update Response:", response);
      if (response.code === 200 || response.code === 201) {
        toast.success("Cập nhật thành công!");
        navigate(`/${configs.prefixAdmin}/one-way-ticket-prices`);
      } else {
        toast.error(`Có lỗi xảy ra khi cập nhật: ${response.message || `Mã lỗi ${response.code}`}`);
      }
    } catch (error: any) {
      console.error("Lỗi khi cập nhật:", error.response?.data || error.message);
      toast.error(
        `Lỗi khi cập nhật dữ liệu: ${error.response?.data?.message || error.message || "Không rõ nguyên nhân"}`
      );
    }
  };

  return (
    <>
      <GoBack />
      <BoxHead title="Cập Nhật Giá Vé Một Chiều" />

      {busRoutes.length > 0 && (
        <BoxSelect
          label="Tuyến xe buýt"
          value={busRouteId}
          options={busRoutes.map((route) => ({
            value: route._id,
            label: route.name,
          }))}
          onChange={(value) => setBusRouteId(value)}
        />
      )}

      <BoxInput
        label="Số Km Tối Đa"
        value={maxKilometer}
        onChange={(e) => setMaxKilometer(e.target.value)}
        type="number"
      />
      <BoxInput
        label="Giá vé"
        value={unitPrice}
        onChange={(e) => setUnitPrice(e.target.value)}
        type="number"
      />

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default OneWayTicketPriceUpdate;