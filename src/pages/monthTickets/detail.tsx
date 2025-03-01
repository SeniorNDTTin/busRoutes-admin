import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import BoxHead from "../../components/boxHead";
import GoBack from "../../components/goBack";
import BoxInput from "../../components/boxInput";

import customerService from "../../services/customer.service";
import monthTicketService from "../../services/monthTicket.service";
import ButtonSwitch from "../../components/buttonSwitch";

function MonthTicketDetail() {
    const { id } = useParams();

    const [monthTicket, setMonthTicket] = useState({
        registerDate: "",
        expiredDate: "",
        expired: false,
        customerId: "",
        customerName: "",
        customerPhone: ""
    });

    useEffect(() => {
        const fetchApi = async () => {
            const monthTicket = (await monthTicketService.getById(id as string)).data;
            const customer = (await customerService.getById(monthTicket.customerId)).data;

            setMonthTicket({
                ...monthTicket,
                customerName: customer.fullName,
                customerPhone: customer.phone
            }) 
        };
        fetchApi();
    }, [id]);

    return (
        <>
            <GoBack />

            <BoxHead title="Chi Tiết Vé Tháng" />

            <div style={{ display: "flex", gap: "32px" }}>
                <BoxInput type="date" label="Ngày Đăng Ký" value={monthTicket.registerDate ?? ""} onChange={() => {}} />
                <BoxInput type="date" label="Ngày Hết Hạn" value={monthTicket.expiredDate ?? ""} onChange={() => {}} />
            </div>

            <BoxInput label="Khách Hàng" value={`${monthTicket.customerName} - SĐT: ${monthTicket.customerPhone}`} onChange={() => {}} />

            <ButtonSwitch checked={!monthTicket.expired} onChange={() => {}} checkedChildren="Còn hạn" unCheckedChildren="Hết hạn" />
        </>
    );
};

export default MonthTicketDetail;