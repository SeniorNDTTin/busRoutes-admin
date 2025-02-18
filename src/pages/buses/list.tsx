import { useEffect, useState } from "react";
import { Button, Space, Table, TableProps } from "antd";
import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";
import IBus from "../../interfaces/bus";
import busService from "../../services/bus.service";
import { toast } from "react-toastify";

function BusList() {
  const [reload, setReload] = useState(false);
  const [buses, setBuses] = useState<IBus[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const response = await busService.get();
        console.log(response.data);
        setBuses(response.data);
      } catch (error) {
        console.error("API call error:", error);
        toast.error("Có lỗi khi tải dữ liệu xe bus");
      }
    };
    fetchApi();
  }, []);
  
  const handleReload = () => {
    setReload(!reload);
  }

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await busService.del(id);
      if (response.code !== 201) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã xóa thành công!");
      handleReload();
    }
  }

  const columns: TableProps<IBus>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index: number) => <Button>{index + 1}</Button>
    },
    {
      title: "Biển số xe",
      dataIndex: "licensePlate",
      key: "licensePlate"
    },
    {
      title: "Số lượng ghế",
      dataIndex: "chairQuantity",
      key: "chairQuantity"
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
      <BoxHead title="Danh Sách Xe Bus" />

      <BoxNavigateCreate />

      <Table dataSource={buses} columns={columns} />
    </>
  );
}

export default BusList;
