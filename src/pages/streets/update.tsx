import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxCreate from "../../components/boxCreate";
import BoxSelect from "../../components/boxSelect";

import configs from "../../configs";

import streetService from "../../services/street.service";
import IWard from "../../interfaces/ward";
import wardService from "../../services/ward.service";

function StreetUpdate() {
  const { id } = useParams();

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

  useEffect(() => {
    const fetchApi = async () => {
      const street = (await streetService.getById(id as string)).data;

      setname(street.name);
      setWardId(street.wardId);
    }
    fetchApi();
  }, [id]);

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

    const response = await streetService.update(id as string, { name, wardId });
    if (response.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Cập nhật thành công!");
    navigate(`/${configs.prefixAdmin}/streets`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Cập Nhật Đường" />

      <BoxInput label="Tên" value={name} onChange={onChangeName} />

      {wards.length && (
        <BoxSelect
          value={wardId}
          label="Quận/Huyện"
          options={wards.map(item => ({ value: item._id, label: item.name }))}
          onChange={onChangeWardId}
        />
      )}

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default StreetUpdate;