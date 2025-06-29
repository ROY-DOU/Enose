import { request } from 'umi';

const User = {
    async login(username: string, password: string): Promise<LoginResult> {
        return await request<LoginResult>('/api/user/signIn', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: { username, password },
        });
    },
    async logout() {
        return await request('/api/user/logout', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },
    async getUserInfo(): Promise<LoginResult> {
        return await request<LoginResult>('/api/user/info', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
    },
    async SignUp(Username: string,password :string): Promise<SignUp> {
        return await request<SignUp>('/api/user/signUp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            data: { Username, password },
        });
    }
}

export default User