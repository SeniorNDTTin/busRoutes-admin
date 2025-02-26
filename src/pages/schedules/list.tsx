import { useEffect, useState } from "react"

import { Button, Space, Table, TableProps } from "antd";
import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";
import GoBusRoute from "../../components/goBusRoute";

import ISchedule from "../../interfaces/schedule"
import scheduleService from "../../services/schedule.service";
import busRouteService from "../../services/busRoute.service";
import busService from "../../services/bus.service";

import { toast } from "react-toastify";

import styles from "../../assets/admin/schedule/index.module.scss"

const ScheduleList = () => {
    const [schedule, setSchedule] = useState<ISchedule[]>([])
    const [reload, setReload] = useState(false)
    

    useEffect(() => {
        const api = async () => {
            const schedule = (await scheduleService.get()).data
            if(schedule){
                const updateSchedule = await Promise.all(
                    schedule.map(async (item) => {
                        const busRoute = (await busRouteService.getById(item.busRouteId)).data
                        const bus = (await busService.getById(item.busId)).data
                        
                        return{
                            ...item,
                            busRouteName : busRoute?.name  as "busRouteName" || "unknow",
                            licensePlate : bus?.licensePlate || "unknow"
                        }
                    })
                )
                updateSchedule.sort((a, b) => a.busRouteName.localeCompare(b.busRouteName));
                setSchedule(updateSchedule)
            }
        }

        api()
    },[reload])

    const handleReload = () => {
      setReload(!reload);
    }

    const handleDel = async (id: string) => {
      if (confirm("Bạn chắc chứ?")) {
        const response = await scheduleService.del(id)
  
        if (response.code !== 200) {
          toast.error("Có lỗi xảy ra!");
          return;
        }
  
        toast.success("Đã xóa thành công!");
        handleReload();
      }
    }
  
    const columns: TableProps<ISchedule>["columns"] = [
        {
          title: "STT",
          dataIndex: "orderNumber",
          key: "orderNumber",
          align: "center",
          className: "tableItem",
          onHeaderCell: () => ({className: styles.header_cell}),
          render: (_, __, index: number) => <Button>{index + 1}</Button>
        },
        {
          title: "Bus",
          dataIndex: "licensePlate",
          key: "licensePlate",
          align: "center",
          className: "tableItem",
          onHeaderCell: () => ({className: styles.header_cell}),
        },
        {
          title: "Giờ bắt đầu",
          dataIndex: "timeStart",
          key: "timeStart",
          align: "center",
          onHeaderCell: () => ({className: styles.header_cell}),
        },
        {
          title: "Giờ kết thúc",
          dataIndex: "timeEnd",
          key: "timeEnd",
          align: "center",
          onHeaderCell: () => ({className: styles.header_cell}),
        },
        {
          title: "Tuyến",
          dataIndex: "busRouteName",
          key: "busRouteName",
          align: "center",
          onHeaderCell: () => ({className: styles.header_cell}),
          onCell: () => ({className: styles.data_cell})
        },
        {
          title: "Hành động",
          dataIndex: "action",
          key: "action",
          align: "center",  
          onHeaderCell: () => ({className: styles.header_cell}),
          render: (_, record) => {
            const id = record._id;
    
            return (
              <Space>
                <ButtonNavigateDetail id={id} />
                <ButtonNavigateUpdate id={id} />
                <Button type="primary" className="button-danger delete" onClick={() => handleDel(id)}>Xóa</Button>
              </Space>
            );
          }
        }
      ];

      return(
        <>
            <GoBusRoute />
             <BoxHead title="LỊCH KHỞI HÀNH CÁC BUS" />
             <BoxNavigateCreate />
            <Table dataSource={schedule} columns={columns}></Table>
        </>
      )
}

export default ScheduleList