import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxSelect from "../../components/boxSelect";
import BoxCreate from "../../components/boxCreate";

import configs from "../../configs";

import IBusStop from "../../interfaces/busStop";
import busStopService from "../../services/busStop.service";
import IDistrict from "../../interfaces/district";
import districtService from "../../services/district.service";
import IWard from "../../interfaces/ward";
import wardService from "../../services/ward.service";
import IStreet from "../../interfaces/street";
import streetService from "../../services/street.service";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import busStopIcon from "../../assets/admin/bus_stop2.png";
import styles from "../../assets/admin/busStop.module.scss";

interface Position {
  lat: number;
  lng: number;
}

// Hàm gọi Reverse Geocoding từ Nominatim
const reverseGeocode = async (lat: number, lng: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
  try {
    const res = await fetch(url); // gửi HTTT request đến API bằng fetch
    const data = await res.json(); // chuyển kq về json
    console.log(data.address);
    return data.address; // trả về object chứa thông tin địa chỉ
  } catch (error) {
    console.error("Reverse geocoding error:", error);
    return null;
  }
};

// Chuẩn hóa lại tên địa chỉ trả về từ object
function normalizeName(name: string): string {
  return name
    .replace(/^(quận|huyện|xã|phường|đường)\s+/i, "")  // Loại bỏ từ ở đầu chuỗi, không phân biệt chữ thường/hoa
    .trim();
}

// Hàm tiện ích mapping tên thành id dựa trên danh sách đối tượng có cấu trúc { _id, name }
function mapNameToId<T extends { _id: string; name: string }>(name: string, list: T[]): string | null {
  const found = list.find(item => normalizeName(item.name) === normalizeName(name));
  return found ? found._id : null;
}

function BusStopCreate() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [longitude, setLongitude] = useState("");
  const [latitude, setLatitude] = useState("");
  const [mapPosition, setMapPosition] = useState<Position>({
    lat: 10.036718000266058,
    lng: 105.78768579479011,
  });

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
  const newBusIcon = createBusIcon("#ffa500");

  // Lấy dữ liệu ban đầu: danh sách quận/phường/đường và trạm dừng
  useEffect(() => {
    const fetchApi = async () => {
      try {
        const districts = (await districtService.get()).data;
        setDistricts(districts);
        const wards = (await wardService.get()).data;
        setWards(wards);
        const streets = (await streetService.get()).data;
        setStreets(streets);

        const busStops = (await busStopService.get()).data;
        setBusStops(busStops);
      } catch (error) {
        toast.error("Lỗi khi tải dữ liệu ban đầu!");
      }
    };
    fetchApi();
  }, []);

  // Component lắng nghe sự kiện click trên bản đồ
  function MapClickHandler() {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setLatitude(lat.toString());
        setLongitude(lng.toString());
        setMapPosition({ lat, lng });

        // Reset các giá trị trước khi mapping dữ liệu mới
        setDistrictId("");
        setWardId("");
        setStreetId("");

        // Gọi API reverse geocoding
        const address = await reverseGeocode(lat, lng);
        if (address) {
          const districtName = address.suburb || address.state_district || "";
          const wardName = address.quarter || address.city_district || "";
          const streetName = address.road || "";

          // Mapping tên lấy từ API với danh sách quận/phường/đường
          const mappedDistrictId = mapNameToId(districtName, districts);
          const mappedWardId = mapNameToId(wardName, wards);
          const mappedStreetId = mapNameToId(streetName, streets);

          if (mappedDistrictId) {
            setDistrictId(mappedDistrictId);
          }
          if (mappedWardId) {
            setWardId(mappedWardId);
          }
          if (mappedStreetId) {
            setStreetId(mappedStreetId);
          }
          console.log("Mapping result:", {
            districtName,
            mappedDistrictId,
            wardName,
            mappedWardId,
            streetName,
            mappedStreetId,
          });
        }
      },
    });
    return null;
  }

  // Khi thay đổi Quận/Huyện thì tải danh sách Xã/Phường
  useEffect(() => {
    const fetchApi = async () => {
      if (!districtId) {
        setWards([]);
        return;
      }
      const wards = (await wardService.findByDistrict(districtId)).data;
      setWards(wards);
    };
    fetchApi();
  }, [districtId]);

  // Khi thay đổi Xã/Phường thì tải danh sách Đường
  useEffect(() => {
    const fetchApi = async () => {
      if (!wardId) {
        setStreets([]);
        return;
      }
      const streets = (await streetService.findByWard(wardId)).data;
      setStreets(streets);
    };
    fetchApi();
  }, [wardId]);

  const onChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onChangeDistrictId = (value: string) => {
    setDistrictId(value);
    setWardId(""); // Reset Xã/Phường khi đổi Quận/Huyện
    setStreetId("");
  };

  const onChangeWardId = (value: string) => {
    setWardId(value);
    setStreetId(""); // Reset Đường khi đổi Xã/Phường
  };

  const onChangeStreetId = (value: string) => {
    setStreetId(value);
  };

  const handleSubmit = async () => {
    if (!name || !longitude || !latitude || !districtId || !wardId || !streetId) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await busStopService.create({
      name,
      longitude: parseFloat(longitude),
      latitude: parseFloat(latitude),
      streetId,
    });

    if (response.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/bus-stops`);
  };

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Trạm Dừng" />

      <BoxInput label="Tên" value={name} onChange={onChangeName} />

      <div className={styles.home}>
        <div className={styles.wrapper}>
          <h3>Chọn vị trí của trạm dừng mới trên bản đồ</h3>
          <div className={styles.map}>
            <MapContainer center={mapPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
              <MapClickHandler />
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
              {/* Hiển thị marker của các trạm dừng đã có */}
              {busStops.map((point) => (
                <Marker key={point._id} position={[point.latitude, point.longitude]} icon={busIcon} />
              ))}
              {/* Hiển thị marker của trạm dừng mới được chọn */}
              {latitude && longitude && (
                <Marker position={[parseFloat(latitude), parseFloat(longitude)]} icon={newBusIcon} />
              )}
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
      </div>

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default BusStopCreate;
