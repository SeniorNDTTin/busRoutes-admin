import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxCreate from "../../components/boxCreate";
import BoxInput from "../../components/boxInputMonthTicketPrice";
import BoxSelect from "../../components/boxSelect";
import ButtonSwitch from "../../components/buttonSwitch";

import configs from "../../configs";
import styles from "../../assets/admin/monthTicket/update.module.scss";

import { ETicketDetailType } from "../../enums/ticketDetail.enum";

import monthTicketService from "../../services/monthTicket.service";
import ICustomer from "../../interfaces/customer";
import customerService from "../../services/customer.service";
import ISchedule from "../../interfaces/schedule";
import IBusRoute from "../../interfaces/busRoute";
import busRouteService from "../../services/busRoute.service";
import scheduleService from "../../services/schedule.service";
import ticketDetailService from "../../services/ticketDetail.service";

function monthTicketCreate() {
    const navigate = useNavigate();

    const [monthTicket, setMonthTicket] = useState({
        registerDate: "",
        expiredDate: "",
        expired: false,
        customerId: ""
    });

    const [ticketDetail, setTicketDetails] = useState({
        type: ETicketDetailType.month,
        date: new Date().toISOString().split("T")[0],
        ticketId: "",
        scheduleId: "",
    });

    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [busRouteId, setBusRouteId] = useState("");
    const [schedules, setSchedules] = useState<ISchedule[]>([]);
    const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);

    useEffect(() => {
        const fetchApi = async () => {
            const customers = (await customerService.get()).data;
            setCustomers(customers);

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

    const handleChangeMonthTicket = (name: string, value: string | number) => {
        setMonthTicket((prev) => {
            if (name === "expiredDate" && typeof value === "string") {
                const today = new Date().toISOString().split("T")[0];
                return {
                    ...prev,
                    expired: value < today,
                    expiredDate: value
                }
            }
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleChangeTicketDetail = (name: string, value: string | number) => {
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
    };

    // const handleChangeSwitch = (checked: boolean) => {
    //     setMonthTicket((prev) => ({
    //         ...prev,
    //         expired: !checked
    //     }))
    // };

    const handleSubmit = async () => {
        if (
            !monthTicket.registerDate ||
            !monthTicket.expiredDate ||
            !monthTicket.customerId ||
            !ticketDetail.scheduleId
        ) {
            toast.error("Chưa nhập đủ thông tin!");
            return;
        }
        if (monthTicket.registerDate >= monthTicket.expiredDate) {
            toast.error("Khoảng thời gian không hợp lệ!");
            return;
        }
        if (new Date(ticketDetail.date) > new Date()) {
            toast.error("Ngày xuất vé phải nhỏ hơn hoặc bằng hôm nay!");
            return;
        }

        const ticketResponse = await monthTicketService.create(monthTicket);
        if (ticketResponse.code !== 201) {
            toast.error("Có lỗi xảy ra!");
            return;
        }

        const newMonthTicketId = ticketResponse.data._id;
        const dataTicketDetail = {
            ...ticketDetail,
            ticketId: newMonthTicketId
        }
        const ticketDetailResponse = await ticketDetailService.create(dataTicketDetail);
        if (ticketDetailResponse.code !== 201) {
            toast.error("Có lỗi xảy ra!");
            return;
        }

        toast.success("Tạo mới thành công!");
        navigate(`/${configs.prefixAdmin}/month-tickets`);
    };

    return (
        <>
            <GoBack />

            <BoxHead title="Tạo Mới Vé Tháng" />

            <div className={styles["flex-container"]}>
                <BoxInput type="date" name="registerDate" label="Ngày Đăng Ký" value={monthTicket.registerDate ?? ""} onChange={handleChangeMonthTicket} />
                <BoxInput type="date" name="expiredDate" label="Ngày Hết Hạn" value={monthTicket.expiredDate ?? ""} onChange={handleChangeMonthTicket} />
            </div>

            <BoxSelect
                label="Khách Hàng"
                value={monthTicket.customerId}
                options={customers?.map(item => ({ value: item._id, label: item.fullName + " - SĐT: " + item.phone })) || []}
                onChange={(value) => handleChangeMonthTicket("customerId", value)}
            />

            <ButtonSwitch checked={!monthTicket.expired} onChange={() => { }} checkedChildren="Còn hạn" unCheckedChildren="Hết hạn" />
            {/* <ButtonSwitch checked={!monthTicket.expired} onChange={handleChangeSwitch} checkedChildren="Còn hạn" unCheckedChildren="Hết hạn" /> */}

            <BoxInput name="date" type="date" label="Ngày xuất vé" value={ticketDetail.date} onChange={handleChangeTicketDetail} />

            <BoxSelect
                label="Tuyến"
                value={busRouteId}
                options={busRoutes?.map(item => ({ value: item._id, label: item.name })) || []}
                onChange={(value) => { handleChangeTicketDetail("busRouteId", value) }}
            />

            <BoxSelect
                label="Lịch trình khởi hành"
                value={ticketDetail.scheduleId}
                options={schedules?.map(item => ({ value: item._id, label: `${item.timeStart} - ${item.timeEnd}` })) || []}
                onChange={(value) => { handleChangeTicketDetail("scheduleId", value) }}
            />

            <BoxCreate onClick={handleSubmit} />
        </>
    )
};

export default monthTicketCreate;


