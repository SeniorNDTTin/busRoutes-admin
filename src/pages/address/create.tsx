import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxCreate from "../../components/boxCreate";

import configs from "../../configs";

import addressService from "../../services/address..service";

function AddressCreate() {
  const navigate = useNavigate();

  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");

  const onChangeStreet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreet(e.target.value);
  }
  const onChangeWard = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWard(e.target.value);
  }
  const onChangeDistrict = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistrict(e.target.value);
  }

  const handleSubmit = async () => {
    if (
      !street ||
      !ward ||
      !district
    ) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await addressService.create({
      street,
      ward,
      district
    });
    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/addresses`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Địa Chỉ" />

      <BoxInput label="Tên đường" value={street} onChange={onChangeStreet} />
      <BoxInput label="Phường" value={ward} onChange={onChangeWard} />
      <BoxInput label="Quận" value={district} onChange={onChangeDistrict} />

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default AddressCreate;