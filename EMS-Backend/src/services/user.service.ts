import { injectable } from "inversify";
import { IuserModel } from "../interfaces";
import { userModel } from "../models";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';

@injectable()
export class userService{
    async login(bodyData: any):Promise<Object>{
        const founduser = await userModel.findOne({email : bodyData.email});
        if(founduser){
            const checkPswd = await bcrypt.compare(bodyData.password, founduser.password);
            if(checkPswd){
                const data = {
                    userId: founduser._id,
                    email : founduser.email
                }

                const token = jwt.sign(data, config.get('SECRETE_KEY')) as string;
                await userModel.findOneAndUpdate({_id: founduser._id}, {$set :{token : token}});

                return {status: true, message: 'user loggedin!', token : token, userId: founduser._id};
            }else{
                return {status: false, message : 'invalid credentials!'};
            }
        }else{
            return {status: false, message : 'user not found, please signup!'}
        }
    }

    async logout(id: string):Promise<Object>{
        await userModel.findOneAndUpdate({_id:id},{$unset : {token :{$exists : true}}});
        return {status: true, message: 'user logout!'};
    }

    async signup(bodyData: IuserModel):Promise<Object>{
        await userModel.create(bodyData);
        return {status: true, message: 'user signuped!'};
    }
}