import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxCreate from "../../components/boxCreate";

import configs from "../../configs";

import directionService from "../../services/direction.service";

function DirectionCreate() {
  const navigate = useNavigate();

  const [description, setDescription] = useState("");

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (!description) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await directionService.create({ description });
    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/directions`);
  };

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Hướng" />

      <BoxInput label="Mô tả" value={description} onChange={onChangeDescription} />

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default DirectionCreate;
