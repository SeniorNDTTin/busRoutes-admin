import  { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {  Modal, Space, Input } from 'antd';

import busRouteService from '../../../services/busRoute.service';
import IBusRoute from '../../../interfaces/busRoutes';

const BusRouteDetail = () =>{
  const [modal2Open, setModal2Open] = useState(false);
    const {id} = useParams()
    const[busRoute, setBusRoute] = useState<Partial<IBusRoute>>({});

    useEffect(() => {
       const  fetchApi = async () => {
            const BusRoute = (await busRouteService.getById(id as string)).data
            setBusRoute(BusRoute)
        }
        fetchApi()
        setModal2Open(true);
    },[id])
    
    
    return (
      <>
          
          <Modal title="THÔNG TIN TUYẾN BUS" centered open={modal2Open} onCancel={() => setModal2Open(false)} footer ={null}>
              
                  <Space direction="vertical" size="middle">
                      <Space.Compact>
                          <Input style={{ width: '20%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Tên" readOnly/>
                          <Input style={{ width: '80%' }} name='name'  value={busRoute.name} onChange={() => {}}/>
                      </Space.Compact>

                      <Space.Compact>
                          <Input style={{ width: '20%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Độ dài" readOnly/>
                          <Input style={{ width: '80%' }}    type="number"  name='fullDistance'  value={busRoute.fullDistance} onChange={() => {}}/>
                      </Space.Compact>

                      <Space.Compact>
                          <Input style={{ width: '20%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Giá vé" readOnly/>
                          <Input style={{ width: '80%' }}   type="number"  name='fullPrice'  value={busRoute.fullPrice} onChange={() => {}}/>
                      </Space.Compact>

                      <Space.Compact>
                          <Input style={{ width: '30%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Thời gian" readOnly/>
                          <Input style={{ width: '70%' }}   value={busRoute.time} onChange={() => {}} />
                      </Space.Compact>

                      <Space.Compact>
                          <Input style={{ width: '55%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="TGBD chuyến đầu tiên" readOnly/>
                          <Input style={{ width: '45%' }}   value={busRoute.firstFlightStartTime} onChange={() => {}} />
                      </Space.Compact>

                      <Space.Compact>
                          <Input style={{ width: '60%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="TGBD chuyến cuối cùng" readOnly/>
                          <Input style={{ width: '45%' }}   value={busRoute.lastFlightStartTime} onChange={() => {}} />
                      </Space.Compact>

                      <Space.Compact>
                          <Input style={{ width: '60%' , fontWeight: '500' , color: 'black' ,backgroundColor: '#fdfdfd'}} placeholder="Khoảng TG giữa 2 chuyến" readOnly/>
                          <Input style={{ width: '45%' }}   value={busRoute.timeBetweenTwoFlight} onChange={() => {}} />
                      </Space.Compact>
                  </Space>
             {/* <input type="text" value={id} /> */}
          </Modal>
         
      </>
    )
}

export default BusRouteDetail