import { Optional } from 'sequelize';
import { CreateUserDto } from './dto';
import { User } from './user.model';
export declare class UserService {
    private userModel;
    constructor(userModel: typeof User);
    create(user: Optional<CreateUserDto, keyof CreateUserDto>): Promise<{
        created: boolean;
    }>;
    findAll(): Promise<User[]>;
}
