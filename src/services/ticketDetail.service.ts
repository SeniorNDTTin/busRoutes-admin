import ITicketDetail from "../interfaces/ticketDetail";
import IResponse from "../interfaces/response";

import request from "../utils/request";

const get = async () => {
  const response = (await request.get<IResponse<ITicketDetail[]>>("/ticketDetails/get")).data;
  return response;
}

const getById = async (id: string) => {
  const response = (await request.get<IResponse<ITicketDetail>>(`/ticketDetails/get/${id}`)).data;
  return response;
}

const create = async (ticketDetail: Partial<ITicketDetail>) => {
  const response = (await request.post<IResponse<ITicketDetail>>("/ticketDetails/create", ticketDetail)).data;
  return response;
}

const update = async (id: string, ticketDetail: Partial<ITicketDetail>) => {
  const response = (await request.patch<IResponse<ITicketDetail>>(`/ticketDetails/update/${id}`, ticketDetail)).data;
  return response;
}

const del = async (id: string) => {
  const response = (await request.del<IResponse<ITicketDetail>>(`/ticketDetails/delete/${id}`)).data;
  return response;
}

const findByOneWayTicketId = async (oneWayTicketId: string) => {
  const response = (await request.get<IResponse<ITicketDetail>>(`/ticketDetails/oneWayTicket/${oneWayTicketId}`)).data;
  return response;
}

const ticketDetailService = {
  get,
  getById,
  create,
  update,
  del,
  findByOneWayTicketId
};
export default ticketDetailService;