import { logMethod } from "./both-methods";
// function to log information
// this function calls the method logFromClient
export const log = function (level, message) {
    logMethod.call({
        level: level,
        message: message,
    });
}

