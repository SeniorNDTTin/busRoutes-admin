import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import busService from "../../services/bus.service";
import BoxUpdate from "../../components/boxUpdate";

function BusUpdate() {
  const { id } = useParams(); // Lấy id từ URL
  const navigate = useNavigate();

  // Khai báo state với kiểu number hoặc chuỗi rỗng
  const [licensePlate, setLicensePlate] = useState<string>(""); // Biển số xe dạng chuỗi
  const [chairQuantity, setChairQuantity] = useState<number | "">(""); // Số lượng ghế dạng number hoặc chuỗi rỗng

  // Fetch thông tin xe bus khi load component
  useEffect(() => {
    const fetchApi = async () => {
      if (id) {
        try {
          const bus = (await busService.getById(id)).data;
          // Chuyển đổi giá trị từ API thành kiểu number hoặc chuỗi rỗng và gán vào state
          setLicensePlate(bus.licensePlate || ""); // Giữ nguyên kiểu chuỗi
          setChairQuantity(bus.chairQuantity ? bus.chairQuantity : ""); // Giữ nguyên kiểu number hoặc chuỗi rỗng
        } catch (error) {
          toast.error("Lỗi khi lấy dữ liệu xe bus");
        }
      }
    };
    fetchApi();
  }, [id]);

  const onChangeLicensePlate = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Biển số xe có thể là chuỗi, không chuyển thành number
    setLicensePlate(e.target.value);
  };

  const onChangeChairQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setChairQuantity(value === "" ? "" : Number(value)); // Nếu rỗng thì giữ chuỗi rỗng, nếu có giá trị thì chuyển thành số
  };

  const handleSubmit = async () => {
    if (!licensePlate || !chairQuantity) {
      toast.error("sai thông tin!");
      return;
    }
  
    // Kiểm tra kiểu dữ liệu của số ghế (chỉ cần kiểm tra với number)
    const numberChairQuantity = Number(chairQuantity);
  
    if (isNaN(numberChairQuantity) || licensePlate.trim() === "") {
      toast.error("Dữ liệu không hợp lệ!");
      return;
    }
  
    try {
     
      const response = await busService.update(id as string, {
        licensePlate: licensePlate.trim(),  // Biển số xe không cần chuyển thành number
        chairQuantity: numberChairQuantity,
      });
      console.log(
        response
      )
      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
  
      toast.success("Cập nhật thành công!");
      navigate(`/admin/buses`);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi cập nhật thông tin xe bus");
    }
  };
  
  return (
    <>
      <GoBack />

      <BoxHead title="Cập Nhật Xe Bus" />

      <BoxInput
        label="Biển số xe"
        value={licensePlate}
        onChange={onChangeLicensePlate}
        type="text" // Biển số xe là chuỗi
      />

      <BoxInput
        label="Số lượng ghế"
        value={chairQuantity}
        onChange={onChangeChairQuantity}
        type="number"
      />

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default BusUpdate;
