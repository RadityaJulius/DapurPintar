"use client";
    
import { useRouter } from "next/router";

export function useNavigation() {
    const router = useRouter();

    return {
        goToDashboard: () => router.push("/dashboard"),
        goToLogin: () => router.push("/login"),
        goToRegister: () => router.push("/register"),
    };
}