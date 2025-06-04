import React, { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";

const RutasProtegidas = () => {
  const navigate = useNavigate();

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  return <div>{isAuthenticated() ? <Outlet /> : null}</div>;
};

export default RutasProtegidas;
