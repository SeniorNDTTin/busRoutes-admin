import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import configs from "../../configs";

import { toast } from "react-toastify";
import { ETicketDetailType } from "../../enums/ticketDetail.enum";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInputMonthTicketPrice";
import BoxSelect from "../../components/boxSelect";
import BoxUpdate from "../../components/boxUpdate";

import ISchedule from "../../interfaces/schedule";
import IBusRoute from "../../interfaces/busRoute";
import ticketDetailService from "../../services/ticketDetail.service";
import busRouteService from "../../services/busRoute.service";
import scheduleService from "../../services/schedule.service";

function OneWayTicketUpdate() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [ticketDetail, setTicketDetails] = useState({
        type: ETicketDetailType.oneWay,
        date: new Date().toISOString().split("T")[0],
        scheduleId: ""
    });

    const [ticketDetailId, setTicketDetailId] = useState("");
    const [busRouteId, setBusRouteId] = useState("");

    const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);
    const [schedules, setSchedules] = useState<ISchedule[]>([]);

    useEffect(() => {
        const fetchApi = async () => {
            const busRoutes = (await busRouteService.get()).data;
            setBusRoutes(busRoutes);

            const ticketDetail = (await ticketDetailService.findByOneWayTicketId(id as string)).data;
            const schedule = (await scheduleService.getById(ticketDetail.scheduleId)).data;
            setTicketDetailId(ticketDetail._id);
            setBusRouteId(schedule.busRouteId);
            setTicketDetails(ticketDetail);
        }
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            if (!busRouteId) return;
            const schedules = (await scheduleService.findByBusRoute(busRouteId)).data;
            setSchedules(schedules);
        }
        fetchApi();
    }, [busRouteId]);

    const handleChange = (name: string, value: string | number) => {
        setTicketDetails((prev) => {
            if (name === "busRouteId" && typeof value === "string") {
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
        if (!ticketDetail.scheduleId) {
            toast.error("Chưa nhập đủ thông tin!");
            return;
        }
        if (new Date(ticketDetail.date) > new Date()) {
            toast.error("Ngày xuất vé phải nhỏ hơn hoặc bằng hôm nay!");
            return;
        }
        
        const response = await ticketDetailService.update(ticketDetailId, ticketDetail);
        if (response.code !== 200) {
            toast.error("Có lỗi xảy ra!");
            return;
        }

        toast.success("Cập nhật thành công!");
        navigate(`/${configs.prefixAdmin}/one-way-tickets`);
    }

    return (
        <>
            <GoBack />

            <BoxHead title="Cập Nhật Vé Lượt" />

            <BoxInput name="date" type="date" label="Ngày xuất vé" value={ticketDetail.date} onChange={handleChange} />

            <BoxSelect
                label="Tuyến"
                value={busRouteId}
                options={busRoutes?.map(item => ({ value: item._id, label: item.name })) || []}
                onChange={(value) => { handleChange("busRouteId", value) }}
            />

            <BoxSelect
                label="Lịch trình khởi hành"
                value={ticketDetail.scheduleId}
                options={schedules?.map(item => ({ value: item._id, label: `${item.timeStart} - ${item.timeEnd}` })) || []}
                onChange={(value) => { handleChange("scheduleId", value) }}
            />

            <BoxUpdate onClick={handleSubmit} />
        </>
    );
};

export default OneWayTicketUpdate;