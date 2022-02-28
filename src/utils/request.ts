import axios, { AxiosRequestHeaders } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from './constants';

// HTTP request methods
export enum Method {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
}

// Request helper function that reads the token from AsyncStorage and appends it to the request.
export const request = async <T>(method: Method, path: string, data?: unknown, extraHeaders?: AxiosRequestHeaders) => {
  const token = await AsyncStorage.getItem('token');
  const authHeader: AxiosRequestHeaders = token ? { 'x-access-token': token } : {};
  const headers = { ...authHeader, ...extraHeaders };
  const response = await axios.request<T>({ method, url: baseUrl + path, headers, data });
  return response.data;
};
