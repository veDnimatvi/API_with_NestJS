"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
exports.UserSchema = new typeorm_1.EntitySchema({
    name: 'User',
    target: user_entity_1.User,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String,
        },
        email: {
            type: String,
        },
        number: {
            type: String,
        },
        password: {
            type: String,
        },
        codeReset: {
            type: String,
        },
        role: {
            type: String,
        },
        valid: {
            type: Boolean,
            default: false,
        },
    },
});
//# sourceMappingURL=user.schema.js.map