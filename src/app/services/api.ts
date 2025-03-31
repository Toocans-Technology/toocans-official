import axios from 'axios';
import { UserBalanceResponse } from '../types/token';

const BASE_URL = 'https://dev-api.bdy.tech';

const headers = {
    Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJsb2dpblR5cGUiOiJsb2dpbiIsImxvZ2luSWQiOiJhcHA6MTg5MTMwNDMwNjYyNjA4NDg2NCIsInJuU3RyIjoiWFFnZTg3MlVLQktpQ25lV0FuUVpwZ1lyUlF0T0VyZEoiLCJjbGllbnRpZCI6ImRmYTZhYTc0ZDBiYjA3ZmU0NjhhMGJmOGE0NTZjOTY2IiwidXNlcklkIjoxODkxMzA0MzA2NjI2MDg0ODY0fQ.DKPrWtECNIZi1gBgiO-TjinmqhBZ0GrDEG5KSo6b6sI'
};

export const tokenApi = {
    getAllAssets: async (): Promise<UserBalanceResponse> => {
        try {
            const response = await axios.get(`${BASE_URL}/balance/getAllAsset`, { headers });
            return response.data;
        } catch (error) {
            console.error('Error fetching tokens:', error);
            throw error;
        }
    }
};