import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";

import IDistrict from "../../interfaces/district";

import wardService from "../../services/ward.service";
import districtService from "../../services/district.service";

function WardDetail() {
  const { id } = useParams();

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

  return (
    <>
      <GoBack />

      <BoxHead title="Chi Tiết Xã/Phường" />

      <BoxInput label="Tên" value={name} onChange={() => { }} />

      {districts.length && (
        <BoxSelect
          value={districtId}
          label="Quận/Huyện"
          options={districts.map(item => ({ value: item._id, label: item.name }))}
          onChange={() => { }}
        />
      )}
    </>
  );
}

export default WardDetail;