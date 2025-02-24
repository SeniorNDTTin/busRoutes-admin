import { useNavigate, useParams } from "react-router-dom"
import { useState,useEffect } from "react";
import { Space, TimePicker ,TimePickerProps} from 'antd';

import IBusRoute from "../../interfaces/busRoute";
import IBus from "../../interfaces/bus";

import scheduleService from "../../services/schedule.service";
import busRouteService from "../../services/busRoute.service";
import busService from "../../services/bus.service";

import BoxSelect from "../../components/boxSelect";
import GoBack from "../../components/goBack";
import BoxUpdate from "../../components/boxUpdate";

import configs from "../../configs";
import dayjs from "dayjs";
import { toast } from "react-toastify";

import styles from "../../assets/admin/schedule/update.module.scss"

const ScheduleUpdate = () =>{
    const {id} = useParams()
    const[schedule, setSchedule ] = useState({
        timeStart : "12:00 AM",
        timeEnd :  "12:00 PM",
        busId: "",
        busRouteId : ""
    });
    const [busRoute, setBusRoute] = useState<IBusRoute[]>([]);
    const [bus, setBus] = useState<IBus[]>([]);

    useEffect(() => {
        const fetchApi = async () => {
            const schedule = (await scheduleService.getById(id as string)).data
            if(schedule){
                setSchedule(schedule)
                const BusRoute = (await busRouteService.get()).data
                setBusRoute(BusRoute)

                const Bus = (await busService.get()).data
                setBus(Bus)
            }
        }
        fetchApi();
    }, []);

    const handleChange = (name: string, value: string | number) => {
        setSchedule((prev) => ({
          ...prev,
          [name]: value, 
        }));
    };   

    const onChange: TimePickerProps['onChange'] = (time,timeString) => {
        setSchedule((prev) => ({
            ...prev,
            timeStart: Array.isArray(timeString) ? timeString[0] : timeString,
           
        }))
        // console.log(timeString)
    };

    const onChangeEnd: TimePickerProps['onChange'] = (time,timeString) => {
        setSchedule((prev) => ({
            ...prev,
            timeEnd: Array.isArray(timeString) ? timeString[0] : timeString,
           
        }))
        // console.log(timeString)
    };

    const nav = useNavigate()
    const handleSubmit = async() => {
        const data = {...schedule}

        try{
            const res = (await scheduleService.update(id as string,data))
            
            if (res.code === 200) {
                toast.success("Cập nhật thành công")
                nav(`/${configs.prefixAdmin}/schedules`);
            }else{
                toast.error(res.message)
            }
        }catch{
            toast.error("Có lỗi xảy ra !!")
            
        }
    }

    return(
        <>
            <GoBack />
           
            <div className={styles.busRoutes}>
                <div className={styles.busRoutes_wrapper}>
                    <div className={styles.list}>
                        <div className={styles.item}>
                            <BoxSelect  value={schedule.busRouteId} label="Tuyến" options={busRoute?.map(item => ({ value: item._id, label: item.name })) || []} onChange={(value) => handleChange("busRouteId", value)}/>
                        </div>
                        <div className={styles.item}>
                            <BoxSelect value={schedule.busId} label="Xe Bus" options={bus?.map(item => ({ value: item._id, label: item.licensePlate })) || []} onChange={(value) => handleChange("busId", value)}/>
                        </div>
                    </div>

                    <div className={styles.list}>
                        <div className={styles.time}>
                            <div className={styles.timeItem}>
                                    <p style={{fontWeight : 'bold'}}>Giờ Bắt Đầu</p>
                            </div>
                            <div className={styles.timePicker}>
                                <Space wrap>
                                    <TimePicker style={{ width: "361px" }} value={dayjs(schedule.timeStart, "h:mm A")} use12Hours format="h:mm A" name="timeStart" onChange={onChange} allowClear={false}  />
                                </Space>
                            </div>
                        </div>

                        <div className={styles.time}>
                            <div className={styles.timeItem}>
                                <p style={{fontWeight : 'bold'}}>Giờ Kết Thúc</p>
                            </div>

                            <div className={styles.timePicker}>
                                <Space wrap >
                                    <TimePicker style={{ width: "361px" }} value={dayjs(schedule.timeEnd, "h:mm A")} use12Hours format="h:mm A  " name="timeEnd" onChange={onChangeEnd} allowClear={false}  />
                                </Space>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.tool}>
                <BoxUpdate onClick={handleSubmit} />
            </div>
        </>
    )
}

export default ScheduleUpdate