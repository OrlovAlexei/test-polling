import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { generateLinks, checkLinksGenetarionStatus } from "./api";

export const enum LinksGenerationStatus {
  NEW = "NEW",
  PROCESSING = "PROCESSING",
  READY = "READY",
}

export function Channel() {
  const [startPolling, setPolling] = useState(false);

  const { isSuccess, mutateAsync } = useMutation({
    mutationFn: generateLinks,
  });
  const { data } = useQuery({
    enabled: startPolling,
    queryFn: async () => {
      return await checkLinksGenetarionStatus();
    },
    onSuccess: (data) => {
      if (data.status === LinksGenerationStatus.READY) {
        setPolling(false);
      }
    },
    refetchInterval: 1000,
  });

  const generating = isSuccess && startPolling;
  const generatingSuccess = isSuccess && !startPolling && data;

  if (generating) {
    return <span>Генерация ссылок...</span>;
  }

  if (generatingSuccess) {
    return <span>Ссылок сгенерировано: {data?.count}</span>;
  }

  return (
    <button onClick={() => mutateAsync().then(() => setPolling(true))}>
      Сгенерировать ссылки
    </button>
  );
}
