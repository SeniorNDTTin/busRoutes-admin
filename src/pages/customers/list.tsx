import { useEffect, useState } from "react";

import { Button, Space, Table, TableProps } from "antd";

import BoxHead from "../../components/boxHead";
import ButtonNavigateDetail from "../../components/buttonNavigateDetail";
import ButtonNavigateUpdate from "../../components/buttonNavigateUpdate";
import BoxNavigateCreate from "../../components/boxNavigateCreate";

import ICustomer from "../../interfaces/customer";
import customerService from "../../services/customer.service";

import { toast } from "react-toastify";

function CustomerList() {
  const [reload, setReload] = useState(false);

  const [customers, setCustomers] = useState<ICustomer[]>([]);

  useEffect(() => {
    const fetchApi = async () => {
      const customers = (await customerService.get()).data;

      setCustomers(customers);
    }
    fetchApi();
  }, [reload]);

  const handleReload = () => {
    setReload(!reload);
  }

  const handleDel = async (id: string) => {
    if (confirm("Bạn chắc chứ?")) {
      const response = await customerService.del(id);

      if (response.code !== 200) {
        toast.error("Có lỗi xảy ra!");
        return;
      }

      toast.success("Đã xóa thành công!");
      handleReload();
    }
  }

  const columns: TableProps<ICustomer>["columns"] = [
    {
      title: "STT",
      dataIndex: "orderNumber",
      key: "orderNumber",
      render: (_, __, index: number) => <Button>{index + 1}</Button>
    },
    {
      title: "Họ Tên",
      dataIndex: "fullName",
      key: "fullName",
      
    },
    {
      title: "Số Điện Thoại",
      dataIndex: "phone",
      key: "phone",
      
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      
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
      <BoxHead title="Danh Sách Khách Hàng" />

      <BoxNavigateCreate />

      <Table dataSource={customers} columns={columns} />
    </>
  );
}

export default CustomerList;