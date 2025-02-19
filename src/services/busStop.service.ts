import IBusStop from "../interfaces/busStop";
import IResponse from "../interfaces/response";

import request from "../utils/request";

const get = async () => {
  const response = (await request.get<IResponse<IBusStop[]>>("/busStops/get")).data;
  return response;
}

const getById = async (id: string) => {
  const response = (await request.get<IResponse<IBusStop>>(`/busStops/get/${id}`)).data;
  return response;
}

const create = async (busStop: Partial<IBusStop>) => {
  const response = (await request.post<IResponse<IBusStop>>("/busStops/create", busStop)).data;
  return response;
}

const update = async (id: string, busStop: Partial<IBusStop>) => {
  const response = (await request.patch<IResponse<IBusStop>>(`/busStops/update/${id}`, busStop)).data;
  return response;
}

const del = async (id: string) => {
  const response = (await request.del<IResponse<IBusStop>>(`/busStops/delete/${id}`)).data;
  return response;
}

const busStopService = {
  get,
  getById,
  create,
  update,
  del
};
export default busStopService;