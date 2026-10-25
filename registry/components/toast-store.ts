"use client";

import type { ReactNode } from "react";

export type ToastVariant = "neutral" | "info" | "success" | "warning" | "error";

export interface ToastOptions {
  description?: string;
  variant?: ToastVariant;
  duration?: number;
  action?: ReactNode;
}

interface Notification extends ToastOptions {
  id: number;
  message: string;
}

const empty: readonly Notification[] = [];
let notifications = empty;
let nextId = 0;
const listeners = new Set<() => void>();

function publish(next: readonly Notification[]) {
  notifications = next;
  listeners.forEach(listener => listener());
}

function show(message: string, options: ToastOptions = {}) {
  const id = ++nextId;
  publish([{ ...options, id, message }, ...notifications].slice(0, 3));
  return id;
}

export const toast = Object.assign(show, {
  neutral: (message: string, options?: ToastOptions) => show(message, { ...options, variant: "neutral" }),
  info: (message: string, options?: ToastOptions) => show(message, { ...options, variant: "info" }),
  success: (message: string, options?: ToastOptions) => show(message, { ...options, variant: "success" }),
  warning: (message: string, options?: ToastOptions) => show(message, { ...options, variant: "warning" }),
  error: (message: string, options?: ToastOptions) => show(message, { ...options, variant: "error" }),
  dismiss: (id?: number) => publish(id === undefined ? empty : notifications.filter(item => item.id !== id)),
});

export const toastStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => { listeners.delete(listener); };
  },
  getSnapshot: () => notifications,
  getServerSnapshot: () => empty,
};
