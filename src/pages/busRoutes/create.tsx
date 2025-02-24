import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Space, TimePicker ,TimePickerProps,Input} from 'antd';

import BoxHead from "../../components/boxHead";
import BoxInputBusRoute from "../../components/boxInputBusRoute";
import BoxInputBusRouteN from "../../components/boxInputBusRoute/number";
import GoBack from "../../components/goBack";
import BoxCreate from "../../components/boxCreate";


import busRouteService from "../../services/busRoute.service";
import styles from "../../assets/admin/busRoute.module.scss"

import configs from "../../configs";
import dayjs from "dayjs";

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


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusRoute({
        ...busRoute,
        [name]: name === "fullPrice" || name === "fullDistance" ? Number(value) : value
    });
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

  const handleSubmit = async () => {
    const data = {...busRoute}
    if(!busRoute.name || !busRoute.time|| !busRoute.firstFlightStartTime || !busRoute.lastFlightStartTime||!busRoute.timeBetweenTwoFlight){
        toast.error("Vui lòng không bỏ trống thông tin!");
        return;
    }

    if(busRoute.fullDistance <= 0 || busRoute.fullPrice <= 0){
        toast.error("Giá tiền hoặc độ dài toàn tuyến chưa hợp lệ !");
        return
    }
    const res = await (await busRouteService.create(data))

    if (res.code !== 201) {
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
                  <div className={styles.child}>
                    <BoxInputBusRouteN label="Độ dài tuyến" name="fullDistance" value={busRoute.fullDistance ?? 0} onChange={handleChange} />
                  </div>

                  <div className={styles.child1}>
                      <Input placeholder="Km" disabled/>
                  </div>             
              </div>

              <div className={styles.item}>
                <div className={styles.price}>
                  <BoxInputBusRouteN label="Giá vé tuyến" name="fullPrice" value={busRoute.fullPrice ?? 0} onChange={handleChange} />
                </div>

                <div className={styles.vnd}>
                    <Input placeholder="VND" disabled/>
                </div>
              </div>
            </div>

            <div className={styles.list}>
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

                <div className={styles.time}>
                  {/* <BoxInputBusRoute label="Giờ bắt đầu chuyến đầu tiên" name="firstFlightStartTime" value={busRoute.firstFlightStartTime ?? ""} onChange={handleChange} /> */}
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
            
            <div className={styles.list_tool}>

              <BoxInputBusRoute  label="Khoảng thời gian giữa hai chuyến" name="timeBetweenTwoFlight" value={busRoute.timeBetweenTwoFlight ?? ""} onChange={handleChange} />
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