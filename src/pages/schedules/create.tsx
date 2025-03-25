import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react";
import { Space, TimePicker, TimePickerProps } from 'antd';

import BoxSelect from "../../components/boxSelect";
import BoxCreate from "../../components/boxCreate";
import GoBack from "../../components/goBack";

import busRouteService from "../../services/busRoute.service";
import busService from "../../services/bus.service";
import scheduleService from "../../services/schedule.service";

import IBusRoute from "../../interfaces/busRoute";
import IBus from "../../interfaces/bus";

import configs from "../../configs";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import styles from "../../assets/admin/schedule/update.module.scss"
import BoxHead from "../../components/boxHead";

const ScheduleCreate = () => {
    const nav = useNavigate()

    const [schedule, setSchedule] = useState({
        timeStart: "12:00 AM",
        timeEnd: "12:00 PM",
        busId: "",
        busRouteId: ""
    });
    const [busRoutes, setBusRoutes] = useState<IBusRoute[]>([]);
    const [bus, setBus] = useState<IBus[]>([]);

    useEffect(() => {
        const fetchApi = async () => {
            const busRouteList = (await busRouteService.get()).data;
            const busList = (await busService.get()).data
            setBusRoutes(busRouteList);
            setBus(busList)
        };
        fetchApi();
    }, []);

    const handleChange = (name: string, value: string | number) => {
        setSchedule((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onChange: TimePickerProps['onChange'] = (time, timeString) => {
        setSchedule((prev) => ({
            ...prev,
            timeStart: Array.isArray(timeString) ? timeString[0] : timeString,

        }))
        // console.log(timeString)
    };
    const onChangeEnd: TimePickerProps['onChange'] = (time, timeString) => {
        setSchedule((prev) => ({
            ...prev,
            timeEnd: Array.isArray(timeString) ? timeString[0] : timeString,

        }))
        // console.log(timeString)
    };

    const handleSubmit = async () => {
        const data = { ...schedule }
        if (!schedule.busId || !schedule.busRouteId) {
            toast.error("Vui lòng không bỏ trống thông tin !")
            return
        }
        try {
            const res = (await scheduleService.create(data))

            if (res.code === 200) {
                toast.success("Tạo mới thành công")
                nav(`/${configs.prefixAdmin}/schedules`);
            } else {
                toast.error(res.message)
            }
        } catch {
            toast.error("Có lỗi xảy ra !!")
        }
    }


    return (
        <>
            <GoBack />

            <BoxHead title="Tạo Mới Lịch Trình" />

            <div className={styles.busRoutes}>
                <div className={styles.busRoutes_wrapper}>
                    <div className={styles.list}>
                        <div className={styles.item}>
                            <BoxSelect value={schedule.busRouteId} label="Tuyến" options={busRoutes?.map(item => ({ value: item._id, label: item.name })) || []} onChange={(value) => handleChange("busRouteId", value)} />
                        </div>
                        <div className={styles.item}>
                            <BoxSelect value={schedule.busId} label="Xe Bus" options={bus?.map(item => ({ value: item._id, label: item.licensePlate })) || []} onChange={(value) => handleChange("busId", value)} />
                        </div>
                    </div>

                    <div className={styles.list}>
                        <div className={styles.time}>
                            <div className={styles.timeItem}>
                                <p style={{ fontWeight: 'bold' }}>Giờ Bắt Đầu</p>
                            </div>
                            <div className={styles.timePicker}>
                                <Space wrap>
                                    <TimePicker style={{ width: "361px" }} value={dayjs(schedule.timeStart, "h:mm A")} use12Hours format="h:mm A" name="timeStart" onChange={onChange} allowClear={false} />
                                </Space>
                            </div>
                        </div>

                        <div className={styles.time}>
                            <div className={styles.timeItem}>
                                <p style={{ fontWeight: 'bold' }}>Giờ Kết Thúc</p>
                            </div>

                            <div className={styles.timePicker}>
                                <Space wrap >
                                    <TimePicker style={{ width: "361px" }} value={dayjs(schedule.timeEnd, "h:mm A")} use12Hours format="h:mm A" name="timeEnd" onChange={onChangeEnd} allowClear={false} />
                                </Space>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.tool}>
                <BoxCreate onClick={handleSubmit} />
            </div>
        </>
    )
}

export default ScheduleCreate