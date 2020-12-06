import axios, { AxiosResponse } from 'axios';

abstract class RequestService {
  /**
   * make get request with axios
   * @param url
   */
  public static async get(url: string): Promise<AxiosResponse<any>> {
    return axios.get(url);
  }
}
export default RequestService;
