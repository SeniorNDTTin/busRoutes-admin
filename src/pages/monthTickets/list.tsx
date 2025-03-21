import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import { Button, Space, Table, TableProps } from "antd";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";

import styles from "../../assets/admin/monthTicket/index.module.scss";

import IMonthTicket from "../../interfaces/monthTicket";
import monthTicketService from "../../services/monthTicket.service";
import customerService from "../../services/customer.service";
import ticketDetailService from "../../services/ticketDetail.service";

function MonthTicketList() {
    const [reload, setReload] = useState(false);

    const [monthTickets, setMonthTickets] = useState<IMonthTicket[]>([]);

    useEffect(() => {
        const fetchApi = async () => {
            const monthTickets = (await monthTicketService.get()).data;

            const monthTicketDetailed = await Promise.all(
                monthTickets.map(async (ticket) => {
                    const customer = (await customerService.getById(ticket.customerId)).data;
                    return { ...ticket, customerName: customer.fullName };
                })
            );

            setMonthTickets(monthTicketDetailed);
        }
        fetchApi();
    }, [reload]);

    const handleReload = () => {
        setReload(!reload);
    }

    const handleDel = async (id: string) => {
        if (confirm("Bạn chắc chứ?")) {
            const resTicket = await monthTicketService.del(id);
            if (resTicket.code !== 200) {
                toast.error("Có lỗi xảy ra!");
                return;
            }

            const ticketDetail = (await ticketDetailService.findByOneWayTicketId(id as string)).data;
            const resTicketDetail = await ticketDetailService.del(ticketDetail._id);
            if (resTicketDetail.code !== 200) {
                toast.error("Có lỗi xảy ra!");
                return;
            }

            toast.success("Đã xóa thành công!");
            handleReload();
        }
    }

    const columns: TableProps<IMonthTicket>["columns"] = [
        {
            title: "STT",
            dataIndex: "orderNumber",
            key: "orderNumber",
            render: (_, __, index: number) => <Button>{index + 1}</Button>
        },
        {
            title: "Ngày Đăng Ký",
            dataIndex: "registerDate",
            key: "registerDate",
            render: (registerDate: string) => {
                const date = new Date(registerDate);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
        {
            title: "Ngày Hết Hạn",
            dataIndex: "expiredDate",
            key: "expiredDate",
            render: (expiredDate: string) => {
                const date = new Date(expiredDate);
                const day = String(date.getDate()).padStart(2, "0");
                const month = String(date.getMonth() + 1).padStart(2, "0");
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            }
        },
        {
            title: "Khách Hàng",
            dataIndex: "customerName",
            key: "customerName",
        },
        {
            title: "Tình Trạng",
            dataIndex: "expired",
            key: "expired",
            render: (expired: boolean) => (
                <span className={`${styles["expired-status"]} ${expired ? styles["expired"] : styles["active"]}`}>
                    {expired ? "Hết Hạn" : "Còn Hạn"}
                </span>
            )
        },
        {
            title: "Hành động",
            dataIndex: "action",
            key: "action",
            render: (_, record) => {
                const id = record._id;

                return (
                    <Space>
                        <ButtonNavigateDetail id={id} />
                        <ButtonNavigateUpdate id={id} />
                        <Button type="primary" className="button-danger" onClick={() => handleDel(id)}>Xóa</Button>
                    </Space>
                );
            }
        }
    ];

    return (
        <>
            <BoxHead title="Danh Sách Vé Tháng" />

            <BoxNavigateCreate />

            <Table dataSource={monthTickets} columns={columns} />
        </>
    );
};

export default MonthTicketList;

