import { useEffect, useState } from "react";

import { Button, Space, Table, TableProps } from "antd";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import BoxNavigateCreate from "../../components/boxNavigateCreate";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";

import IOneWayTicket from "../../interfaces/oneWayTicket";
import oneWayTicketService from "../../services/oneWayTicket.service";

import { toast } from "react-toastify";
import scheduleService from "../../services/schedule.service";
import ticketDetailService from "../../services/ticketDetail.service";
import busRouteService from "../../services/busRoute.service";
import busService from "../../services/bus.service";

function OneWayTicketList() {
  const [reload, setReload] = useState(false);

  const [oneWayTickets, setOneWayTickets] = useState<IOneWayTicket[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const oneWayTickets = (await oneWayTicketService.get()).data;
      const oneWayTicketsDetailed  = await Promise.all(
        oneWayTickets.map(async (ticket) => {
          const detail = (await ticketDetailService.findByOneWayTicketId(ticket._id)).data;
          const schedule = (await scheduleService.getById(detail.scheduleId)).data;
          const busRoute = (await busRouteService.getById(schedule.busRouteId)).data;
          const bus = (await busService.getById(schedule.busId)).data;
          return { ...ticket, date: detail.date, timeStart: schedule.timeStart, timeEnd: schedule.timeEnd, busRouteName: busRoute.name, busLisencePlate: bus.licensePlate };
        })
      );
      setOneWayTickets(oneWayTicketsDetailed);
    }
    fetchApi();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await oneWayTicketService.del(id);

      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã xóa thành công!");
      handleReload();
    }
  }

  const columns: TableProps<IOneWayTicket>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index: number) => <Button>{index + 1}</Button>
    },
    {
      title: "Mã Vé",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "Ngày xuất vé",
      dataIndex: "date",
      key: "date",
      render: (issueDate: string) => {
        const date = new Date(issueDate);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }
    },
    {
      title: "Tuyến",
      dataIndex: "busRouteName",
      key: "busRouteName",
    },
    {
      title: "Chuyến",
      key: "timeStart-timeEnd",
      render: (_, record) => {
        const { timeStart, timeEnd } = record as any;
        return timeStart && timeEnd ? `${timeStart} - ${timeEnd}` : "Chưa xác định"; // Kết hợp timeStart và timeEnd khi hiển thị
      },    
    },
    {
      title: "Bus",
      dataIndex: "busLisencePlate",
      key: "busLisencePlate",
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
      <BoxHead title="Danh Sách Vé Lượt" />

      <BoxNavigateCreate />

      <Table dataSource={oneWayTickets} columns={columns} />
    </>
  );
}

export default OneWayTicketList;