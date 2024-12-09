"use client";
import { useEffect, useState } from "react";

const useDevices = () => {
  const [devices, setDevices] = useState({
    isMobile: false,
    isLaptop: false,
    isDesktop: false,
  });

  const handleResize = () => {
    const isMobile = window.innerWidth <= 900;
    const isLaptop = window.innerWidth <= 1200;
    const isDesktop = !isMobile && !isLaptop;
    setDevices({
      isMobile: isMobile,
      isLaptop: isLaptop,
      isDesktop: isDesktop,
    });
  };

  useEffect(() => {
    handleResize(); // Xác định loại thiết bị khi component được mount
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return devices;
};

export default useDevices;
