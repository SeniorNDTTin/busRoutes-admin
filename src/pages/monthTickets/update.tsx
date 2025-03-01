import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import configs from "../../configs";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInputMonthTicketPrice";
import BoxSelect from "../../components/boxSelect";
import ButtonSwitch from "../../components/buttonSwitch";
import BoxUpdate from "../../components/boxUpdate";

import styles from "../../assets/admin/monthTicket/update.module.scss";

import ICustomer from "../../interfaces/customer";
import customerService from "../../services/customer.service"
import monthTicketService from "../../services/monthTicket.service";
import { Button } from "antd";

function MonthTicketUpdate() {
    const { id } = useParams();

    const navigate = useNavigate();

    const [monthTicket, setMonthTicket] = useState({
        registerDate: "",
        expiredDate: "",
        expired: false,
        customerId: ""
    });

    const [oldMonthTicket, setOldMonthTicket] = useState(monthTicket);

    const [customers, setCustomers] = useState<ICustomer[]>([]);
    
    useEffect(() => {
        const fetchApi = async () => {
            const customers = (await customerService.get()).data;
            setCustomers(customers);
        };
        fetchApi();
    }, []);

    useEffect(() => {
        const fetchApi = async () => {
            const monthTicket = (await monthTicketService.getById(id as string)).data;
            setMonthTicket(monthTicket);
            setOldMonthTicket(monthTicket);
        };
        fetchApi();
    }, [id]);

    const handleChange = (name: string, value: string | number) => {
        setMonthTicket((prev) => {
            if(name === "expiredDate" && typeof value === "string") {
                const today = new Date().toISOString().split("T")[0];
                return {
                    ...prev,
                    expired: value < today,
                    expiredDate: value
                }
            }
            return {
                ...prev,
                [name] : value
            };
        });
    };

    // const handleChangeSwitch = (checked: boolean) => {
    //     setMonthTicket((prev) => ({
    //         ...prev,
    //         expired: !checked
    //     }))
    // };

    const handleSubmit = async () => {
        const data = {...monthTicket}
        if(
            !monthTicket.registerDate ||
            !monthTicket.expiredDate ||
            !monthTicket.customerId
        ) {
            toast.error("Chưa nhập đủ thông tin!");
            return;
        }

        if(monthTicket.registerDate >= monthTicket.expiredDate) {
            toast.error("Khoảng thời gian không hợp lệ!");
            return;
        }

        const response = await monthTicketService.update(id as string, data);

        if(response.code !== 200) {
            toast.error("Có lỗi xảy ra!");
            return;
        }

        toast.success("Cập nhật thành công!");
        navigate(`/${configs.prefixAdmin}/month-tickets`);
    };

    const handleRenew = async () => {
        const newExpiredDate = new Date();
        newExpiredDate.setMonth(newExpiredDate.getMonth() + 1);

        // lấy thông tin gốc chưa qua update state
        const updatedData = {
            ...oldMonthTicket,  
            registerDate: new Date().toISOString().split('T')[0], 
            expiredDate: newExpiredDate.toISOString().split('T')[0], 
            expired: false 
        };
    
        setMonthTicket(updatedData);

        if(confirm("Vé sẽ được gia hạn thêm 1 tháng. Bạn chắc chứ?")) {
            const response = await monthTicketService.update(id as string, updatedData);

            if(response.code !== 200) {
                toast.error("Có lỗi xảy ra!");
                return;
            }
    
            toast.success("Gia hạn thành công!");
            navigate(`/${configs.prefixAdmin}/month-tickets`);
        }
    }

    return (
        <>
            <GoBack />
                
            <BoxHead title="Cập Nhật Vé Tháng" />

            <div className={styles["flex-container"]}>
                <BoxInput type="date" name="registerDate" label="Ngày Đăng Ký" value={monthTicket.registerDate ?? ""} onChange={handleChange} />
                <BoxInput type="date" name="expiredDate" label="Ngày Hết Hạn" value={monthTicket.expiredDate ?? ""} onChange={handleChange} />
            </div>

            <BoxSelect
                label="Khách Hàng" 
                value={monthTicket.customerId}
                options={customers?.map(item => ({value: item._id, label: item.fullName + " - SĐT: " + item.phone})) || []}
                onChange={(value) => handleChange("customerId", value)}
            />

            <ButtonSwitch checked={!monthTicket.expired} onChange={() => {}} checkedChildren="Còn hạn" unCheckedChildren="Hết hạn" />
            {/* <ButtonSwitch checked={!monthTicket.expired} onChange={handleChangeSwitch} checkedChildren="Còn hạn" unCheckedChildren="Hết hạn" /> */}

            <div className={styles.buttonContainer}>
            <BoxUpdate onClick={handleSubmit} />

            <Button className={styles.renewButton} onClick={handleRenew}>GIA HẠN</Button>
            </div>
        </>
    )
};

export default MonthTicketUpdate;