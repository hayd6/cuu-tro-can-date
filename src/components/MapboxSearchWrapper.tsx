"use client";

import { SearchBox } from "@mapbox/search-js-react";

interface MapboxSearchWrapperProps {
  onRetrieve: (res: any) => void;
  placeholder?: string;
}

export default function MapboxSearchWrapper({ onRetrieve, placeholder }: MapboxSearchWrapperProps) {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "";

  return (
    <SearchBox
      accessToken={accessToken}
      onRetrieve={onRetrieve}
      placeholder={placeholder || "Tìm quán cứu trợ quanh bạn..."}
      theme={{
        variables: {
          fontFamily: 'var(--font-inter)',
          unit: '14px',
          borderRadius: '0px',
          colorBackground: 'transparent',
          colorText: 'var(--on-surface)',
          boxShadow: 'none',
          border: '0px',
        },
      }}
    />
  );
}
