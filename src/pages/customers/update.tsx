import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxUpdate from "../../components/boxUpdate";
import BoxInput from "../../components/boxInputMonthTicketPrice";

import configs from "../../configs";
import customerService from "../../services/customer.service";


function CustomerUpdate() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    fullName: "",
    phone: "",
    email: ""
  });

  useEffect(() => {
    const fetchApi = async () => {
      const customer = (await customerService.getById(id as string)).data;
  
      setCustomer(customer);
    };
    fetchApi();
  }, [id]);

  const handleChange = (name: string, value: string | number) => {  
    setCustomer((prev) => ({
      ...prev,
      [name]: value,
    }));
  };  

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

    const response = await customerService.update(id as string, data);

    if (response.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Cập nhật thành công!");
    navigate(`/${configs.prefixAdmin}/customers`);
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Cập Nhật Thông Tin Khách Hàng" />

      < BoxInput name="fullName" label="Họ tên" value={customer.fullName ?? ""} onChange={handleChange} />
      
      < BoxInput name="phone" label="Số điện thoại" value={customer.phone ?? ""} onChange={handleChange} />

      < BoxInput name="email" label="Email" value={customer.email ?? ""} onChange={handleChange} />

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default CustomerUpdate;