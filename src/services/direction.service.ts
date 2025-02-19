import IDirection from "../interfaces/direction";
import IResponse from "../interfaces/response";

import request from "../utils/request";

const get = async () => {
  const response = (await request.get<IResponse<IDirection[]>>("/directions/get")).data;
  return response;
};

const getById = async (id: string) => {
  const response = (await request.get<IResponse<IDirection>>(`/directions/get/${id}`)).data;
  return response;
};

const create = async (direction: Partial<IDirection>) => {
  const response = (await request.post<IResponse<IDirection>>("/directions/create", direction)).data;
  return response;
};

const update = async (id: string, direction: Partial<IDirection>) => {
  const response = (await request.patch<IResponse<IDirection>>(`/directions/update/${id}`, direction)).data;
  return response;
};

const del = async (id: string) => {
  const response = (await request.del<IResponse<IDirection>>(`/directions/delete/${id}`)).data;
  return response;
};

const directionService = {
  get,
  getById,
  create,
  update,
  del
};

export default directionService;
