import { AuthResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE

export const authApi = {
  register: async (username: string, email: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      })

      if (response.status === 201) {
        return await response.json()
      } else {
        const errorData = await response.text()
        throw new Error(errorData || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      throw error
    }
  },

  login: async (emailOrUsername: string, password: string): Promise<AuthResponse> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_or_username: emailOrUsername,
          password,
        }),
      })

      const data = await response.json()

      if (response.status === 200) {
        return data
      } else {
        console.error("Login failed with status:", response.status, data)
        throw new Error(data.detail || "Login failed")
      }
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  },
}
