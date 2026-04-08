import { adviceApi } from "@/services/api";
import type { AdviceSlipResponse } from "@/types/pokemon";

export async function fetchAdvice() {
  const response = await adviceApi.get<AdviceSlipResponse>("/advice", {
    headers: {
      Accept: "application/json",
      "Cache-Control": "no-cache",
    },
  });
  return response.data.slip.advice;
}
