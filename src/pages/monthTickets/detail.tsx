import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import BoxHead from "../../components/boxHead";
import GoBack from "../../components/goBack";
import BoxInput from "../../components/boxInput";
import { Button } from "antd";

import { ETicketDetailType } from "../../enums/ticketDetail.enum";
import configs from "../../configs";
import style from "../../assets/admin/monthTicket/update.module.scss";

import customerService from "../../services/customer.service";
import monthTicketService from "../../services/monthTicket.service";
import ButtonSwitch from "../../components/buttonSwitch";
import ticketDetailService from "../../services/ticketDetail.service";
import scheduleService from "../../services/schedule.service";
import busRouteService from "../../services/busRoute.service";
import busService from "../../services/bus.service";

function MonthTicketDetail() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [monthTicket, setMonthTicket] = useState({
        registerDate: "",
        expiredDate: "",
        expired: false,
        customerId: "",
        customerName: "",
        customerPhone: ""
    });

    const [ticketDetail, setTicketDetails] = useState({
        type: ETicketDetailType.oneWay,
        date: new Date().toISOString().split("T")[0],
        ticketId: "",
        scheduleId: "",
        timeStart: "",
        timeEnd: "",
        busLicensePlate: "",
        chairQuantity: 0,
        busRouteName: "",
        busRouteId: ""
    });

    useEffect(() => {
        const fetchApi = async () => {
            const monthTicket = (await monthTicketService.getById(id as string)).data;
            const customer = (await customerService.getById(monthTicket.customerId)).data;
            setMonthTicket({
                ...monthTicket,
                customerName: customer.fullName,
                customerPhone: customer.phone
            });

            const ticketDetail = (await ticketDetailService.findByOneWayTicketId(id as string)).data;
            const schedule = (await scheduleService.getById(ticketDetail.scheduleId)).data;
            const busRoute = (await busRouteService.getById(schedule.busRouteId)).data;
            const bus = (await busService.getById(schedule.busId)).data;
            setTicketDetails({
                ...ticketDetail,
                date: ticketDetail.date,
                timeStart: schedule.timeStart,
                timeEnd: schedule.timeEnd,
                busLicensePlate: bus.licensePlate,
                chairQuantity: bus.chairQuantity,
                busRouteName: busRoute.name,
                busRouteId: schedule.busRouteId
            });
        }
        fetchApi();
    }, [id]);

    const handleClickDetailRoute = async () => {
        navigate(`/${configs.prefixAdmin}/bus-routes/update-information/detail/${ticketDetail.busRouteId}`);
    }

    return (
        <>
            <GoBack />

            <BoxHead title="Chi Tiết Vé Tháng" />

            <div style={{ display: "flex", gap: "32px" }}>
                <BoxInput type="date" label="Ngày Đăng Ký" value={monthTicket.registerDate ?? ""} onChange={() => { }} />
                <BoxInput type="date" label="Ngày Hết Hạn" value={monthTicket.expiredDate ?? ""} onChange={() => { }} />
            </div>
            <BoxInput label="Khách Hàng" value={`${monthTicket.customerName} - SĐT: ${monthTicket.customerPhone}`} onChange={() => { }} />
            <ButtonSwitch checked={!monthTicket.expired} onChange={() => { }} checkedChildren="Còn hạn" unCheckedChildren="Hết hạn" />

            <div className={style["flex-container"]}>
                <BoxInput label="Mã vé" value={id as string} onChange={() => { }} />
                <BoxInput type="date" label="Ngày xuất vé" value={ticketDetail.date} onChange={() => { }} />
            </div>
            <div className={style["flex-container1"]}>
                <BoxInput label="Tuyến" value={ticketDetail.busRouteName} onChange={() => { }} />
                <Button className={style["btn-detail"]} onClick={handleClickDetailRoute}>Chi tiết tuyến</Button>
            </div>
            <div className={style["flex-container"]}>
                <BoxInput label="Chuyến" value={`${ticketDetail.timeStart} - ${ticketDetail.timeEnd}`} onChange={() => { }} />
                <BoxInput label="Bus" value={`Biển số: ${ticketDetail.busLicensePlate} - Số ghế: ${ticketDetail.chairQuantity}`} onChange={() => { }} />
            </div>
            
        </>
    );
};

export default MonthTicketDetail;