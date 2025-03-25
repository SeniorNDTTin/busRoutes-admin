import { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import { CalendarOutlined, TagOutlined, BarChartOutlined } from "@ant-design/icons";

import styles from "../../assets/admin/dashboard.module.scss";

import ticketDetailService from "../../services/ticketDetail.service";
import ITicketDetail from "../../interfaces/ticketDetail";

// Kiểu dữ liệu biểu đồ
interface ITicketData {
  month: string;
  quantity: number;
}

function Dashboard() {
  const [monthTicketData, setMonthTicketData] = useState<ITicketData[]>([]);
  const [oneWayTicketData, setOneWayTicketData] = useState<ITicketData[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      try {
        const tickets: ITicketDetail[] = (await ticketDetailService.get()).data;
        if (!tickets) return;

        const monthMap: Record<string, number> = {};
        const oneWayMap: Record<string, number> = {};

        tickets.forEach((ticket) => {
          if (!ticket.date) return;

          const date = new Date(ticket.date);
          if (isNaN(date.getTime())) return; // ktra có phải là date ko bằng cách chuyển về milliseconds

          const monthKey = `${date.getMonth() + 1}-${date.getFullYear()}`;

          if (ticket.type === "month") {
            monthMap[monthKey] = (monthMap[monthKey] || 0) + 1; // nếu chưa có monthKey đó thì đặt quantity=0 trước khi +1
          } else {
            oneWayMap[monthKey] = (oneWayMap[monthKey] || 0) + 1;
          }
        });

        // Chuyển map thành mảng & sắp xếp
        const formatData = (map: Record<string, number>) => {
          // chuyển mảng => chuyển object
          const array = Object.entries(map).map(([key, value]) => ({ month: key, quantity: value }));
          array.sort((a, b) => {
            const [monthA, yearA] = a.month.split("-").map(Number);
            const [monthB, yearB] = b.month.split("-").map(Number);
            return yearA - yearB || monthA - monthB;
          });
          return array;
        };        

        setMonthTicketData(formatData(monthMap));
        setOneWayTicketData(formatData(oneWayMap));
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
      }
    };

    fetchApi();
  }, []);

  const monthConfig = {
    data: monthTicketData,
    xField: "month",
    yField: "quantity",
    point: true,
    shapeField: "smooth",
    slider: {
      x: 1,
      y: 1
    }
  };

  const oneWayConfig = {
    data: oneWayTicketData,
    xField: "month",
    yField: "quantity",
    point: true,
    shapeField: "smooth",
    slider: {
      x: 1,
      y: 1
    }
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles["dashboard-chart"]}>
        <h1 className={styles["dashboard-chart__title"]}><BarChartOutlined style={{ marginRight: "10px" }} /> Biểu Đồ Số Lượng Vé Đã Bán Theo Tháng </h1>

        <div className={styles["chart-container"]}>
          <h2><CalendarOutlined style={{ color: "#1890ff", marginRight: "8px" }} /> Vé Tháng</h2>
          <div className={styles["chart-box"]}>
            <Line {...monthConfig} />
          </div>

          <h2><TagOutlined style={{ color: "#fa541c", marginRight: "8px" }} /> Vé Lượt</h2>
          <div className={styles["chart-box"]}>
            <Line {...oneWayConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
