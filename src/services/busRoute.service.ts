import IBusRoute from "../interfaces/busRoute";
import IResponse from "../interfaces/response";

import request from "../utils/request";

const get = async () => {
  const response = (await request.get<IResponse<IBusRoute[]>>("/busRoutes/get")).data;
  return response;
}

const getById = async (id: string) => {
  const response = (await request.get<IResponse<IBusRoute>>(`/busRoutes/get/${id}`)).data;
  return response;
}

const create = async (busRoute: Partial<IBusRoute>) => {
  const response = (await request.post<IResponse<IBusRoute>>("/busRoutes/create", busRoute)).data;
  return response;
}

const update = async (id: string, busRoute: Partial<IBusRoute>) => {
  const response = (await request.patch<IResponse<IBusRoute>>(`/busRoutes/update/${id}`, busRoute)).data;
  return response;
}

const del = async (id: string) => {
  const response = (await request.del<IResponse<IBusRoute>>(`/busRoutes/delete/${id}`)).data;
  return response;
}

const busRouteService = {
  get,
  getById,
  create,
  update,
  del
};
export default busRouteService;