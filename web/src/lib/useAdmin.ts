
// web/src/lib/useAdmin.ts
import useSWR from 'swr';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/lib/firebase';

interface Settings {
  litApiKey: string;
  litAuthSig: string;
  solRpcUrl: string;
  electrumHosts: string;
  minConfirmations: number;
  pepTxFee: number;
  maintenanceMode: boolean;
  reserveThreshold: number;
  alertEmail: string;
}

const functions = getFunctions(app);

const fetcher = async (methodName: string) => {
  const callable = httpsCallable(functions, methodName);
  const result = await callable();
  return result.data;
};

export const useSettings = () => {
  const { data, error, mutate } = useSWR<Settings>('getSettings', fetcher);

  return {
    settings: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};

export const saveSettings = async (payload: Settings) => {
  const callable = httpsCallable(functions, 'setSettings');
  try {
    await callable(payload);
    // Optimistically update the settings
    return { success: true };
  } catch (error: any) {
    console.error("Error saving settings:", error);
    return { success: false, error: error.message };
  }
};

export const callOp = async (methodName: string, data: any) => {
  const callable = httpsCallable(functions, methodName);
  try {
    const result = await callable(data);
    return { success: true, data: result.data };
  } catch (error: any) {
    console.error(`Error calling ${methodName}:`, error);
    return { success: false, error: error.message };
  }
};
