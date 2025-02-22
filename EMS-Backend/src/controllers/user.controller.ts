import 'reflect-metadata';
import { inject } from 'inversify';
import { controller, httpPost } from 'inversify-express-utils';
import { userService } from '../services/user.service';
import { Request, Response } from 'express';
import { IuserModel } from '../interfaces';

@controller('/user')
export class userController {
    constructor(@inject(userService) private userServices : userService){}

    @httpPost('/signup')
    async signup(req: Request, res: Response){
        try{
            const bodyData = req.body as IuserModel;
            res.json(await this.userServices.signup(bodyData));
        }catch(err: any){
            res.json({status : false, message : err.message})
        }
    }

    @httpPost('/login')
    async login(req: Request, res: Response){
        try{
            const bodyData = req.body;
            res.json(await this.userServices.login(bodyData));
        }catch(err: any){
            res.json({status : false, message : err.message})
        }
    }

    @httpPost('/logout')
    async logout(req: Request, res: Response){
        try{
            const id = req.headers.userId as string;
            res.json(await this.userServices.logout(id));
        }catch(err: any){
            res.json({status : false, message : err.message})
        }
    }
}