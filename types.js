const zod = require("zod");

const SignUpSchema = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string(),
});

const SignInSchema = zod.object({
    username: zod.string().email(),
    password: zod.string(),
});

const UpdateUserSchema = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional(),
});

const transferSchema = zod.object({
    to: zod.string(),
    amount: zod.number().positive()
})

module.exports = {
    SignUpSchema,
    SignInSchema,
    UpdateUserSchema,
    transferSchema
}