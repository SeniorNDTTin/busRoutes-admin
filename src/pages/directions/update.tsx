import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import directionService from "../../services/direction.service";
import GoBack from "../../components/goBack";
import BoxUpdate from "../../components/boxUpdate";

function DirectionUpdate() {
  const { id } = useParams();
  const navigate = useNavigate(); // Thêm useNavigate để điều hướng

  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const direction = (await directionService.getById(id as string)).data;
      setDescription(direction.description);
    };
    fetchApi();
  }, [id]);

  const onChangeDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async () => {
    if (!description) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await directionService.update(id as string, { description });
    if (response.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Cập nhật thành công!");
    
    // Chuyển hướng sau khi cập nhật thành công
    navigate("/admin/directions");
  };

  return (
    <>
      <GoBack />

      <BoxHead title="Cập Nhật Hướng" />

      <BoxInput label="Mô tả" value={description} onChange={onChangeDescription} />

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default DirectionUpdate;
