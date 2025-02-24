import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import ICustomer from "../../interfaces/customer";
import customerService from "../../services/customer.service";

function CustomerDetail() {
  const { id } = useParams();

  const[customer, setCustomer] = useState<Partial<ICustomer>>({});

  useEffect(() => {
    const fetchApi = async () => {
      const customer = (await customerService.getById(id as string)).data;
      setCustomer(customer);
    }
    fetchApi();
  }, [id]);

  return (
    <>
      <GoBack />

      <BoxHead title="Thông Tin Chi Tiết Khách Hàng" />

      <BoxInput label="Họ Tên Khách Hàng" value={customer.fullName ?? ""} onChange={() => { }} />
      <BoxInput label="Số Điện Thoại" value={customer.phone ?? ""} onChange={() => { }} />

      <BoxInput label="Email" value={customer.email ?? ""} onChange={() => { }} />

    </>
  );
}

export default CustomerDetail;