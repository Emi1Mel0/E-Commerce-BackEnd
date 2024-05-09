import { appError } from "../utils/AppError.js";

export function errorCatcher(errorCatcher){
    return(req,res,next)=>{
        errorCatcher(req,res,next).catch((err)=>{
            next(new appError(err,500))
        });
    };
}