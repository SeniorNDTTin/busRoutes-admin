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

  // Cách 1: Ép kiểu số sang chuỗi
  const [unitPrice, setUnitPrice] = useState("");

  useEffect(() => {
    const fetchPrice = async () => {
      const priceData = (await oneWayTicketPriceService.getById(id as string)).data;
      setUnitPrice(priceData.unitPrice.toString()); // Chuyển number thành string
    };
    fetchPrice();
  }, [id]);

  const onChangeUnitPrice = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUnitPrice(e.target.value);
  };

  const handleSubmit = async () => {
    if (!unitPrice) {
      toast.error("Vui lòng nhập giá vé!");
      return;
    }

    const response = await oneWayTicketPriceService.update(id as string, { unitPrice: Number(unitPrice) }); // Chuyển string thành number
    if (response.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Cập nhật thành công!");
    navigate(`/${configs.prefixAdmin}/one-way-ticket-prices`);
  };

  return (
    <>
      <GoBack />
      <BoxHead title="Cập Nhật Giá Vé Một Chiều" />
      <BoxInput label="Giá vé" value={unitPrice} onChange={onChangeUnitPrice} />
      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default OneWayTicketPriceUpdate;
