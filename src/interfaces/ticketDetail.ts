import IBase from "./base";
import { ETicketDetailType } from "../enums/ticketDetail.enum";

interface ITicketDetail extends IBase {
    type: ETicketDetailType;
    date: string;
    ticketId: string;
    scheduleId: string;
};

export default ITicketDetail;