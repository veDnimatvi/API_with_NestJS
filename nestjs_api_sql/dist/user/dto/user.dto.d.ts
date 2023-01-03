export declare class CreateUserDto {
    email: string;
    name: string;
    password: string;
    valid: boolean;
    number: string;
    codeReset: number | null;
    role: string;
}
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class SendCode {
    email: string;
}
export declare class ResetPassword {
    email: string;
    code: number;
    password: number;
}
