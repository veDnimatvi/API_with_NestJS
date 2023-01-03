import { Model } from 'sequelize-typescript';
export declare class User extends Model {
    name: string;
    email: string;
    number: string;
    password: string;
    codeReset: number;
    role: string;
    valid: boolean;
}
