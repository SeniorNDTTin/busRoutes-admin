import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxCreate from "../../components/boxCreate";

import configs from "../../configs";
import busService from "../../services/bus.service";

function BusCreate() {
  const navigate = useNavigate();

  const [licensePlate, setLicensePlate] = useState("");
  const [chairQuantity, setChairQuantity] = useState<number | "">("");

  const onChangeLicensePlate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLicensePlate(e.target.value);
  };

  const onChangeChairQuantity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChairQuantity(e.target.value ? Number(e.target.value) : "");
  };

  const handleSubmit = async () => {
    if (!licensePlate || chairQuantity === "") {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await busService.create({ licensePlate, chairQuantity });
    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/buses`);
  };

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Xe Bus" />

      <BoxInput label="Biển số xe" value={licensePlate} onChange={onChangeLicensePlate} type="text" />
      <BoxInput label="Số lượng ghế" value={chairQuantity} onChange={onChangeChairQuantity} type="number" />

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default BusCreate;
