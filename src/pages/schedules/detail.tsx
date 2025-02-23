import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';


import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import ISchedule from '../../interfaces/schedule';
import scheduleService from '../../services/schedule.service';
import busRouteService from '../../services/busRoute.service';
import busService from '../../services/bus.service';

import styles from "../../assets/admin/schedule/detail.module.scss"

const ScheduleDetail = () => {

    const {id} = useParams()
    const [schedule, setSchedule] = useState<ISchedule & { busRouteName?: string; licensePlate?: string }>({} as ISchedule);

    useEffect(() => {
        const api = async () => {
            const schedule = (await scheduleService.getById(id as string)).data
            if(schedule){
                const busRoute = (await busRouteService.getById(schedule.busRouteId)).data
                const bus = (await busService.getById(schedule.busId)).data

                const updatedSchedule = {
                    ...schedule,
                    busRouteName: busRoute?.name || "unknown",
                    licensePlate: bus?.licensePlate || "unknown",
                };
                setSchedule(updatedSchedule)
            }
        }
        api()
        
    } ,[id])

    return (
        <>
              <GoBack />

            <BoxHead title="LỊCH KHỞI HÀNH BUS" />

             <div className={styles.busRoutes}>
                <div className={styles.busRoutes_wrapper}>
                    <div className={styles.list}>
                        <div className={styles.item}>
                            <BoxInput label="Biển xe"  value={schedule.licensePlate ?? ""} onChange={() => {}} />
                        </div>

                        <div className={styles.item}>
                            <BoxInput label="Tuyến" value={schedule.busRouteName ?? ""} onChange={() => {}} />
                        </div>
                    </div>
                    
                    <div className={styles.list}>
                        <div className={styles.item}>
                            <BoxInput label="Giờ bắt đầu"  value={schedule.timeStart ?? 0} onChange={() => {}} />
                        </div>

                        <div className={styles.item}>
                            <BoxInput label="Giờ kết thúc" value={schedule.timeEnd ?? ""} onChange={() => {}} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ScheduleDetail