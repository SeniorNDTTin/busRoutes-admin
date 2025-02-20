import { useEffect, useState } from "react";

import { Button, Space, Table, TableProps } from "antd";
import { toast } from "react-toastify";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";

import IBusRoute from "../../interfaces/busRoute";
import busRouteService from "../../services/busRoute.service";

import "../../components/buttonDelete/buttonDelete.css"

function BusRouteList() {
  const [reload, setReload] = useState(false);

  const [busRoute, setBusRoute] = useState<IBusRoute []>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const busRoute = (await busRouteService.get()).data;
      setBusRoute(busRoute);
    }
    fetchApi();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await busRouteService.del(id)

      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã xóa thành công!");
      handleReload();
    }
  }

  const columns: TableProps<IBusRoute>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      align: "center",
      render: (_, __, index: number) => <Button>{index + 1}</Button>
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      align: "center",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      align: "center",  
      render: (_, record) => {
        const id = record._id;

        return (
          <Space>
            <ButtonNavigateDetail id={id} />
            <ButtonNavigateUpdate id={id} />
            <Button type="primary" className="button-danger delete" onClick={() => handleDel(id)}>Xóa</Button>
          </Space>
        );
      }
    }
  ];

  return (
    <>
      <BoxHead title="DANH SÁCH CÁC TUYẾN BUS" />

      <BoxNavigateCreate />

      <Table  dataSource={busRoute} columns={columns} />
    </>
  );
}

export default BusRouteList;