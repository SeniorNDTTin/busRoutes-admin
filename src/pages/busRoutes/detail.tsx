import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Input } from 'antd';

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";
import BoxTime from "../../components/boxTime";

import busRouteService from "../../services/busRoute.service";
import IBusRoute from "../../interfaces/busRoute";

import busRouteDetailService from "../../services/busRouteDetail";
import IBusRouteDetail from "../../interfaces/busRouteDetail";

import busStopService from "../../services/busStop.service";
import IBusStop from "../../interfaces/busStop";

import styles from "../../assets/admin/busRoute/busRoute.module.scss"
import directionService from "../../services/direction.service";
import BusStopList from "../busStops/list";

function BusRouteDetail() {
  const { id } = useParams();
  const[busRoute, setBusRoute] = useState<Partial<IBusRoute>>({});
  const[busRouteDetail, setBusRouteDetail] = useState<IBusRouteDetail []>([])
  const [busStop, setBusStop] = useState<IBusStop[]>([])
  const [busStopReturn, setBusStopReturn] = useState<IBusStop[]>([])

  useEffect(() => {
    const  fetchApi = async () => {
      const [BusRoute , detail, direction] = await Promise.all([
        busRouteService.getById(id as string),
        busRouteDetailService.getByRouteId(id as string),
        directionService.get()
      ])

      setBusRoute(BusRoute?.code === 200 ? BusRoute.data : busRoute); 
      setBusRouteDetail(detail?.code === 200 ? detail.data : busRouteDetail);

      if(direction.code === 200){
        const directionGo = direction.data.find(value => value.description === 'Lượt đi')
        const directionReturn = direction.data.find(value => value.description === 'Lượt về')   
        
        const infoStop  = async (directionId : string)=>{
          if(detail?.data){

            return await Promise.all(
                detail.data
                .filter(dir => dir.directionId === directionId)
                .map(async item => {
                  return (await busStopService.getById(item.busStopId)).data;
                })
            )
          }
          return [];
        }

        if(directionGo){
          const detailListGo = await infoStop(directionGo._id)
          setBusStop(detailListGo)
        }

        if(directionReturn){
          const detailListReturn = await infoStop(directionReturn._id)
          setBusStopReturn(detailListReturn)
        }
     
      }  
     }
     fetchApi()
  },[id])

  const formatCurrency = (value?: number) => {
    if (!value) return "0";
    return new Intl.NumberFormat("vi-VN").format(value);
  };


  return (
    <>

        <GoBack />

        <BoxHead title="THÔNG TIN TUYẾN BUS" />


        <div className={styles.busRoutes}>
          <div className={styles.busRoutes_wrapper}>
            <div className={styles.list}>
              <div className={styles.item}>
                  <BoxInput label="Tên"  value={busRoute.name ?? ""} onChange={() => {}} />
              </div>

              <div className={styles.item}>
                  <div className={styles.child}>
                    <BoxInput label="Độ dài tuyến"  value={busRoute.fullDistance ?? 0} onChange={() => {}} />
                  </div>

                  <div className={styles.child1}>
                      <Input placeholder="Km" disabled/>
                  </div>             
              </div>

              <div className={styles.item}>
                <div className={styles.price}>
                  <BoxInput label="Giá vé tuyến" value={formatCurrency(busRoute.fullPrice)} onChange={() => {}} />
                </div>

                <div className={styles.vnd}>
                    <Input placeholder="VND" disabled/>
                </div>
              </div>
            </div>

            <div className={styles.list}>
              <div className={styles.item}>
                <BoxInput label="Thời gian toàn tuyến"  value={busRoute.time ?? 0} onChange={() => {}} />
              </div>

              <div className={styles.item}>
                <BoxInput label="Giờ bắt đầu chuyến đầu tiên" value={busRoute.firstFlightStartTime ?? ""} onChange={() => {}} />
              </div>

              <div className={styles.item}>
                <BoxInput label="Giờ bắt đầu chuyến cuối cùng"  value={busRoute.lastFlightStartTime ?? ""} onChange={() => {}} />
              </div>
            </div>

            <div className={styles.list_tool}>
                <BoxTime  label="Khoảng thời gian giữa hai chuyến"  value={busRoute.timeBetweenTwoFlight ?? ""} onChange={() => {}} />
            </div>

            <div className={styles.listDistance}>
                  <div className={styles.direction}>
                            <span>Lượt Đi : </span>
                  </div>
                  <div className={styles.busStop}>          
                      {busStop.map((value, index) => 
                          <div className={styles.item1}>
                              <div className={styles.index}>{index + 1}</div>
                              <div className={styles.name}>{value.name}</div>
                          </div>
                      )}
                  </div>
            </div>
            
            <div className={styles.listDistance}>
                  <div className={styles.reverse}>
                            <span>Lượt Về : </span>
                  </div>
                  <div className={styles.busStop}>          
                      {busStopReturn.map((value, index) => 
                          <div className={styles.item1}>
                              <div className={styles.index}>{index + 1}</div>
                              <div className={styles.name}>{value.name}</div>
                          </div>
                      )}
                  </div>
            </div>
            
          </div>
      </div>
    </>
  );
}

export default BusRouteDetail;