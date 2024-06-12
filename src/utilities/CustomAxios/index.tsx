import axios, { AxiosError } from "axios";

  const customAxios = axios.create({
    baseURL : '',
  });
  
  customAxios.defaults.withCredentials = true

  export default customAxios;
  
