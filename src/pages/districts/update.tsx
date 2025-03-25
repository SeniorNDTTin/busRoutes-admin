import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import districtService from "../../services/district.service";
import GoBack from "../../components/goBack";
import BoxUpdate from "../../components/boxUpdate";

function DistrictUpdate() {
  const { id } = useParams();

  const [name, setName] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const district = (await districtService.getById(id as string)).data;

      setName(district.name);
    }
    fetchApi();
  }, [id]);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  }

  const handleSubmit = async () => {
    if (!name) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await districtService.update(id as string, { name });
    if (response.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Cập nhật thành công!");
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Cập Nhật Quận/Huyện" />

      <BoxInput label="Tên" value={name} onChange={onChangeName} />

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default DistrictUpdate;