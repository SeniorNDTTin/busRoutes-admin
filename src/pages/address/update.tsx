import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import addressService from "../../services/address..service";
import GoBack from "../../components/goBack";
import BoxUpdate from "../../components/boxUpdate";

function AddressUpdate() {
  const { id } = useParams();

  const [street, setStreet] = useState("");
  const [ward, setWard] = useState("");
  const [district, setDistrict] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const address = (await addressService.getById(id as string)).data;

      setStreet(address.street);
      setWard(address.ward);
      setDistrict(address.district)
    }
    fetchApi();
  }, [id]);

  const onChangeStreet = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStreet(e.target.value);
  }
  const onChangeWard = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWard(e.target.value);
  }
  const onChangeDistrict = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDistrict(e.target.value);
  }

  const handleSubmit = async () => {
    if (
      !street ||
      !ward ||
      !district
    ) {
      toast.error("Chưa nhập đủ thông tin!");
      return;
    }

    const response = await addressService.update(id as string, {
      street,
      ward,
      district
    });
    if (response.code !== 200) {
      toast.error("Có lỗi xảy ra!");
      return;
    }

    toast.success("Cập nhật thành công!");
  }

  return (
    <>
      <GoBack />

      <BoxHead title="Cập Nhật Địa Chỉ" />

      <BoxInput label="Tên đường" value={street} onChange={onChangeStreet} />
      <BoxInput label="Phường" value={ward} onChange={onChangeWard} />
      <BoxInput label="Quận" value={district} onChange={onChangeDistrict} />

      <BoxUpdate onClick={handleSubmit} />
    </>
  );
}

export default AddressUpdate;