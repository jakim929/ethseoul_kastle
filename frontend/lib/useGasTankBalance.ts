import axios, { AxiosResponse } from "axios";
import {
  API_getGasTankBalanceRequest,
  API_getGasTankBalanceResponse,
} from '@shared/types/API_getGasTankBalance';
import useSWR from 'swr';

const fetchGasTankBalance = async (_: string) => {
  const result = await axios.post<
    API_getGasTankBalanceRequest,
    AxiosResponse<API_getGasTankBalanceResponse>
  >("http://localhost:3001/getGasTankBalance", { walletAddress: process.env.NEXT_PUBLIC_SCW_ADDRESS })
  return result.data.gasTankBalance;
}

const useGasTankBalance = () => {
  return useSWR('http://localhost:3001/getGasTankBalance', fetchGasTankBalance);
}

export { useGasTankBalance };
