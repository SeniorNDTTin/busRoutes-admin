import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Space, TimePicker ,TimePickerProps,Input} from 'antd';

import BoxHead from "../../components/boxHead";
import BoxInputBusRoute from "../../components/boxInputBusRoute";
import BoxInputBusRouteN from "../../components/boxInputBusRoute/number";
import GoBack from "../../components/goBack";
import BoxCreate from "../../components/boxCreate";
import CheckBox from "../../components/checkBox";
import BoxSelectBR from "../../components/boxSelectBR";

import IBusStop from "../../interfaces/busStop";
import IDirection from "../../interfaces/direction";

import busRouteService from "../../services/busRoute.service";
import busStopService from "../../services/busStop.service";
import busRouteDetailService from "../../services/busRouteDetail";

import styles from "../../assets/admin/busRoute/create.module.scss"

import configs from "../../configs";
import dayjs from "dayjs";
import directionService from "../../services/direction.service";

function BusRouteCreate() {
    
  const navigate = useNavigate()

  const[busRoute, setBusRoute] = useState({
    name: "",
    fullDistance: 0,
    fullPrice: 0,
    time: "",
    firstFlightStartTime: "12:00 AM", 
    lastFlightStartTime: "12:00 PM",   
    timeBetweenTwoFlight: "",
  });

  const [busStop, setBusSTop] = useState<IBusStop[]>([])
  const [direction, setDirection] = useState<IDirection[]>([]);
  const [selectedDirection, setSelectedDirection] = useState("");
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
      const api = async() =>{
          const stop =   (await busStopService.get()).data
          const direction = (await directionService.get()).data
          setBusRoute((prev) => ({
            ...prev,
            time: `${startTime} - ${endTime}`
          }));
          setBusSTop(stop)
          setDirection(direction)
      }
      api()
  },[])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusRoute({
        ...busRoute,
        [name]: name === "fullPrice" || name === "fullDistance" ? Number(value) : value
    });
  };

  const handleChangeSelect = (value: string) =>{
    setSelectedDirection(value)
  }

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


  const [orderMap, setOrderMap] = useState<Map<string, number>>(new Map());
  const onCheckBox = (checkedValues: string[]) => {
    setSelectedValues(checkedValues)

    let newOrderMap = new Map<string, number>();
    checkedValues.forEach((value, index) => {
      newOrderMap.set(value, index + 1);
    });
  
    setOrderMap(newOrderMap);
    // console.log(checkedValues)
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

  const handleSubmit = async () => {
    const data = {...busRoute}

    if(!busRoute.name || !busRoute.timeBetweenTwoFlight){
        toast.error("Vui lòng không bỏ trống thông tin!");
        return;
    }

    if(busRoute.fullPrice <= 0){
        toast.error("Giá tiền chưa hợp lệ !");
        return
    }

    if (!selectedDirection) {
      toast.error("Vui lòng chọn phương hướng!");
      return;
    }
  
    if (selectedValues.length < 2) {
      toast.error("Vui lòng chọn ít nhất 2 trạm dừng!");
      return;
    }

    const res = await (await busRouteService.create(data))
    if (res.code !== 201) {
        toast.error("Có lỗi xảy ra!");
        return;
    }
     const stopList = await Promise.all(
          selectedValues.map(async (id) => {
              return (await busStopService.getById(id)).data
          })
     )

     const busRouteId = res.data._id
     const directionId = selectedDirection;

     let full = 0
     for(const [index, stop] of stopList.entries()){
          const distancePre = index === 0 ?  0 : haversineDistance(stopList[index - 1].latitude, stopList[index - 1].longitude, stop.latitude , stop.longitude);
          const busRouteDetailData = {
            orderNumber: index + 1,
            distancePre,
            busRouteId,
            busStopId: stop._id,
            directionId,
          }
          try {
            const detail = await busRouteDetailService.create(busRouteDetailData);
            if (detail.code !== 201) {
              toast.error("Có lỗi xảy ra!");
              return;
            }
            full += distancePre
          } catch (error) {
              console.error("Lỗi:", error);
          }
     }

     const updateBusRoute = (await busRouteService.update(res.data._id,{fullDistance : full}))
     if (updateBusRoute.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công");
    navigate(`/${configs.prefixAdmin}/bus-routes/update-information`);

  }

  return (
    <>
        <GoBack />

        <BoxHead title="TẠO MỚI TUYẾN BUS" />

         <div className={styles.busRoutes}>
            <div className={styles.busRoutes_wrapper}>
              <div className={styles.list}>
                  <div className={styles.item}>
                      <BoxInputBusRoute label="Tên" name="name" value={busRoute.name ?? ""} onChange={handleChange} />
                  </div>

                  <div className={styles.item}>
                      <div className={styles.price}>
                        <BoxInputBusRouteN label="Giá Vé Tuyến" name="fullPrice" value={busRoute.fullPrice ?? 0} onChange={handleChange} />
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
                    <div className={styles.item}>
                        <BoxInputBusRoute  label="Khoảng TG Giữa Hai Chuyến" name="timeBetweenTwoFlight" value={busRoute.timeBetweenTwoFlight ?? ""} onChange={handleChange} />
                    </div>

                    <div className={styles.time}>
                        <div className={styles.timeItem}>                
                            <p>Giờ bắt đầu chuyến đầu tiên</p>
                        </div>

                        <Space wrap>
                            <TimePicker style={{ width: "240px" }} value={dayjs(busRoute.firstFlightStartTime, "h:mm A")} use12Hours format="h:mm A" name="firstFlightStartTime" onChange={onChange}  allowClear={false} />
                      </Space>
                    </div>

                    <div className={styles.time}>
                          {/* <BoxInputBusRoute label="Giờ bắt đầu chuyến đầu tiên" name="firstFlightStartTime" value={busRoute.firstFlightStartTime ?? ""} onChange={handleChange} /> */}
                          <div className={styles.timeItem}>                
                              <p>Giờ bắt đầu chuyến cuối cùng</p>
                          </div>

                          <Space wrap>
                              <TimePicker style={{ width: "240px" }} value={dayjs(busRoute.lastFlightStartTime, "h:mm A")} use12Hours format="h:mm A" name="firstFlightStartTime" onChange={onChangeEnd}  allowClear={false} />
                          </Space>
                    </div>
              </div>
              
              <div className={styles.listDistance}>
                  <div className={styles.busStop}>            
                      <CheckBox options={busStop.map((item) => ({ value: item._id, label: item.name }))} selectedValues={selectedValues} onCheck={onCheckBox} orderMap={orderMap}/>
                  </div>
              </div>
            
              <div className={styles.list_tool}>
                    <div className={styles.distance}>
                        <BoxSelectBR value={selectedDirection} style={{ width : '100%'}} label="Phương Hướng" options={direction?.map(item => ({ value: item._id, label: item.description })) || []} onChange={ handleChangeSelect}/>
                    </div>

                    <div className={styles.tool}>
                          <BoxCreate onClick={handleSubmit} /> 
                    </div>
              </div>
            </div>
         </div>
    </>
  );
}

export default BusRouteCreate;