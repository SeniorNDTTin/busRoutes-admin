import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import addressService from "../../services/address..service";

function AddressDetail() {
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

  return (
    <>
      <GoBack />

      <BoxHead title="Chi Tiết Địa Chỉ" />

      <BoxInput label="Tên đường" value={street} onChange={() => {}} />
      <BoxInput label="Phường" value={ward} onChange={() => {}} />
      <BoxInput label="Quận" value={district} onChange={() => {}} />
    </>
  );
}

export default AddressDetail;