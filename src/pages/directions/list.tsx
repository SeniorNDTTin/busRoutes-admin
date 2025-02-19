import { useEffect, useState } from "react";

import { Button, Space, Table, TableProps } from "antd";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";

import IDirection from "../../interfaces/direction";

import directionService from "../../services/direction.service";
import { toast } from "react-toastify";

function DirectionList() {
  const [reload, setReload] = useState(false);

  const [directions, setDirections] = useState<IDirection[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const directions = (await directionService.get()).data;
      setDirections(directions);
    }
    fetchApi();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  };

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await directionService.del(id);

      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã xóa thành công!");
      handleReload();
    }
  };

  const columns: TableProps<IDirection>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index: number) => <Button>{index + 1}</Button>,
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
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
      },
    },
  ];

  return (
    <>
      <BoxHead title="Danh Sách Hướng" />

      <BoxNavigateCreate />

      <Table dataSource={directions} columns={columns} />
    </>
  );
}

export default DirectionList;
