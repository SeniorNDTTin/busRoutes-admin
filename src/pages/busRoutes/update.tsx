import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Space, TimePicker ,TimePickerProps,Input,  Checkbox} from 'antd';

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

import mapboxgl from 'mapbox-gl';


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
  const [busRouteDetailReturn, setBusRouteDetailReturn] = useState<IBusRouteDetail[]>([])

  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedValuesReturn, setSelectedValuesReturn] = useState<string[]>([]);

  const [direction , setDirection] = useState("")
  const [directionReturn, setDirectionReturn] = useState("")

  const [orderMap, setOrderMap] = useState<Map<string, number>>(new Map());
  const [orderMapReturn, setOrderMapReturn] = useState<Map<string, number>>(new Map());


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

        const [stop , detail, directionSv] = await Promise.all([
           busStopService.get(),
           busRouteDetailService.getByRouteId(id as string),
           directionService.get()
        ])
        
        setBusStop(stop?.data ? stop.data : busStop);
        setBusRouteDetail(detail?.data ? detail.data : busRouteDetail);

        if(directionSv?.data){
          
          const directionGo = directionSv.data.find(value => value.description === 'Lượt đi')
          const directionReturn = directionSv.data.find(value => value.description === 'Lượt về')  
          if (directionGo) setDirection(directionGo._id);
          if (directionReturn) setDirectionReturn(directionReturn._id);

          const detailGo = directionGo && detail.data ? detail.data.filter(dir => dir.directionId === directionGo._id) : [];
          // setBusRouteDetail(detailGo.length > 0 ? detailGo : busRouteDetail)
          const detailReturn = directionReturn && detail.data ? detail.data.filter(dir => dir.directionId === directionReturn._id) : [];
          // setBusRouteDetailReturn(detailReturn.length > 0 ? detailReturn : busRouteDetailReturn)


          const infoStop  = async (directionId : IBusRouteDetail[])=>{
            if(directionId){
              return await Promise.all(
                directionId
                  .map(async item => {
                    return (await busStopService.getById(item.busStopId)).data;
                  })
              )
            }
            return [];
          }
          const detailList =  (directionId : string)=>{
            if(detail?.data){
                return detail.data.filter(dir => dir.directionId === directionId)
            }     
            return []     
          }

          if(directionGo){
            const detailListGo = await infoStop( detailGo)
            setSelectedValues(detailListGo.map(id => id._id));

            const initialOrderMap = new Map<string, number>();
            const detailGoList = detailList(directionGo._id);
            detailGoList.forEach(value => {
              initialOrderMap.set(value.busStopId, value.orderNumber);
            });
            setOrderMap(initialOrderMap);
          }

          if (directionReturn) {
            const detailListReturn = await infoStop(detailReturn);
            setSelectedValuesReturn(detailListReturn.map((item) => item._id));
           
            const initialOrderMapReturn = new Map<string, number>();
            const detailReturnList = detailList(directionReturn._id);
            detailReturnList.forEach((value) => {
              initialOrderMapReturn.set(value.busStopId, value.orderNumber);
            });
  
            setOrderMapReturn(initialOrderMapReturn);
          }
        }

      }
    };
  
    fetchApi();
  }, [id]);

  useEffect(() => {
    if (selectedValues.length === 0 && checkDeselect) {
      setTimeout(() => setCheckDeselect(false), 250);
    }
    if (selectedValuesReturn.length === 0 && checkDeselectReturn) {
      setTimeout(() => setCheckDeselectReturn(false), 250);
    }
  }, [selectedValues, selectedValuesReturn]);
  
 
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
  const [checkDeselect, setCheckDeselect] = useState(false)
  const deSelect = () => {
    setCheckDeselect(true)
    setSelectedValues([]);
    setOrderMap(new Map());
  }

  const onCheckBox = (checkedValues: string[]) => {
    setSelectedValues(checkedValues)
  
    const newOrderMap = new Map<string, number>();
    checkedValues.forEach((value, index) => {
      newOrderMap.set(value, index + 1);
    });
  
    setOrderMap(newOrderMap);
    const reversedValues = [...checkedValues].reverse()
    setSelectedValuesReturn(reversedValues)

    const reversedOrderMap = new Map<string, number>()
      reversedValues.forEach((value , index) =>{
        reversedOrderMap.set(value , index + 1)
      })
      setOrderMapReturn(reversedOrderMap);

  };


  const [checkDeselectReturn, setCheckDeselectReturn] = useState(false)
  const deSelectReturn = () => {
    setCheckDeselectReturn(true)
    setSelectedValuesReturn([]);
    setOrderMapReturn(new Map());
  }


  const onCheckBoxReturn = (checkedValues: string[]) => {
    setSelectedValuesReturn(checkedValues)

    const newOrderMap = new Map<string, number>();
    checkedValues.forEach((value, index) => {
      newOrderMap.set(value, index + 1);
    });
  
    setOrderMapReturn(newOrderMap);
  };
  
  mapboxgl.accessToken = 'pk.eyJ1IjoibmdodWllbiIsImEiOiJjbThsemZrbzEwYzE0Mmlwd21ud3JicXZnIn0.8Jpx_wzZc_A3j_5a6pLIfw';
  const getDrivingDistance = async (lat1: number, lng1: number, lat2: number, lng2: number): Promise<number> => {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${lng1},${lat1};${lng2},${lat2}?access_token=${mapboxgl.accessToken}&geometries=geojson`;
  
    const response = await fetch(url);
    const data = await response.json();
  
    if (data.routes && data.routes.length > 0) {
      return data.routes[0].distance; 
    }
  
    return 0
  };
  

  const handleSubmit = async () => {
    if (selectedValues.length === 0 && selectedValuesReturn.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 chiều !")
      return
    }else if(  (selectedValues.length > 0 && selectedValues.length < 2) ||   (selectedValuesReturn.length > 0 && selectedValuesReturn.length < 2) ){
      toast.error("Vui lòng chọn tối thiểu 2 trạm dừng!");
      return;
    }

    if(!busRoute.name || !busRoute.time|| !busRoute.firstFlightStartTime || !busRoute.lastFlightStartTime||!busRoute.timeBetweenTwoFlight){
        toast.error("Vui lòng không bỏ trống thông tin!");
        return;
    }
  
    if(busRoute.fullDistance <= 0 || busRoute.fullPrice <= 0){
      toast.error("Giá tiền hoặc độ dài toàn tuyến chưa hợp lệ !");
      return;
    }
    toast.info("Vui lòng chờ giây lát !!", {
      autoClose: 1500, 
    });
      const createBusRouteDetails = async (stops : string[], directionId : string)  =>{
        const stopList = await Promise.all(
              stops.map(async (id: string) => {
                return (await busStopService.getById(id)).data
            })
        )

        let full = 0
        const newDetails = [];
        for(const [index, stop] of stopList.entries()){
          const distancePre = index === 0 ?  0 : (await getDrivingDistance(stopList[index - 1].latitude, stopList[index - 1].longitude, stop.latitude , stop.longitude)) ;
          const busRouteDetailData = {
            orderNumber: index + 1,
            distancePre,
            busRouteId: id,
            busStopId: stop._id,
            directionId,
          }

          const detail = await busRouteDetailService.create(busRouteDetailData);
            if (detail.code !== 201) {
              console.log("thêm chi tiết tuyến không thành công", detail)
              toast.error("Có lỗi xảy ra!");
              return;
            }
            full += distancePre
            newDetails.push(detail.data);
        }
        
        const data = { ...busRoute,fullPrice: busRoute.fullPrice, fullDistance: Math.round(full / 1000) };
         const res = await busRouteService.update(id as string, data);
        if (res.code !== 200) {
          console.log("cập nhật tuyến không thành công", res)
          toast.error("Có lỗi xảy ra!");
          return;
        }
        return newDetails; 
      }
      
      await Promise.all(busRouteDetail.map(item => busRouteDetailService.del(item._id)));   

      if (selectedValues.length > 1) {
        const newDetails = await createBusRouteDetails(selectedValues, direction);

        if (newDetails) setBusRouteDetail(newDetails);
      }

      if (selectedValuesReturn.length > 1) {
        const newDetailsReturn = await createBusRouteDetails(selectedValuesReturn, directionReturn);

        if (newDetailsReturn) setBusRouteDetailReturn(newDetailsReturn);
        
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
                              <TimePicker style={{ width: "115px" }} value={dayjs(startTime, "h:mm A")} use12Hours format="h:mm A" name="startTime" onChange={onChangeStartTime}  allowClear={false} inputReadOnly ={true}/>
                        </Space>
                        <Space wrap>
                                <TimePicker style={{ width: "115px" }} value={dayjs(endTime, "h:mm A")} use12Hours format="h:mm A" name="endTime" onChange={onChangeEndTime}  allowClear={false} inputReadOnly ={true}/>
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
                          <TimePicker style={{ width: "240px" }} value={dayjs(busRoute.firstFlightStartTime, "h:mm A")} use12Hours format="h:mm A" name="firstFlightStartTime" onChange={onChange}  allowClear={false} inputReadOnly ={true}/>
                    </Space>
                  </div>

                  <div className={styles.time}>
                      <div className={styles.timeItem}>                
                        <p>Giờ Bắt Đầu Chuyến Cuối Cùng</p>
                      </div>
                      <Space wrap>
                          <TimePicker style={{ width: "240px" }} value={dayjs(busRoute.lastFlightStartTime, "h:mm A")} use12Hours format="h:mm A" name="firstFlightStartTime" onChange={onChangeEnd}  allowClear={false} inputReadOnly ={true}/>
                      </Space>
                  </div>

                  <div className={styles.item}>
                      <BoxInputBusRoute  label="Khoảng TG Giữa Hai Chuyến" name="timeBetweenTwoFlight" value={busRoute.timeBetweenTwoFlight ?? ""} onChange={handleChange} />
                  </div>
              </div>

              <div className={styles.listDistance}>
                  <div className={styles.busStop}>
                      <div className={styles.direction1}>  
                          <div className={styles.turn}>Lượt đi: </div>       
                          <Checkbox className={styles.deselect1}disabled={selectedValues.length === 0}  onClick={deSelect} checked={checkDeselect}>Bỏ chọn</Checkbox>
                      </div> 

                      <CheckBox options={busStop.map((item) => ({ value: item._id, label: item.name }))} selectedValues={selectedValues} onCheck={onCheckBox} orderMap={orderMap}/>
                  </div>
              </div>

              <div className={styles.listDistance}>
                  <div className={styles.busStop}>
                      <div className={styles.direction1}>
                         <div className={styles.return}>Lượt về: </div>     
                          <Checkbox className={styles.deselect2} disabled={selectedValuesReturn.length === 0}  onClick={deSelectReturn} checked={checkDeselectReturn}>Bỏ chọn</Checkbox>
                      </div>
                      
                      <CheckBox options={busStop.map((item) => ({ value: item._id, label: item.name }))} selectedValues={selectedValuesReturn} onCheck={onCheckBoxReturn} orderMap={orderMapReturn}/>
                  </div>
              </div>
        
              <div className={styles.list_tool}>
                    
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