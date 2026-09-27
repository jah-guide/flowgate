"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  approveRequest as approveInStore,
  createRequest as createInStore,
  getRequest,
  initialRequests,
  listRequests,
  rejectRequest as rejectInStore,
  triageRequest as triageInStore,
} from "./store";
import type { CreateRequestInput, ServiceRequest } from "./types";

const STORAGE_KEY = "flowgate-demo-requests";

type FlowgateContextValue = {
  ready: boolean;
  listRequests: () => ServiceRequest[];
  getRequest: (id: string) => ServiceRequest | undefined;
  createRequest: (input: CreateRequestInput) => ServiceRequest;
  triageRequest: (id: string, note?: string) => void;
  approveRequest: (id: string, actor: string, note?: string) => void;
  rejectRequest: (id: string, actor: string, note?: string) => void;
  resetDemoData: () => void;
};

const FlowgateContext = createContext<FlowgateContextValue | null>(null);

export function FlowgateProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<ServiceRequest[]>(() => initialRequests());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setRequests(JSON.parse(raw) as ServiceRequest[]);
      }
    } catch {
      /* keep seed */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests, ready]);

  const createRequest = useCallback(
    (input: CreateRequestInput) => {
      const result = createInStore(requests, input);
      setRequests(result.store);
      return result.request;
    },
    [requests],
  );

  const triageRequest = useCallback((id: string, note?: string) => {
    setRequests((prev) => triageInStore(prev, id, note));
  }, []);

  const approveRequest = useCallback((id: string, actor: string, note?: string) => {
    setRequests((prev) => approveInStore(prev, id, actor, note));
  }, []);

  const rejectRequest = useCallback((id: string, actor: string, note?: string) => {
    setRequests((prev) => rejectInStore(prev, id, actor, note));
  }, []);

  const resetDemoData = useCallback(() => {
    setRequests(initialRequests());
  }, []);

  const value = useMemo<FlowgateContextValue>(
    () => ({
      ready,
      listRequests: () => listRequests(requests),
      getRequest: (id: string) => getRequest(requests, id),
      createRequest,
      triageRequest,
      approveRequest,
      rejectRequest,
      resetDemoData,
    }),
    [
      ready,
      requests,
      createRequest,
      triageRequest,
      approveRequest,
      rejectRequest,
      resetDemoData,
    ],
  );

  return <FlowgateContext.Provider value={value}>{children}</FlowgateContext.Provider>;
}

export function useFlowgate(): FlowgateContextValue {
  const ctx = useContext(FlowgateContext);
  if (!ctx) {
    throw new Error("useFlowgate must be used within FlowgateProvider");
  }
  return ctx;
}
