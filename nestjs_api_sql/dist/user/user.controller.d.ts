import { CreateUserDto } from './dto';
import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    findAll(): Promise<import("./user.model").User[]>;
    create(user: CreateUserDto): Promise<{
        created: boolean;
    }>;
}
