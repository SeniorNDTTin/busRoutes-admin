import { useEffect, useState } from "react";
import { Button, Space, Table, TableProps } from "antd";
import BoxHead from "../../components/boxHead/index.tsx";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail/index.tsx";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate/index.tsx";
import BoxNavigateCreate from "../../components/boxNavigateCreate/index.tsx";
import IOneWayTicketPrice from "../../interfaces/OneWayTicketPrices.ts";

import oneWayTicketPriceService from "../../services/oneWayTicketPrices.service.ts";
import { toast } from "react-toastify";

function OneWayTicketPriceList() {
  const [reload, setReload] = useState(false);
  const [prices, setPrices] = useState<IOneWayTicketPrice[]>([]);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await oneWayTicketPriceService.get();
        if (response.code === 200 && Array.isArray(response.data)) {
          setPrices(response.data);
        } else {
          toast.error("Không lấy được dữ liệu!");
        }
      } catch (error) {
        toast.error("Lỗi khi gọi API!");
      }
    };
    fetchPrices();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  };

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await oneWayTicketPriceService.del(id);
      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
      toast.success("Đã xóa thành công!");
      handleReload();
    }
  };

  const columns: TableProps<IOneWayTicketPrice>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index: number) => <Button>{index + 1}</Button>
    },
    {
      title: "Số km tối đa",
      dataIndex: "maxKilometer",
      key: "maxKilometer"
    },
    {
      title: "Giá vé",
      dataIndex: "unitPrice",
      key: "unitPrice"
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
      <BoxHead title="Danh Sách Giá Vé Một Chiều" />
      <BoxNavigateCreate />
      <Table dataSource={prices} columns={columns} rowKey="_id" />
    </>
  );
}

export default OneWayTicketPriceList;
