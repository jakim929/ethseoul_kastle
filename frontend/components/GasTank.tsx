import axios, { AxiosResponse } from "axios";
import React, { useState, useEffect } from 'react';
import {
  API_getGasTankBalanceRequest,
  API_getGasTankBalanceResponse,
} from '@shared/types/API_getGasTankBalance';
import { formatCents } from "/lib/formatCents";
import { useGasTankBalance } from "/lib/useGasTankBalance";

const GasTank = () => {
  const {
    data, error,
  } = useGasTankBalance();
  if (!data) {
    return (
      <div>
        Gas tank loading
      </div>
    )
  }
  return (
    <div>
      Gas Tank balance: {formatCents(data)}
    </div>
  );

}
export default GasTank;
