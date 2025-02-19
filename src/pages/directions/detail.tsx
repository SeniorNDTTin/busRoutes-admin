import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import GoBack from "../../components/goBack";
import BoxHead from "../../components/boxHead";
import BoxInput from "../../components/boxInput";

import directionService from "../../services/direction.service";

function DirectionDetail() {
  const { id } = useParams();

  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchApi = async () => {
      const direction = (await directionService.getById(id as string)).data;

      setDescription(direction.description);
    };
    fetchApi();
  }, [id]);

  return (
    <>
      <GoBack />

      <BoxHead title="Chi Tiết Tuyến Đường" />

      <BoxInput label="Mô tả" value={description} onChange={() => {}} />
    </>
  );
}

export default DirectionDetail;
