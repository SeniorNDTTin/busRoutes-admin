import IOneWayTicket from "../interfaces/oneWayTicket";
import IResponse from "../interfaces/response";

import request from "../utils/request";

const get = async () => {
  const response = (await request.get<IResponse<IOneWayTicket[]>>("/oneWayTickets/get")).data;
  return response;
}

const getById = async (id: string) => {
  const response = (await request.get<IResponse<IOneWayTicket>>(`/oneWayTickets/get/${id}`)).data;
  return response;
}

const create = async (oneWayTicket: Partial<IOneWayTicket>) => {
  const response = (await request.post<IResponse<IOneWayTicket>>("/oneWayTickets/create", oneWayTicket)).data;
  return response;
}

const update = async (id: string, oneWayTicket: Partial<IOneWayTicket>) => {
  const response = (await request.patch<IResponse<IOneWayTicket>>(`/oneWayTickets/update/${id}`, oneWayTicket)).data;
  return response;
}

const del = async (id: string) => {
  const response = (await request.del<IResponse<IOneWayTicket>>(`/oneWayTickets/delete/${id}`)).data;
  return response;
}

const oneWayTicketService = {
  get,
  getById,
  create,
  update,
  del
};
export default oneWayTicketService;