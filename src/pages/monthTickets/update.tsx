import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import configs from "../../configs";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInputMonthTicketPrice";
import BoxSelect from "../../components/boxSelect";
import ButtonSwitch from "../../components/buttonSwitch";
import BoxUpdate from "../../components/boxUpdate";
import { Button } from "antd";

import { ETicketDetailType } from "../../enums/ticketDetail.enum";
import styles from "../../assets/admin/monthTicket/update.module.scss";

import ICustomer from "../../interfaces/customer";
import customerService from "../../services/customer.service"
import monthTicketService from "../../services/monthTicket.service";
import IBusRoute from "../../interfaces/busRoute";
import ISchedule from "../../interfaces/schedule";
import busRouteService from "../../services/busRoute.service";
import ticketDetailService from "../../services/ticketDetail.service";
import scheduleService from "../../services/schedule.service";

function MonthTicketUpdate() {
    const { id } = useParams();

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
        scheduleId: ""
    });

    const [oldMonthTicket, setOldMonthTicket] = useState(monthTicket);

    const [customers, setCustomers] = useState<ICustomer[]>([]);
    const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);
    const [schedules, setSchedules] = useState<ISchedule[]>([]);

    const [ticketDetailId, setTicketDetailId] = useState("");
    const [busRouteId, setBusRouteId] = useState("");

    useEffect(() => {
        const fetchApi = async () => {
            const customers = (await customerService.get()).data;
            setCustomers(customers);

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
            const monthTicket = (await monthTicketService.getById(id as string)).data;
            setMonthTicket(monthTicket);
            setOldMonthTicket(monthTicket);
        }
        fetchApi();
    }, [id]);

    useEffect(() => {
        const fetchApi = async () => {
            if (!busRouteId) return;
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
    }

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
        if(new Date(ticketDetail.date) > new Date()) {
            toast.error("Ngày xuất vé phải nhỏ hơn hoặc bằng hôm nay!");
            return;
        }

        const responseMonthTicket = await monthTicketService.update(id as string, monthTicket);
        if (responseMonthTicket.code !== 200) {
            toast.error("Có lỗi xảy ra!");
            return;
        }

        const responseTicketDetail = await ticketDetailService.update(ticketDetailId, ticketDetail);
        if (responseTicketDetail.code !== 200) {
            toast.error("Có lỗi xảy ra!");
            return;
        }

        toast.success("Cập nhật thành công!");
        navigate(`/${configs.prefixAdmin}/month-tickets`);
    };

    const handleRenew = async () => {
        const newExpiredDate = new Date();
        newExpiredDate.setMonth(newExpiredDate.getMonth() + 1);

        // lấy thông tin gốc chưa qua update state
        const updatedMonthTicketData = {
            ...oldMonthTicket,
            registerDate: new Date().toISOString().split('T')[0],
            expiredDate: newExpiredDate.toISOString().split('T')[0],
            expired: false
        };

        if (confirm("Vé sẽ được gia hạn thêm 1 tháng. Bạn chắc chứ?")) {
            if (!ticketDetail.scheduleId) {
                toast.error("Chưa nhập đủ thông tin!");
                return;
            }
            if(new Date(ticketDetail.date) > new Date()) {
                toast.error("Ngày xuất vé phải nhỏ hơn hoặc bằng hôm nay!");
                return;
            }
    
            const responseMonthTicket = await monthTicketService.update(id as string, updatedMonthTicketData);
            if (responseMonthTicket.code !== 200) {
                toast.error("Có lỗi xảy ra!");
                return;
            }

            const updatedTicketDetailData = {
                ...ticketDetail,
                date: new Date().toISOString().split('T')[0]
            };
            const responseTicketDetail = await ticketDetailService.update(ticketDetailId, updatedTicketDetailData);
            if (responseTicketDetail.code !== 200) {
                toast.error("Có lỗi xảy ra!");
                return;
            }

            toast.success("Gia hạn thành công!");
            navigate(`/${configs.prefixAdmin}/month-tickets`);
        }
    }

    return (
        <>
            <GoBack />

            <BoxHead title="Cập Nhật Vé Tháng" />

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

            <div className={styles.buttonContainer}>
                <BoxUpdate onClick={handleSubmit} />
                <Button className={styles.renewButton} onClick={handleRenew}>GIA HẠN</Button>
            </div>


        </>
    )
};

export default MonthTicketUpdate;