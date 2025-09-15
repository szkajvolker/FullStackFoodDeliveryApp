import React from "react";
import { Redirect, Slot } from "expo-router";
import useAuthStore from "@/store/auth.store";

export default function TabLayout() {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Redirect href="/SignIn" />;
  return <Slot />;
}
