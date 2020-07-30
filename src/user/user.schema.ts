import * as Mongoose from 'mongoose'

export const UserSchema = new Mongoose.Schema({
    username: String,
    email: String,
    phone: String,
    password: String,
    isActive: Boolean,
    created_at: { type: Date, default: Date.now }
})