import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxUpdate from "../../components/boxUpdate";
import BoxSelect from "../../components/boxSelect";
import BoxInput from "../../components/boxInputMonthTicketPrice";

import configs from "../../configs";

import monthTicketPriceService from "../../services/monthTicketPrice.service";
import IBusRoute from "../../interfaces/busRoute";
import busRouteService from "../../services/busRoute.service";

function MonthTicketPriceUpdate() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [monthTicketPrice, setMonthTicketPrice] = useState({
    timeStart: "",
    timeEnd: "",
    price: 0,
    busRouteId: ""
  });
  const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const monthTicketPrice = (await monthTicketPriceService.getById(id as string)).data;
  
      setMonthTicketPrice(monthTicketPrice);
    };
    fetchApi();
  }, [id]);

  useEffect(() => {
    const fetchApi = async () => {
      const busRoutes = (await busRouteService.get()).data;
      setBusRoutes(busRoutes);
    };
    fetchApi();
  }, []);

  const handleChange = (name: string, value: string | number) => {  
    setMonthTicketPrice((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value
    }));
  };  

  const handleSubmit = async () => {
    const data = {...monthTicketPrice} 
    if (
      !monthTicketPrice.timeStart ||
      !monthTicketPrice.timeEnd ||
      !monthTicketPrice.price ||
      !monthTicketPrice.busRouteId 
    ) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    if (monthTicketPrice.price <= 0) {
      toast.error("Giá vé không hợp lệ");
      return;
    }

    if (monthTicketPrice.timeStart >= monthTicketPrice.timeEnd) {
      toast.error("Khoảng thời gian không hợp lệ");
      return;
    }

    const response = await monthTicketPriceService.update(id as string, data);

    if (response.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Cập nhật thành công!");
    navigate(`/${configs.prefixAdmin}/month-ticket-prices`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Cập Nhật Giá Vé Tháng Cho Tuyến" />

      <div style={{ display: "flex", gap: "16px" }}>
        <BoxInput type="date" name="timeStart" label="Thời Gian Bắt Đầu" value={monthTicketPrice.timeStart ?? ""} onChange={handleChange} />
        <BoxInput type="date" name="timeEnd" label="Thời Gian Kết Thúc" value={monthTicketPrice.timeEnd ?? ""} onChange={handleChange} />
      </div>

      <BoxInput type="number" name="price" label="Giá Vé" value={monthTicketPrice.price ?? 0} onChange={handleChange} />

      <BoxSelect
        value={monthTicketPrice.busRouteId}
        label="Tuyến"
        options={busRoutes?.map(item => ({ value: item._id, label: item.name })) || []}
        onChange={(value) => handleChange("busRouteId", value)}
      />

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default MonthTicketPriceUpdate;