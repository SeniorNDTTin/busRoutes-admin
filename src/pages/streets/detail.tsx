import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";

import IWard from "../../interfaces/ward";
import IDistrict from "../../interfaces/district";

import streetService from "../../services/street.service";
import wardService from "../../services/ward.service";
import districtService from "../../services/district.service";

function StreetDetail() {
  const { id } = useParams();

  const [name, setname] = useState("");
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [wards, setWards] = useState<IWard[]>([]);
  const [districtId, setDistrictId] = useState("");
  const [wardId, setWardId] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const districts = (await districtService.get()).data;
      setDistricts(districts);
    }
    fetchApi();
  }, []);

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

      const ward = (await wardService.getById(street.wardId)).data;
      setDistrictId(ward.districtId);
    }
    fetchApi();
  }, [id]);

  return (
    <>
      <GoBack />

      <BoxHead title="Chi Tiết Đường" />

      <BoxInput label="Tên" value={name} onChange={() => { }} />

      {wards.length && (
        <BoxSelect
          value={wardId}
          label="Xã/Phường"
          options={wards.map(item => ({ value: item._id, label: item.name }))}
          onChange={() => { }}
        />
      )}

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

export default StreetDetail;