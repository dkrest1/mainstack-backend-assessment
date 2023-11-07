import { USERS } from "@/global.types"
export interface LoginResponse {
    user:  USERS,
    access_token: string
}