//library
import React, { useState, useEffect } from 'react';
import { Button,Pagination } from 'antd';

import { useLocation } from "react-router-dom";

//component
import ButtonDetail from '../../../components/busRouteTool/buttonDetail';
import ButtonUpdate from '../../../components/busRouteTool/buttonUpdate';

//style
import styles from "../../../assets/admin/busRoutes/update_info/index.module.scss"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import { toast } from "react-toastify";
//component
import ButtonDel from '../../../components/busRouteTool/buttonDel';
import ButtonCreate from '../../../components/busRouteTool/butonCreate';

//interface
import IBusRoute from '../../../interfaces/busRoutes';
//service
import busRouteService from '../../../services/busRoute.service'

import { Outlet } from 'react-router-dom';

const BusRoutePage: React.FC = () => {
    
    const location = useLocation();
    // const [reload, setReload] = useState(false);
    const [reload, setReload] = useState(location.state?.setReloadn || false);
    console.log("Location state:", reload);
    const [busRoutes, setbusRoutes] = useState<IBusRoute[]>([]);

    const pageSize = 3;
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log("State: ", reload)
        const fetchApi = async () => {
            try{
                const busRoutes = (await busRouteService.get()).data;
                if(busRoutes.length > 0){
                    setbusRoutes(busRoutes);
                }else{
                    console.log("No data available");
                }
            }catch (err){
                    console.log(`Lỗi : ${err}`)
            }
        }
        fetchApi();
    }, [reload]);
    
    const handleReload = () => {
        setReload(!reload);
    }

    const handlePaginate = (page: number) => {
        setCurrentPage(page)
    }

    const startIndex = (currentPage - 1) * pageSize
    const endIndex = currentPage * pageSize
    const paginate = busRoutes.slice(startIndex, endIndex)

    const handleDel = async (id: string) => {
        if (confirm("Bạn chắc chứ?")) {
          const response = await busRouteService.del(id);
    
          if (response.code !== 200) {
            toast.error("Có lỗi xảy ra!");
            return;
          }
    
          toast.success("Đã xóa thành công!");
          const updateBusRoutes = busRoutes.filter(route => route._id !== id)
          setbusRoutes(updateBusRoutes)

          const totalPageUpdate = Math.ceil(updateBusRoutes.length / pageSize)
          if(currentPage > totalPageUpdate) setCurrentPage(curr =>Math.max(curr -1,1))
          handleReload();
        }
    }

    return (
        <>
            <div className={styles.tool}>
                <ButtonCreate />
                {/* <BusRouteCreate handleReload={handleReload}/> */}
                <form action=""  className={`${styles.form_search} mb-3`}>
                        <div className={`${styles.search_icon_wrapper} container d-flex`}>
                            <div className={styles.search_input}>
                                <input type="search" className="form-control" name="keywords" placeholder="Tìm tên tuyến..." />
                            </div>

                            <div className={styles.search_icon}>
                                <div className="col-2 w-100">
                                     <Button color="primary" variant="outlined" className={styles.search_button}><i className="fa-solid fa-magnifying-glass"></i></Button>
                                </div>
                            </div>

                        </div>

                </form>       
            </div>
           
            <div className={styles.list_busRoutes}>
                {paginate.length > 0 ? (
                    <>
                        {paginate.map((route, index) => (
                            <div key={route._id} className={styles.busRoute}>
                                <div className={styles.busInfo}>
                                    <div className={styles.stt}><p style={{ fontWeight: '500', color: 'rgb(239, 65, 65'}}> {startIndex + index + 1}</p></div>
                                    <p key={index} style={{ fontWeight: '500', color: 'black'}} >{route.name}</p>
                                </div>

                                <div className={styles.busTool}>
                                    <div><ButtonDetail id={route._id}/></div>
                                    <div><ButtonUpdate id={route._id}/></div>
                                    <div><ButtonDel  onClick={() => handleDel(route._id)} /></div> 
                                </div>
                            </div>
                        ))}
                        <Pagination className={styles.pagination} defaultCurrent={currentPage} total={busRoutes.length} pageSize={pageSize} onChange={handlePaginate}/>
                    </>
                ) : (
                    <div className={styles.data}>
                        <p style={{ width: '20%' }}>Không có dữ liệu...</p>
                    </div>
                )}
            </div>
            <Outlet />
        </>
    );
}

export default BusRoutePage;
