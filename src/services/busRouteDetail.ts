import IBusRouteDetail from "../interfaces/busRouteDetail";
import IResponse from "../interfaces/response";

import request from "../utils/request";

const get = async () => {
  const response = (await request.get<IResponse<IBusRouteDetail[]>>("/busRouteDetails/get")).data;
  return response;
}

const getById = async (id: string) => {
  const response = (await request.get<IResponse<IBusRouteDetail>>(`/busRouteDetails/get/${id}`)).data;
  return response;
}

const getByRouteId = async (id: string) => {
  const response = (await request.get<IResponse<IBusRouteDetail[]>>(`/busRouteDetails/getRoute/${id}`)).data;
  return response;
}

const create = async (busRoute: Partial<IBusRouteDetail>) => {
  const response = (await request.post<IResponse<IBusRouteDetail>>("/busRouteDetails/create", busRoute)).data;
  return response;
}

const update = async (id: string, busRoute: Partial<IBusRouteDetail>) => {
  const response = (await request.patch<IResponse<IBusRouteDetail>>(`/busRouteDetails/update/${id}`, busRoute)).data;
  return response;
}

const del = async (id: string) => {
  const response = (await request.del<IResponse<IBusRouteDetail>>(`/busRouteDetails/delete/${id}`)).data;
  return response;
}

const busRouteDetailService = {
  get,
  getById,
  getByRouteId,
  create,
  update,
  del
};
export default busRouteDetailService;