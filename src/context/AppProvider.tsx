"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Role = "BUYER" | "MERCHANT";

interface AppContextType {
  role: Role;
  toggleRole: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  isSidebarExpanded: boolean;
  toggleSidebar: () => void;
  currentAddress: string;
  setCurrentAddress: (addr: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("BUYER");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("user-addr");
      if (saved) return saved;
    }
    return "Thanh Đa, Bình Thạnh, TP.HCM";
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaXl = window.matchMedia("(min-width: 1280px)");
    const mediaLg = window.matchMedia("(min-width: 1024px)");

    const handleMediaChange = () => {
      const stored = localStorage.getItem("sidebar-expanded");
      if (stored !== null) {
        setIsSidebarExpanded(stored === "true");
        return;
      }

      if (mediaXl.matches) {
        setIsSidebarExpanded(true);
      } else if (mediaLg.matches) {
        setIsSidebarExpanded(false);
      }
    };

    handleMediaChange();

    mediaXl.addEventListener("change", handleMediaChange);
    mediaLg.addEventListener("change", handleMediaChange);

    return () => {
      mediaXl.removeEventListener("change", handleMediaChange);
      mediaLg.removeEventListener("change", handleMediaChange);
    };
  }, []);

  const toggleRole = () => {
    setRole((prev) => (prev === "BUYER" ? "MERCHANT" : "BUYER"));
  };
  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };
  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const newVal = !prev;
      localStorage.setItem("sidebar-expanded", String(newVal));
      return newVal;
    });
  };

  return (
    <AppContext.Provider value={{ role, toggleRole, isDarkMode, toggleDarkMode, isSidebarExpanded, toggleSidebar, currentAddress, setCurrentAddress }}>
      {children}
    </AppContext.Provider>
  );
};


export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
