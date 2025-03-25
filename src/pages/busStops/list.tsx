import { useEffect, useState } from "react";
import { Button, Space, Table, TableProps } from "antd";
import { toast } from "react-toastify";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";

import IBusStop from "../../interfaces/busStop";
import busStopService from "../../services/busStop.service";
import streetService from "../../services/street.service";
import wardService from "../../services/ward.service";
import districtService from "../../services/district.service";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import busStopIcon from "../../assets/admin/bus_stop2.png";
import styles from "../../assets/admin/busStop.module.scss";

interface Position {
  lat: number;
  lng: number;
}

function BusStopList() {
  const [reload, setReload] = useState(false);

  const mapPosition: Position = {
    lat: 10.036718000266058,
    lng: 105.78768579479011,
  };
  const [busStops, setBusStops] = useState<IBusStop[]>([]);

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

  useEffect(() => {
    const fetchApi = async () => {
      const busStops = (await busStopService.get()).data;

      const busStopsDetailed = await Promise.all(
        busStops.map(async (bus) => {
          const street = (await streetService.getById(bus.streetId)).data;
          const ward = (await wardService.getById(street.wardId)).data;
          const district = (await districtService.getById(ward.districtId)).data;
          return { ...bus, streetName: street.name, wardName: ward.name, districtName: district.name };
        })
      );

      setBusStops(busStopsDetailed);
    }
    fetchApi();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await busStopService.del(id);

      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã xóa thành công!");
      handleReload();
    }
  }

  const columns: TableProps<IBusStop>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index: number) => <Button>{index + 1}</Button>
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "Kinh độ",
      dataIndex: "longitude",
      key: "longitude"
    },
    {
      title: "Vĩ độ",
      dataIndex: "latitude",
      key: "latitude"
    },
    {
      title: "Đường",
      dataIndex: "streetName",
      key: "streetName"
    },
    {
      title: "Phường/Xã",
      dataIndex: "wardName",
      key: "wardName"
    },
    {
      title: "Quận/Huyện",
      dataIndex: "districtName",
      key: "districtName"
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        const id = record._id;

        return (
          <Space>
            <ButtonNavigateDetail id={id} />
            <ButtonNavigateUpdate id={id} />
            <Button type="primary" className="button-danger" onClick={() => handleDel(id)}>Xóa</Button>
          </Space>
        );
      }
    }
  ];

  return (
    <>
      <BoxHead title="Danh Sách Trạm Dừng" />

      <BoxNavigateCreate />

      <Table dataSource={busStops} columns={columns} />

      <div className={styles.home}>
        <div className={styles.wrapper}>
          <h3>Danh sách các trạm dừng trên bản đồ</h3>
          <div className={styles.map}>
            <MapContainer center={mapPosition} zoom={13} style={{ height: "100%", width: "100%" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
              {/* Hiển thị marker của các trạm dừng đã có */}
              {busStops.map((point) => (
                <Marker key={point._id} position={[point.latitude, point.longitude]} icon={busIcon} />
              ))}
            </MapContainer>
          </div>
        </div>
      </div>

    </>
  );
}

export default BusStopList;