/**
 * Web client for anolis API, only to be used with frontend
 */

import axios from "axios"

const BASE_URL = import.meta.env.SNOWPACK_PUBLIC_API_URL

enum UserRole {
    User = "user",
    Admin = "admin"
}

interface UserData {
    username: string,
    email: string,
    verified: boolean,
    role: UserRole
}

/**
 * Will log out of the service, httponly cookie will be deleted
 */
export const logout = async (): Promise<void> => {
    try {
        await axios.post(`${BASE_URL}/auth/logout`)
    } catch (error) {
        throw new Error(error.response.data)
    }
}

/**
 * Log in with password authentication, key will be stored as httponly
 * 
 * @param email email
 * @param password password
 * @returns user data
 */
export const passwordLogin = async (email: string, password: string): Promise<UserData> => {
    try {
        const res = await axios.post<UserData>(`${BASE_URL}/auth/basic`, {
            email: email,
            password: password
        })
        return res.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}

/**
 * Get data about the current user
 * 
 * @returns user data
 */
export const getUserData = async (): Promise<UserData> => {
    try {
        const res = await axios.get<UserData>(`${BASE_URL}/user/info`)
        return res.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}

/**
 * Create and log in to a new account
 * 
 * @param username username
 * @param email email
 * @param password password
 * @returns user data
 */
export const userCreate = async (username: string, email: string, password: string): Promise<UserData> => {
    try {
        const res = await axios.post<UserData>(`${BASE_URL}/user/create`, {
            username: username,
            email: email,
            password: password
        })
        return res.data
    } catch (error) {
        throw new Error(error.response.data)
    }
}