import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { generateLinks, checkLiinksGenetarionStatus } from './api';

export const enum LinksGenerationStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  READY = 'READY',
}

type ChannelProps = {
  status: LinksGenerationStatus;
  count?: number;
};

export function Channel(props: ChannelProps) {
  const [startPolling, setPolling] = useState(false);

  const { isSuccess, mutateAsync } = useMutation({
    mutationFn: generateLinks,
  });

  const { data } = useQuery({
    enabled: startPolling,
    queryFn: async () => {
      return await checkLiinksGenetarionStatus();
    },
    onSuccess: (data) => {
      if (data.status === LinksGenerationStatus.READY) {
        setPolling(false);
      }
    },
    refetchInterval: 1000,
  });

  // console.log('isSuccess', isSuccess);

  const generating = isSuccess && startPolling;
  const generatingSuccess = isSuccess && !startPolling && data;

  if (generating) {
    return <span> Генерация ссылок...</span>;
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
