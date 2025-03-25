import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";

import IBusStop from "../../interfaces/busStop";
import busStopService from "../../services/busStop.service";
import IDistrict from "../../interfaces/district";
import districtService from "../../services/district.service";
import IWard from "../../interfaces/ward";
import wardService from "../../services/ward.service";
import IStreet from "../../interfaces/street";
import streetService from "../../services/street.service";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import busStopIcon from "../../assets/admin/bus_stop2.png";
import styles from "../../assets/admin/busStop.module.scss";

interface Position {
  lat: number;
  lng: number;
}

function BusStopDetail() {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const mapPosition: Position = {
    lat: 10.036718000266058,
    lng: 105.78768579479011,
  };

  const [busStops, setBusStops] = useState<IBusStop[]>([]);
  const [streets, setStreets] = useState<IStreet[]>([]);
  const [streetId, setStreetId] = useState("");
  const [wards, setWards] = useState<IWard[]>([]);
  const [wardId, setWardId] = useState("");
  const [districts, setDistricts] = useState<IDistrict[]>([]);
  const [districtId, setDistrictId] = useState("");

  // Khởi tạo icon cho marker trạm dừng
  const createBusIcon = (color: string) =>
    L.divIcon({
      html: `<div style="
          background-color: ${color}; 
          width: 30px; 
          height: 35px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border-radius: 50%; 
          position: relative;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);">
          <img src="${busStopIcon}" style="width: 20px; height: 20px; border-radius: 50%;" />
          <div style="
              position: absolute;
              bottom: -7px; 
              left: 50%;
              width: 0;
              height: 0;
              border-left: 7px solid transparent;
              border-right: 7px solid transparent;
              border-top: 10px solid ${color};
              transform: translateX(-50%);
          "></div>
        </div>`,
      iconSize: [0, 0],
      iconAnchor: [15, 42],
      popupAnchor: [0, -45]
    });
  const busIcon = createBusIcon("#65ffa5");
  const currentBusIcon = createBusIcon("#ffa500");

  useEffect(() => {
    const fetchApi = async () => {
      const districts = (await districtService.get()).data;
      setDistricts(districts);
      const wards = (await wardService.get()).data;
      setWards(wards);
      const streets = (await streetService.get()).data;
      setStreets(streets);

      const busStops = (await busStopService.get()).data;
      setBusStops(busStops);
    }
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      const busStop = (await busStopService.getById(id as string)).data;
      setName(busStop.name);
      setLongitude(busStop.longitude.toString());
      setLatitude(busStop.latitude.toString());
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

      <div className={styles.home}>
        <div className={styles.wrapper}>
          <h3>Vị trí của trạm dừng trên bản đồ</h3>
          <div className={styles.map}>
            <MapContainer center={mapPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
              {/* Hiển thị marker của các trạm dừng đã có */}
              {busStops.map((point) => (
                <Marker key={point._id} position={[point.latitude, point.longitude]} icon={point._id===id ? currentBusIcon : busIcon} />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

      <div className={styles["input-group"]}>
        <BoxInput label="Kinh độ" value={longitude} onChange={() => { }} />
        <BoxInput label="Vĩ độ" value={latitude} onChange={() => { }} />
      </div>

      <div className={styles["select-group"]}>
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
      </div>
    </>
  );
}

export default BusStopDetail;