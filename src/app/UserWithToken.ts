import {Users} from './Users';

export class UserWithToken {

    constructor(public user:Users,
        public token:string){}
    
    
}