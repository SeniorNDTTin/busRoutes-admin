import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import districtService from "../../services/district.service";

function DistrictDetail() {
  const { id } = useParams();

  const [name, setname] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const district = (await districtService.getById(id as string)).data;

      setname(district.name);
    }
    fetchApi();
  }, [id]);

  return (
    <>
      <GoBack />

      <BoxHead title="Chi Tiết Quận/Huyện" />

      <BoxInput label="Tên" value={name} onChange={() => {}} />
    </>
  );
}

export default DistrictDetail;