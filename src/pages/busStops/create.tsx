import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";
import BoxCreate from "../../components/boxCreate";

import configs from "../../configs";

import busStopService from "../../services/busStop.service";
import IDistrict from "../../interfaces/district";
import districtService from "../../services/district.service";
import IWard from "../../interfaces/ward";
import wardService from "../../services/ward.service";
import IStreet from "../../interfaces/street";
import streetService from "../../services/street.service";

function BusStopCreate() {
  const navigate = useNavigate();

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
    };
    fetchApi();
  }, []);
  
  useEffect(() => {
    const fetchApi = async () => {
      if (!districtId) {
        setWards([]);
        return;
      }
      const wards = (await wardService.findByDistrict(districtId)).data;
      setWards(wards);
    }
    fetchApi();
  }, [districtId]);

  useEffect(() => {
    const fetchApi = async () => {
      if (!wardId) {
        setStreets([]);
        return;
      }
      const streets = (await streetService.findByWard(wardId)).data;
      setStreets(streets);
    }
    fetchApi();
  }, [wardId]);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setname(e.target.value);
  }
  const onChangeLongitude = (e: React.ChangeEvent<HTMLInputElement>) => {
    setlongitude(e.target.value);
  }
  const onChangeLatitude = (e: React.ChangeEvent<HTMLInputElement>) => {
    setlatitude(e.target.value);
  }
  const onChangeDistrictId = (value: string) => {
    setDistrictId(value);
    setWardId(""); // Reset Xã/Phường khi đổi Quận/Huyện
    setStreetId(""); 
  };
  const onChangeWardId = (value: string) => {
    setWardId(value);
    setStreetId(""); // Reset đường khi đổi xã/phường
  };
  const onChangeStreetId = (value: string) => {
    setStreetId(value);
  };

  const handleSubmit = async () => {
    if (
      !name ||
      !longitude ||
      !latitude ||
      !districtId ||
      !wardId ||
      !streetId
    ) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const longitudeValue = parseFloat(longitude);
    const latitudeValue = parseFloat(latitude);

    if(isNaN(longitudeValue) || isNaN(latitudeValue)) {
      toast.error("Kinh độ và vĩ độ phải là số hợp lệ")
    }

    const response = await busStopService.create({ 
      name, 
      longitude: longitudeValue, 
      latitude: latitudeValue, 
      streetId 
    });

    console.log(response);

    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/bus-stops`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Trạm Dừng" />

      <BoxInput label="Tên" value={name} onChange={onChangeName} />

      <div style={{ display: "flex", gap: "16px" }}>
        <BoxInput label="Kinh độ" value={longitude} onChange={onChangeLongitude} />
        <BoxInput label="Vĩ độ" value={latitude} onChange={onChangeLatitude} />
      </div>

      <BoxSelect
        value={districtId}
        label="Quận/Huyện"
        options={districts?.map(item => ({ value: item._id, label: item.name })) || []}
        onChange={onChangeDistrictId}
      />

      <BoxSelect
        value={wardId}
        label="Xã/Phường"
        options={wards?.map(item => ({ value: item._id, label: item.name })) || []}
        onChange={onChangeWardId}
      />

      <BoxSelect
        value={streetId}
        label="Đường"
        options={streets?.map(item => ({ value: item._id, label: item.name })) || []}
        onChange={onChangeStreetId}
      />

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default BusStopCreate