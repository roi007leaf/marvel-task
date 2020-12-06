import axios, { AxiosResponse } from 'axios';

abstract class RequestService {
  public static async get(url: string): Promise<AxiosResponse<any>> {
    return axios.get(url);
  }
}
export default RequestService;
