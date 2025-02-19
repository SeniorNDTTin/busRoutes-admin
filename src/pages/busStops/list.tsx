import { useEffect, useState } from "react";

import { Button, Space, Table, TableProps } from "antd";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";

import IBusStop from "../../interfaces/busStop";

import busStopService from "../../services/busStop.service";
import streetService from "../../services/street.service";
import wardService from "../../services/ward.service";
import districtService from "../../services/district.service";
import { toast } from "react-toastify";

function BusStopList() {
  const [reload, setReload] = useState(false);

  const [busStops, setBusStops] = useState<IBusStop[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const busStops = (await busStopService.get()).data;

      const busStopsDetailed  = await Promise.all(
        busStops.map(async (bus) => {
          const street = (await streetService.getById(bus.streetId)).data;
          const ward = (await wardService.getById(street.wardId)).data;
          const district = (await districtService.getById(ward.districtId)).data;
          return { ...bus, streetName: street.name, wardName: ward.name, districtName: district.name };
        })
      );

      setBusStops(busStopsDetailed );
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
    </>
  );
}

export default BusStopList;