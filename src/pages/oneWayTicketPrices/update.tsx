import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxCreate from "../../components/boxCreate";

import configs from "../../configs";
import oneWayTicketPriceService from "../../services/oneWayTicketPrices.ts";

function OneWayTicketPriceUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [unitPrice, setUnitPrice] = useState("");
  const [busRouteId, setBusRouteId] = useState(""); // Thêm state để lưu busRouteId

  useEffect(() => {
    const fetchPrice = async () => {
      try {
        const response = await oneWayTicketPriceService.getById(id as string);

        console.log("API Response:", response); // 👉 Xem dữ liệu trả về từ API

        if (response.code === 200 && response.data) {
          setUnitPrice(response.data.unitPrice.toString());
          setBusRouteId(response.data.busRouteId); // Lưu busRouteId từ API
        } else {
          toast.error("Không tìm thấy giá vé!");
        }
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu giá vé:", error);
        toast.error("Lỗi khi lấy dữ liệu giá vé!");
      }
    };

    fetchPrice();
  }, [id]);

  const onChangeUnitPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitPrice(e.target.value);
  };

  const handleSubmit = async () => {
    if (!unitPrice) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }
  
    try {
      const unitPriceValue = parseFloat(unitPrice);
      if (isNaN(unitPriceValue) || unitPriceValue <= 0) {
        toast.error("Giá vé không hợp lệ!");
        return;
      }
  
      // Gửi cả unitPrice và busRouteId để tránh lỗi 404
      const updateData = { unitPrice: unitPriceValue, busRouteId };
      console.log("Dữ liệu gửi lên API:", updateData);
  
      const response = await oneWayTicketPriceService.update(id as string, updateData);
  
      console.log("API Update Response:", response); // Kiểm tra phản hồi từ API
  
      // ✅ Kiểm tra nếu API trả về code 200 hoặc 201 thì hiển thị thành công
      if (response.code === 200 || response.code === 201) {
        toast.success("Cập nhật thành công!");
        navigate(`/${configs.prefixAdmin}/one-way-ticket-prices`);
      } else {
        toast.error("Có lỗi xảy ra khi cập nhật!");
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật giá vé:", error);
      toast.error("Lỗi khi cập nhật dữ liệu!");
    }
  };
  

  return (
    <>
      <GoBack />
      <BoxHead title="Cập Nhật Giá Vé Một Chiều" />
      <BoxInput label="Giá vé" value={unitPrice} onChange={onChangeUnitPrice} type="number" />
      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default OneWayTicketPriceUpdate;
