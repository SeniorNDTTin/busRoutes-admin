import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Space, TimePicker ,TimePickerProps,Input} from 'antd';

import BoxHead from "../../components/boxHead";
import BoxInputBusRoute from "../../components/boxInputBusRoute";
import BoxInputBusRouteN from "../../components/boxInputBusRoute/number";
import CheckBox from "../../components/checkBox";

import GoBack from "../../components/goBack";
import BoxUpdate from "../../components/boxUpdate";
import BoxSelectBR from "../../components/boxSelectBR";

import busRouteService from "../../services/busRoute.service";

import busStopService from "../../services/busStop.service";
import IBusStop from "../../interfaces/busStop";

import busRouteDetailService from "../../services/busRouteDetail";
import IBusRouteDetail from "../../interfaces/busRouteDetail";

import directionService from "../../services/direction.service";
import IDirection from "../../interfaces/direction";

import styles from "../../assets/admin/busRoute/update.module.scss"
import dayjs from "dayjs";


function BusRouteUpdate() {
  const { id } = useParams();

  const[busRoute, setBusRoute] = useState({
    name: "",
    fullDistance: 0,
    fullPrice: 0,
    time: "",
    firstFlightStartTime: "12:00 AM", 
    lastFlightStartTime: "12:00 PM",   
    timeBetweenTwoFlight: "",
  });

  const [busStop, setBusStop] = useState<IBusStop[]>([])
  const [busRouteDetail, setBusRouteDetail] = useState<IBusRouteDetail[]>([])
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [direction , setDirection] = useState<IDirection[]>([])
  const [selectedDirection , setSelectedDirection] = useState("")
  const [orderMap, setOrderMap] = useState<Map<string, number>>(new Map());

  // useEffect(() => {
  //   const fetchApi = async () => {
  //       const BusRoute = (await busRouteService.getById(id as string)).data
  //         let start = "12:00 AM";
  //         let end = "12:00 PM";
  //         if (BusRoute.time) {
  //           const timeParts = BusRoute.time.split("-");
  //           if (timeParts.length === 2) {
  //             start = timeParts[0].trim();
  //             end = timeParts[1].trim();
  //           }
  //           setBusRoute(BusRoute)
  //           setStartTime(start);
  //           setEndTime(end);

  //           const stop =   (await busStopService.get()).data
  //           setBusStop(stop)

  //           const detail = (await busRouteDetailService.getByRouteId(id as string)).data 
  //           setBusRouteDetail(detail);  
  //           console.log(detail)
           
  //       }
  //   }
  //   fetchApi();
  // }, [id]);

  useEffect(() => {
    const fetchApi = async () => {
      const BusRoute = (await busRouteService.getById(id as string)).data;
      let start = "12:00 AM";
      let end = "12:00 PM";
  
      if (BusRoute.time) {
        const timeParts = BusRoute.time.split("-");
        if (timeParts.length === 2) {
          start = timeParts[0].trim();
          end = timeParts[1].trim();
        }
        setBusRoute(BusRoute);
        setStartTime(start);
        setEndTime(end);
  
        const stop = (await busStopService.get()).data;
        setBusStop(stop);
  
        const detail = (await busRouteDetailService.getByRouteId(id as string)).data;
        setBusRouteDetail(detail);

        const initialSelectedValues = detail
          .map((item) => item.busStopId)
          .filter((id) => stop.some((stopItem) => stopItem._id === id));

        setSelectedValues(initialSelectedValues);

        let initialOrderMap = new Map<string, number>();
        detail.forEach((item) => {
          initialOrderMap.set(item.busStopId, item.orderNumber);
        });
  
        setOrderMap(initialOrderMap);

        const directionList = (await directionService.get()).data
        setDirection(directionList)
        
        const selectedDir = detail.length > 0  ? detail[0].directionId : ""
        setSelectedDirection(selectedDir)

      }
    };
  
    fetchApi();
  }, [id]);
  
  const handleChangeSelect = (value: string) =>{
    setSelectedDirection(value)
    
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusRoute({
        ...busRoute,
        [name]: name === "fullPrice" || name === "fullDistance" ? Number(value) : value
    });
  
  };

  const onChange: TimePickerProps['onChange'] = (time,timeString) => {
    setBusRoute((prev) => ({
        ...prev,
        firstFlightStartTime: Array.isArray(timeString) ? timeString[0] : timeString,
      
    }))
  };
  const onChangeEnd: TimePickerProps['onChange'] = (time,timeString) => {
  setBusRoute((prev) => ({
        ...prev,
        lastFlightStartTime: Array.isArray(timeString) ? timeString[0] : timeString,
      
    }))
  };

  const [startTime, setStartTime] = useState("12:00 AM")
  const [endTime, setEndTime] = useState("12:00 PM")

  const onChangeStartTime: TimePickerProps['onChange'] = (time,timeString) => {
    setStartTime(Array.isArray(timeString) ? timeString[0] : timeString);
    setBusRoute((prev) => ({
        ...prev,
        time: `${timeString} - ${endTime}`
    }))
  };

  const onChangeEndTime: TimePickerProps['onChange'] = (time,timeString) => {
    setEndTime(Array.isArray(timeString) ? timeString[0] : timeString);
    setBusRoute((prev) => ({
          ...prev,
            time: `${startTime} - ${timeString}`
      }))
  };

  const onCheckBox = (checkedValues: string[]) => {
    setSelectedValues(checkedValues)
  
    let newOrderMap = new Map<string, number>();
    checkedValues.forEach((value, index) => {
      newOrderMap.set(value, index + 1);
    });
  
    setOrderMap(newOrderMap);

  };

  const haversineDistance = (lat1: number, long1: number, lat2: number, long2: number) => {
    const toRad = (angle: number) => (angle * Math.PI) / 180;
    const R = 6371; 
  
    const dLat = toRad(lat2 - lat1);
    const dLong = toRad(long2 - long1);
  
    const a =Math.sin(dLat / 2) * Math.sin(dLat / 2) +Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c); 
  };
  
  // const handleSubmit = async () => {
  //   if(!busRoute.name || !busRoute.time|| !busRoute.firstFlightStartTime || !busRoute.lastFlightStartTime||!busRoute.timeBetweenTwoFlight){
  //       toast.error("Vui lòng không bỏ trống thông tin!");
  //       return;
  //   }

  //   if(busRoute.fullDistance <= 0 || busRoute.fullPrice <= 0){
  //     toast.error("Giá tiền hoặc độ dài toàn tuyến chưa hợp lệ !");
  //     return
  //   }

  //   if (selectedValues.length < 2) {
  //     toast.error("Vui lòng chọn ít nhất 2 trạm dừng!");
  //     return;
  //   }

  //   await Promise.all(
  //     busRouteDetail.map((item) => {
  //        busRouteDetailService.del(item._id);
  //     })
  //   );  
    
  //   setBusRouteDetail([]);
  
  //   const stopList = await Promise.all(
  //     selectedValues.map(async (id) => {
  //         return (await busStopService.getById(id)).data
  //     })
  //   )

  //    let full = 0
  //    for(const [index, stop] of stopList.entries()){
  //         const distancePre = index === 0 ?  0 : haversineDistance(stopList[index - 1].latitude, stopList[index - 1].longitude, stop.latitude , stop.longitude);
  //         const busRouteDetailData = {
  //           orderNumber: index + 1,
  //           distancePre,
  //           busRouteId : id,
  //           busStopId: stop._id,
  //           directionId: selectedDirection,
  //         }
  //         try {
  //           const detail = await busRouteDetailService.create(busRouteDetailData);
  //           if (detail.code !== 201) {
  //             toast.error("Có lỗi xảy ra!");
  //             return;
  //           }
  //           full += distancePre
  //         } catch (error) {
  //             console.error("Lỗi:", error);
  //         }
  //    }

  //   const data = {...busRoute, fullDistance: full}
  //   const res =  (await busRouteService.update(id as string, data))
  //   if (res.code !== 200) {
  //     toast.error("Có lỗi xảy ra!");
  //     return;
  //   }
    
  //   console.log("detail sau ",busRouteDetail)
  //   toast.success("Cập nhật thành công");

  // }

  const handleSubmit = async () => {
    if(!busRoute.name || !busRoute.time|| !busRoute.firstFlightStartTime || !busRoute.lastFlightStartTime||!busRoute.timeBetweenTwoFlight){
        toast.error("Vui lòng không bỏ trống thông tin!");
        return;
    }
  
    if(busRoute.fullDistance <= 0 || busRoute.fullPrice <= 0){
      toast.error("Giá tiền hoặc độ dài toàn tuyến chưa hợp lệ !");
      return;
    }
  
    if (selectedValues.length < 2) {
      toast.error("Vui lòng chọn ít nhất 2 trạm dừng!");
      return;
    }
  
      await Promise.all(busRouteDetail.map(item => busRouteDetailService.del(item._id)));
  
      setBusRouteDetail([]);
  
      const stopList = await Promise.all(
        selectedValues.map(async (id) => (await busStopService.getById(id)).data)
      );
  
      let full = 0;
      const newDetails = [];
  
      for (const [index, stop] of stopList.entries()) {
        const distancePre = index === 0 ? 0 : haversineDistance(stopList[index - 1].latitude, stopList[index - 1].longitude, stop.latitude , stop.longitude);
        const busRouteDetailData = {
          orderNumber: index + 1,
          distancePre,
          busRouteId: id,
          busStopId: stop._id,
          directionId: selectedDirection,
        };
  
        try {
          const detail = await busRouteDetailService.create(busRouteDetailData);
          if (detail.code !== 201) {
            toast.error("Có lỗi xảy ra!");
            return;
          }
          full += distancePre;
          newDetails.push(detail.data);
        } catch (error) {
          console.error("Lỗi:", error);
        }
      }
  
      setBusRouteDetail(newDetails);
  
      const data = { ...busRoute,fullPrice: busRoute.fullPrice, fullDistance: full };
      const res = await busRouteService.update(id as string, data);
  
      if (res.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }
  
      toast.success("Cập nhật thành công");
  };
  
  return (
    <>
        <GoBack />

        <BoxHead title="CẬP NHẬT TUYẾN BUS" />

        <div className={styles.busRoutes}>
            <div className={styles.busRoutes_wrapper}>
              <div className={styles.list}>
                  <div className={styles.item}>
                      <BoxInputBusRoute label="Tên" name="name" value={busRoute.name ?? ""} onChange={handleChange} />
                  </div>

                  <div className={styles.item}>
                    <div className={styles.price}>
                      <BoxInputBusRouteN label="Giá Vé Toàn Tuyến" name="fullPrice" value={busRoute.fullPrice ?? 0} onChange={handleChange} />
                    </div>

                    <div className={styles.vnd}>
                        <Input placeholder="VND" disabled/>
                    </div>
                  </div>

                  <div className={styles.time}>
                      <div className={styles.timeItem}>                
                        <p>Thời Gian Toàn Tuyến</p>
                      </div>
                  
                      <div className={styles.timePicker}>
                          <Space wrap>
                              <TimePicker style={{ width: "115px" }} value={dayjs(startTime, "h:mm A")} use12Hours format="h:mm A" name="startTime" onChange={onChangeStartTime}  allowClear={false} />
                        </Space>
                        <Space wrap>
                                <TimePicker style={{ width: "115px" }} value={dayjs(endTime, "h:mm A")} use12Hours format="h:mm A" name="endTime" onChange={onChangeEndTime}  allowClear={false} />
                          </Space>
                      </div>
                  </div>
              </div>

              <div className={styles.list}>     
                  <div className={styles.time}>
                      <div className={styles.timeItem}>                
                          <p>Giờ Bắt Đầu Chuyến Đầu Tiên</p>
                      </div>
                      <Space wrap>
                          <TimePicker style={{ width: "240px" }} value={dayjs(busRoute.firstFlightStartTime, "h:mm A")} use12Hours format="h:mm A" name="firstFlightStartTime" onChange={onChange}  allowClear={false} />
                    </Space>
                  </div>

                  <div className={styles.time}>
                      <div className={styles.timeItem}>                
                        <p>Giờ Bắt Đầu Chuyến Cuối Cùng</p>
                      </div>
                      <Space wrap>
                          <TimePicker style={{ width: "240px" }} value={dayjs(busRoute.lastFlightStartTime, "h:mm A")} use12Hours format="h:mm A" name="firstFlightStartTime" onChange={onChangeEnd}  allowClear={false} />
                      </Space>
                  </div>

                  <div className={styles.item}>
                      <BoxInputBusRoute  label="Khoảng TG Giữa Hai Chuyến" name="timeBetweenTwoFlight" value={busRoute.timeBetweenTwoFlight ?? ""} onChange={handleChange} />
                  </div>
              </div>

              <div className={styles.listDistance}>
                  <div className={styles.busStop}>            
                      <CheckBox options={busStop.map((item) => ({ value: item._id, label: item.name }))} selectedValues={selectedValues} onCheck={onCheckBox} orderMap={orderMap}/>
                  </div>
              </div>
        
              <div className={styles.list_tool}>
                    <div className={styles.distance}>
                        <BoxSelectBR value={selectedDirection} style={{ width : '100%'}} label="Phương Hướng" options={direction?.map(item => ({ value: item._id, label: item.description })) || []} onChange={ (value) => {handleChangeSelect(value)}}/>
                    </div>

                  <div className={styles.tool}>
                    <BoxUpdate onClick={handleSubmit} />  
                  </div>
              </div>
            </div>
        </div>
    </>
  );
}

export default BusRouteUpdate;