import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxCreate from "../../components/boxCreate";
import BoxInput from "../../components/boxInputMonthTicketPrice";

import configs from "../../configs";

import customerService from "../../services/customer.service";

function CustomerCreate() {
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    email: ""
  });

  const handleChange = (name: string, value: string | number) => {
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async () => {
    const data = {...customer}
    if(
      !customer.fullName ||
      !customer.phone ||
      !customer.email
    ) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    if(!/^0[1-9][0-9]{8,9}$/.test(customer.phone)) {
      toast.error("Số điện thoại không hợp lệ!");
      return;
    }

    if(!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(customer.email)) {
      toast.error("Email không hợp lệ!");
      return;
    }

    const response = await customerService.create(data);

    if(response.code!==201) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Tạo mới thành công!");
    navigate(`/${configs.prefixAdmin}/customers`);
  }


  return (
    <>
      < GoBack />

      < BoxHead title="Thêm Khách Hàng Mới" />

      < BoxInput name="fullName" label="Họ tên" value={customer.fullName ?? ""} onChange={handleChange} />
      
      < BoxInput name="phone" label="Số điện thoại" value={customer.phone ?? ""} onChange={handleChange} />

      < BoxInput name="email" label="Email" value={customer.email ?? ""} onChange={handleChange} />

      < BoxCreate onClick={handleSubmit} />
    </>
  );
}

export default CustomerCreate