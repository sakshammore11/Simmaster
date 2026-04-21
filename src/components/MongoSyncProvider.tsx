"use client";

import { useMongoSync } from '@/hooks/useMongoSync';

export default function MongoSyncProvider({ children }: { children: React.ReactNode }) {
  useMongoSync();
  return <>{children}</>;
}
