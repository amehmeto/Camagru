import { Document } from 'mongoose'

export interface User extends Document {
    readonly isActive: boolean
    readonly username: string
    readonly email: string
    readonly phone: string
    readonly password: string
    readonly created_at: Date
}
