import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxCreate from "../../components/boxCreate";
import BoxInput from "../../components/boxInputMonthTicketPrice";
import BoxSelect from "../../components/boxSelect";
import ButtonSwitch from "../../components/buttonSwitch";

import configs from "../../configs";
import styles from "../../assets/admin/monthTicket/update.module.scss";

import monthTicketService from "../../services/monthTicket.service";
import ICustomer from "../../interfaces/customer";
import customerService from "../../services/customer.service";

function monthTicketCreate() {
    const navigate = useNavigate();

    const [monthTicket, setMonthTicket] = useState({
        registerDate: "",
        expiredDate: "",
        expired: false,
        customerId: ""
    });

    const [customers, setCustomers] = useState<ICustomer[]>([]);
    
    useEffect(() => {
        const fetchApi = async () => {
            const customers = (await customerService.get()).data;
            setCustomers(customers);
        };
        fetchApi();
    }, []);

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
                [name]: value
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

        const response = await monthTicketService.create(data);

        if(response.code !== 201) {
            toast.error("Có lỗi xảy ra!");
            return;
        }

        toast.success("Tạo mới thành công!");
        navigate(`/${configs.prefixAdmin}/month-tickets`);
    };

    return (
        <>
            <GoBack />
             
            <BoxHead title="Thêm Vé Tháng Mới" />

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

            <BoxCreate onClick={handleSubmit} />
        </>
    )
};

export default monthTicketCreate;


