import axios, { AxiosRequestConfig } from "axios";
import { useCallback, useEffect, useState } from "react";

export const useGet = <ResponseData = any>(url: string) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [result, setResult] = useState<ResponseData>();

  const [error, setError] = useState<string>();

  const get = useCallback(
    (params?: AxiosRequestConfig["params"]) => {
      setIsLoading(true);
      setError(undefined);
      setResult(undefined);
      return axios
        .get<ResponseData>(url, { params })
        .then((response) => {
          setResult(response.data);
          setError(undefined);
        })
        .catch((e) => {
          setResult(undefined);
          setError(e.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [url]
  );

  useEffect(() => {
    return () => {
      setIsLoading(false);
      setError(undefined);
      setResult(undefined);
    };
  }, []);

  return { get, isLoading, error, result };
};
