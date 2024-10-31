import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

export function Username({ value, onChange }) {
  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="standard-basic"
        label="usuario"
        type="email"
        value={value}
        onChange={onChange}
        className="bg-purple-50"
        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
      />
    </Box>
  );
}

export function Password({ value, onChange }) {
  return (
    <Box
      sx={{
        "& > :not(style)": { m: 1, width: "25ch" },
      }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="standard-basic"
        label="contraseña"
        type="password"
        value={value}
        onChange={onChange}
        className="bg-purple-50"
      />
    </Box>
  );
}