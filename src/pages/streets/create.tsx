import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";
import BoxUpdate from "../../components/boxUpdate";

import configs from "../../configs";

import wardService from "../../services/ward.service";
import IDistrict from "../../interfaces/district";
import districtService from "../../services/district.service";

function WardCreate() {
  const navigate = useNavigate();

  const [name, setname] = useState("");
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [districtId, setDistrictId] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const districts = (await districtService.get()).data;
      setDistricts(districts);
    }
    fetchApi();
  }, []);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setname(e.target.value);
  }
  const onChangeDistrictId = (value: string) => {
    setDistrictId(value);
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !districtId
    ) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await wardService.create({ name, districtId });
    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/wards`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Xã Phường" />

      <BoxInput label="Tên" value={name} onChange={onChangeName} />

      {districts.length && (
        <BoxSelect
          value={districtId}
          label="Quận/Huyện"
          options={districts.map(item => ({ value: item._id, label: item.name }))}
          onChange={onChangeDistrictId}
        />
      )}

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default WardCreate