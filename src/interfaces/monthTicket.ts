import IBase from "./base";

interface IMonthTicket extends IBase {
    registerDate: string;
    expiredDate: string;
    expired: boolean;
    customerId: string;
};

export default IMonthTicket;