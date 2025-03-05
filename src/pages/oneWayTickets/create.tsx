import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxCreate from "../../components/boxCreate";
import BoxInput from "../../components/boxInputMonthTicketPrice";
import BoxSelect from "../../components/boxSelect";

import configs from "../../configs";

import { ETicketDetailType } from "../../enums/ticketDetail.enum";

import oneWayTicketService from "../../services/oneWayTicket.service";
import ISchedule from "../../interfaces/schedule";
import scheduleService from "../../services/schedule.service";
import busRouteService from "../../services/busRoute.service";
import IBusRoute from "../../interfaces/busRoute";
import ticketDetailService from "../../services/ticketDetail.service";

function OneWayTicketCreate() {
  const navigate = useNavigate();

  const [ticketDetail, setTicketDetails] = useState({
    type: ETicketDetailType.oneWay,
    date: new Date().toISOString().split("T")[0],
    ticketId: "",
    scheduleId: "",
  });

  const [busRouteId, setBusRouteId] = useState("");

  const [schedules, setSchedules] = useState<ISchedule[]>([]);
  const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const busRoutes = (await busRouteService.get()).data;
      setBusRoutes(busRoutes);
    }
    fetchApi();
  }, []);

  useEffect(() => {
    const fetchApi = async () => {
      if (!busRouteId) {
        setSchedules([]);
        return;
      }
      const schedules = (await scheduleService.findByBusRoute(busRouteId)).data;
      setSchedules(schedules);
    }
    fetchApi();
  }, [busRouteId]);

  const handleChange = (name: string, value: string | number) => {
    setTicketDetails((prev) => {
      if(name === "busRouteId" && typeof value === "string") {
        setBusRouteId(value);
        return {
            ...prev,
            scheduleId: ""
        }
      }
      return {
          ...prev,
          [name]: value
      };
    });
  }

  const handleSubmit = async () => {
    if(!ticketDetail.scheduleId) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    if(new Date(ticketDetail.date) > new Date()) {
      toast.error("Ngày xuất vé phải nhỏ hơn hoặc bằng hôm nay!");
      return;
    }

    const ticketResponse = await oneWayTicketService.create({});
    if (ticketResponse.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    const newOneWayTicketId = ticketResponse.data._id;
    const dataTicketDetail = {
      ...ticketDetail,
      ticketId: newOneWayTicketId
    }
    const ticketDetailResponse = await ticketDetailService.create(dataTicketDetail);
    if (ticketDetailResponse.code !== 201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/one-way-tickets`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Tạo Mới Vé Lượt" />

      <BoxInput name="date" type="date" label="Ngày xuất vé" value={ticketDetail.date} onChange={handleChange} />

      <BoxSelect 
        label="Tuyến" 
        value={busRouteId} 
        options={busRoutes?.map(item => ({ value: item._id, label: item.name })) || []} 
        onChange={(value) => {handleChange("busRouteId", value)}}
      />

      <BoxSelect 
        label="Lịch trình khởi hành" 
        value={ticketDetail.scheduleId} 
        options={schedules?.map(item => ({ value: item._id, label: `${item.timeStart} - ${item.timeEnd}` })) || []} 
        onChange={(value) => {handleChange("scheduleId", value)}}
      />

      <BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default OneWayTicketCreate