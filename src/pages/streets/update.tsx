import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxCreate from "../../components/boxCreate";
import BoxSelect from "../../components/boxSelect";

import configs from "../../configs";

import wardService from "../../services/ward.service";
import IDistrict from "../../interfaces/district";
import districtService from "../../services/district.service";

function WardUpdate() {
  const { id } = useParams();

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

  useEffect(() => {
    const fetchApi = async () => {
      const ward = (await wardService.getById(id as string)).data;

      setname(ward.name);
      setDistrictId(ward.districtId);
    }
    fetchApi();
  }, [id]);

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

    const response = await wardService.update(id as string, { name, districtId });
    if (response.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Cập nhật thành công!");
    navigate(`/${configs.prefixAdmin}/wards`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Cập Nhật Xã/Phường" />

      <BoxInput label="Tên" value={name} onChange={onChangeName} />

      {districts.length && (
        <BoxSelect
          value={districtId}
          label="Quận/Huyện"
          options={districts.map(item => ({ value: item._id, label: item.name }))}
          onChange={onChangeDistrictId}
        />
      )}

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default WardUpdate;