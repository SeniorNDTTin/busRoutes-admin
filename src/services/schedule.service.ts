import ISchedule from "../interfaces/schedule";
import IResponse from "../interfaces/response";
import request from "../utils/request";

const get = async() => {
    const res = (await request.get<IResponse<ISchedule[] >>('/schedules/get')).data
    return res
}

const getById = async (id: string) => {
    const res = (await request.get<IResponse<ISchedule>>(`/schedules/get/${id}`)).data;
    return res;
}

const create = async (data: Partial<ISchedule>) => {
  const res = (await request.post<IResponse<ISchedule>>("/schedules/create", data)).data;
  return res;
}

const update = async (id: string, data: Partial<ISchedule>) => {
    const response = (await request.patch<IResponse<ISchedule>>(`/schedules/update/${id}`, data)).data;
    return response;
  }

const del = async (id: string) => {
    const response = (await request.del<IResponse<ISchedule>>(`/schedules/delete/${id}`)).data;
    return response;
}

const scheduleService = {get, getById , create , update, del}

export default scheduleService