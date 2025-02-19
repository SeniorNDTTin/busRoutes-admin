import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import busService from "../../services/bus.service";

function BusDetail() {
  const { id } = useParams();

  // Đổi licensePlate về kiểu string
  const [licensePlate, setLicensePlate] = useState<string>(""); 
  const [chairQuantity, setChairQuantity] = useState<number | "">("");

  useEffect(() => {
    const fetchApi = async () => {
      if (id) {
        try {
          const bus = (await busService.getById(id as string)).data;

          setLicensePlate(bus.licensePlate); // Đảm bảo là kiểu string
          setChairQuantity(bus.chairQuantity); // Số ghế vẫn có thể là number hoặc ""
        } catch (error) {
          console.error("Error fetching bus details:", error);
        }
      }
    };

    fetchApi();
  }, [id]);

  return (
    <>
      <GoBack />

      <BoxHead title="Chi Tiết Xe Bus" />

      <BoxInput label="Biển số xe" value={licensePlate} onChange={() => { }} />
      <BoxInput label="Số lượng ghế" value={chairQuantity} onChange={() => { }} type="number" />
    </>
  );
}

export default BusDetail;
