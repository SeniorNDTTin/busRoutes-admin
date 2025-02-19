import  { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {  Modal, Space, Input , TimePicker} from 'antd';
import configs from '../../../configs';

import { toast } from "react-toastify";
import dayjs from 'dayjs';

import busRouteService from '../../../services/busRoute.service';
import styles from "../../../assets/admin/busRoutes/update_info/create.module.scss"

const BusRouteUpdate = () =>{
    const navigate = useNavigate()
    const [modal2Open, setModal2Open] = useState(false);
    const {id} = useParams()
    
    const format = 'HH:mm'
    const[busRoute, setBusRoute] = useState({
        name: "",
        fullDistance: 0,
        fullPrice: 0,
        time: "",
        firstFlightStartTime: "", 
        lastFlightStartTime: "",   
        timeBetweenTwoFlight: "",
    });
    
    const handleSubmit = async () => {
       const data = {
            ...busRoute,
            firstFlightStartTime: busRoute.firstFlightStartTime ? busRoute.firstFlightStartTime : "00:00",
            lastFlightStartTime: busRoute.lastFlightStartTime ? busRoute.lastFlightStartTime : "00:00",
             time: busRoute.time || `${busRoute.firstFlightStartTime} - ${busRoute.lastFlightStartTime}`
       };

      if(!busRoute.name || !busRoute.timeBetweenTwoFlight){
            console.log(busRoute.lastFlightStartTime, busRoute.time, busRoute.timeBetweenTwoFlight)
            toast.error("Vui lòng không bỏ trống thông tin!");
            return;
      }

      if(busRoute.fullDistance <= 0 || busRoute.fullPrice <= 0){
        toast.error("Giá tiền hoặc độ dài toàn tuyến chưa hợp lệ !");
        return
      }
   
       const res = await (await busRouteService.update(id as string,data))
       if (res.code !== 200) {
           toast.error("Có lỗi xảy ra!");
           return;
       }
       
         toast.success("Cập nhật thành công");
         setModal2Open(false)
         navigate(`/${configs.prefixAdmin}/busRoutes/update-information`);
         
    }
    useEffect(() => {
        const  fetchApi = async () => {
             const BusRoute = (await busRouteService.getById(id as string)).data
             setBusRoute(BusRoute)
         }
         fetchApi()
         setModal2Open(true);
     },[id])

     const [startTime, setStartTime] = useState(dayjs("00:00", format));
     const [endTime, setEndTime] = useState(dayjs("00:00", format));
     const handleTimeChange = (time: dayjs.Dayjs | null, type: "start" | "end") => {
         if (!time) return;
     
         if(type === "start"){
             setStartTime(time)
             setBusRoute((prev) => ({
               ...prev, 
               time: `${time.format(format)} - ${endTime.format(format)}`
             }))
           
         }else{
             setEndTime(time)
             setBusRoute((prev) => ({
               ...prev, 
                 time: `${startTime.format(format)} - ${time.format(format)}`
             }))
         
         }
     };

     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // setBusRoute({ ...busRoute, [e.target.name]: e.target.value });
        const { name, value } = e.target;
        setBusRoute({
            ...busRoute,
            [name]: name === "fullPrice" || name === "fullDistance" ? Number(value) : value
        });
     }


      return (
        <>
            <Modal title="THÊM THÔNG TIN TUYẾN BUS" centered open={modal2Open}   onOk={handleSubmit} onCancel={() => setModal2Open(false)}  okText="Lưu"   cancelText="Hủy">
            <Space direction="vertical" size="middle">
                    <Space.Compact>
                        <Input style={{ width: '20%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Tên" readOnly/>
                        <Input style={{ width: '80%' }} name='name'  onChange={handleChange} value={busRoute.name}/>
                    </Space.Compact>

                    <Space.Compact>
                        <Input style={{ width: '20%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Độ dài" readOnly/>
                        <Input style={{ width: '80%' }}    type="number"  name='fullDistance'  onChange={handleChange} value={busRoute.fullDistance}/>
                    </Space.Compact>

                    <Space.Compact>
                        <Input style={{ width: '20%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Giá vé" readOnly/>
                        <Input style={{ width: '80%' }}   type="number"  name='fullPrice'  onChange={handleChange}value={busRoute.fullPrice}/>
                    </Space.Compact>

                    <Space.Compact>
                        <Input style={{ width: '20%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Thời gian" readOnly/>
                        <div className={styles.time}>
                            <TimePicker  value={startTime}   format={format}  style={{ width: '45%' }}   onChange={(time) => handleTimeChange(time, "start")}  />
                            <TimePicker  value={endTime}  format={format}  style={{ width: '45%' }}  onChange={(time) => handleTimeChange(time, "end")} />
                        </div>
                    </Space.Compact>

                    <Space.Compact>
                        <Input style={{ width: '55%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="TGBD chuyến đầu tiên" readOnly/>
                        {/* <Input style={{ width: '50%' }} name='fullPrice'   /> */}
                        <TimePicker   value={busRoute.firstFlightStartTime ? dayjs(busRoute.firstFlightStartTime, format) : null}  style={{ width: '45%' }} onChange={(time) => setBusRoute({ ...busRoute, firstFlightStartTime: time })} />
                    </Space.Compact>

                    <Space.Compact>
                        <Input style={{ width: '60%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="TGBD chuyến cuối cùng" readOnly/>
                        <TimePicker   value={busRoute.lastFlightStartTime ? dayjs(busRoute.lastFlightStartTime, format) : null}    format={format}  style={{ width: '45%' }} onChange={(time) => setBusRoute({ ...busRoute, lastFlightStartTime: time })} />
                    </Space.Compact>

                    <Space.Compact>
                        <Input style={{ width: '60%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Khoảng TG giữa 2 chuyến" readOnly/>
                        <Input style={{ width: '40%' }} name='timeBetweenTwoFlight' onChange={handleChange} value={busRoute.timeBetweenTwoFlight}/> 
                    </Space.Compact>
                </Space>
            
            </Modal>
        </>
      )
}

export default BusRouteUpdate