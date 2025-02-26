import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";
import BoxUpdate from "../../components/boxUpdate";

import configs from "../../configs";

import streetService from "../../services/street.service";
import IWard from "../../interfaces/ward";
import wardService from "../../services/ward.service";

function StreetCreate() {
  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [wards, setWards] = useState<IWard[]>([]);
  const [wardId, setWardId] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const wards = (await wardService.get()).data;
      setWards(wards);
    }
    fetchApi();
  }, []);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setname(e.target.value);
  }
  const onChangeWardId = (value: string) => {
    setWardId(value);
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !wardId
    ) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await streetService.create({ name, wardId });
    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/streets`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Đường" />

      <BoxInput label="Tên" value={name} onChange={onChangeName} />

      {wards.length && (
        <BoxSelect
          value={wardId}
          label="Xã / Phường"
          options={wards.map(item => ({ value: item._id, label: item.name }))}
          onChange={onChangeWardId}
        />
      )}

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default StreetCreate