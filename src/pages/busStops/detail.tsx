import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";

import busStopService from "../../services/busStop.service";
import IDistrict from "../../interfaces/district";
import districtService from "../../services/district.service";
import IWard from "../../interfaces/ward";
import wardService from "../../services/ward.service";
import IStreet from "../../interfaces/street";
import streetService from "../../services/street.service";

function BusStopDetail() {
  const { id } = useParams();

  const [name, setname] = useState("");
  const [longitude, setlongitude] = useState("");
  const [latitude, setlatitude] = useState("");
  const [streets, setStreets] = useState<IStreet[]>([]);
  const [streetId, setStreetId] = useState("");
  const [wards, setWards] = useState<IWard[]>([]);
  const [wardId, setWardId] = useState("");
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
      const wards = (await wardService.get()).data;
      setWards(wards);
    }
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      const streets = (await streetService.get()).data;
      setStreets(streets);
    }
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      const busStop = (await busStopService.getById(id as string)).data;
      setname(busStop.name);
      setlongitude(busStop.longitude.toString());
      setlatitude(busStop.latitude.toString());
      setStreetId(busStop.streetId);

      const street = (await streetService.getById(busStop.streetId)).data;
      setWardId(street.wardId);

      const ward = (await wardService.getById(street.wardId)).data;
      setDistrictId(ward.districtId);
    }
    fetchApi();
  }, [id]);

  return (
    <>
      <GoBack />

      <BoxHead title="Chi Tiết Trạm Dừng" />

      <BoxInput label="Tên" value={name} onChange={() => { }} />

      <div style={{ display: "flex", gap: "16px" }}>
        <BoxInput label="Kinh độ" value={longitude} onChange={() => { }} />
        <BoxInput label="Vĩ độ" value={latitude} onChange={() => { }} />
      </div>

      <BoxSelect
        value={districtId}
        label="Quận/Huyện"
        options={districts?.map(item => ({ value: item._id, label: item.name })) || []}
        onChange={() => { }}
      />

      <BoxSelect
        value={wardId}
        label="Xã/Phường"
        options={wards?.map(item => ({ value: item._id, label: item.name })) || []}
        onChange={() => { }}
      />

      <BoxSelect
        value={streetId}
        label="Đường"
        options={streets?.map(item => ({ value: item._id, label: item.name })) || []}
        onChange={() => { }}
      />

    </>
  );
}

export default BusStopDetail;