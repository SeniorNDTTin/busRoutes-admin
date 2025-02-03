import { useEffect, useState } from "react";

import { Button, Space, Table, TableProps } from "antd";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";

import IAddress from "../../interfaces/address";

import addressService from "../../services/address..service";
import { toast } from "react-toastify";

function SongList() {
  const [reload, setReload] = useState(false);

  const [addresses, setAddresses] = useState<IAddress[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const addresses = (await addressService.get()).data;
      setAddresses(addresses);
    }
    fetchApi();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await addressService.del(id);

      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã xóa thành công!");
      handleReload();
    }
  }

  const columns: TableProps<IAddress>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index: number) => <Button>{index + 1}</Button>
    },
    {
      title: "Tên đường",
      dataIndex: "street",
      key: "street"
    },
    {
      title: "Phường",
      dataIndex: "street",
      key: "street"
    },
    {
      title: "Quận",
      dataIndex: "district",
      key: "district"
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
      <BoxHead title="Danh Sách Địa Chỉ" />

      <BoxNavigateCreate />

      <Table dataSource={addresses} columns={columns} />
    </>
  );
}

export default SongList;