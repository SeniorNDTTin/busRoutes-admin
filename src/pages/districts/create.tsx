import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxCreate from "../../components/boxCreate";

import configs from "../../configs";

import districtService from "../../services/district.service";

function DistrictCreate() {
  const navigate = useNavigate();

  const [name, setname] = useState("");

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setname(e.target.value);
  }

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await districtService.create({ name });
    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/districts`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Quận/Huyện" />

      <BoxInput label="Tên" value={name} onChange={onChangeName} />

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default DistrictCreate;