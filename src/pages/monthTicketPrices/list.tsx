import { useEffect, useState } from "react";

import { Button, Space, Table, TableProps } from "antd";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";

import IMonthTicketPrice from "../../interfaces/monthTicketPrice";

import monthTicketPriceService from "../../services/monthTicketPrice.service";
import busRouteService from "../../services/busRoute.service";
import { toast } from "react-toastify";

function MonthTicketPriceList() {
  const [reload, setReload] = useState(false);

  const [monthTicketPrices, setMonthTicketPrices] = useState<IMonthTicketPrice[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const monthTicketPrices = (await monthTicketPriceService.get()).data;

      const monthTicketPricesDetailed = await Promise.all(
        monthTicketPrices.map(async (ticket) => {
          const busRoute = (await busRouteService.getById(ticket.busRouteId)).data;
          return { ...ticket, busRouteName: busRoute.name };
        })
      );

      setMonthTicketPrices(monthTicketPricesDetailed );
    }
    fetchApi();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await monthTicketPriceService.del(id);

      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã xóa thành công!");
      handleReload();
    }
  }

  const columns: TableProps<IMonthTicketPrice>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index: number) => <Button>{index + 1}</Button>
    },
    {
      title: "TG Bắt Đầu",
      dataIndex: "timeStart",
      key: "timeStart",
      render: (timeStart: string) => {
        const date = new Date(timeStart);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    {
      title: "TG Kết Thúc",
      dataIndex: "timeEnd",
      key: "timeEnd",
      render: (timeEnd: string) => {
        const date = new Date(timeEnd);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    {
      title: "Giá Vé",
      dataIndex: "price",
      key: "price",
      render: (price: number) => new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price)
    },
    {
      title: "Tuyến",
      dataIndex: "busRouteName",
      key: "busRouteName"
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
      <BoxHead title="Danh Sách Giá Vé Tháng Các Tuyến" />

      <BoxNavigateCreate />

      <Table dataSource={monthTicketPrices} columns={columns} />
    </>
  );
}

export default MonthTicketPriceList;