import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxSelect from "../../components/boxSelect";
import BoxCreate from "../../components/boxCreate";
import BoxInput from "../../components/boxInputMonthTicketPrice";

import configs from "../../configs";

import monthTicketPriceService from "../../services/monthTicketPrice.service";
import IBusRoute from "../../interfaces/busRoute";
import busRouteService from "../../services/busRoute.service";

function MonthTicketPriceCreate() {
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

    // ngày giờ phải định dạng hợp lệ (dùng DatePicker), start < end
    // giá là số nguyên và > 0

    if (monthTicketPrice.price <= 0) {
      toast.error("Giá vé không hợp lệ");
      return;
    }

    if (monthTicketPrice.timeStart >= monthTicketPrice.timeEnd) {
      toast.error("Khoảng thời gian không hợp lệ");
      return;
    }

    const response = await monthTicketPriceService.create(data);

    console.log(response);

    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/month-ticket-prices`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Giá Vé Tháng Cho Tuyến" />

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

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default MonthTicketPriceCreate