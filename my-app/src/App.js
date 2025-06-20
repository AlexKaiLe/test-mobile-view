import React from "react";
import { AppBar, Toolbar, Button, Box } from "@mui/material";

const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
];

function App() {
  return (
    <>
      {/* Sticky AppBar */}
      <AppBar position="sticky">
        <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
          {sections.map((section) => (
            <Button key={section.id} color="inherit" href={`#${section.id}`}>
              {section.label}
            </Button>
          ))}
        </Toolbar>
      </AppBar>

      {/* Main Layout: Left (scrollable) + Right (static map) */}
      <Box
        sx={{
          display: "flex",
          width: "100vw",
          p: 2,
          height: "calc(100dvh - 64px)",
          boxSizing: "border-box",
        }}
      >
        {/* Left side: Scrollable content */}
        <Box
          sx={{
            width: "60%",
            height: "100%",
            overflowY: "auto",
            scrollBehavior: "smooth",
            boxSizing: "border-box",
          }}
        >
          {sections.map((section) => (
            <Box
              key={section.id}
              id={section.id}
              sx={{
                height: "100dvh",
                backgroundColor: getSectionColor(section.id),
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                fontSize: "2rem",
                color: "white",
              }}
            >
              {section.label} Section
              <Box
                sx={{
                  width: "100%",
                  height: "200px",
                  p: 2,
                  backgroundColor: "black",
                  boxSizing: "border-box",
                }}
              ></Box>
            </Box>
          ))}
        </Box>

        {/* Right side: Static Map Box */}
        <Box
          sx={{
            width: "40%",
            backgroundColor: "#eee",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderLeft: "1px solid #ccc",
            position: "sticky",
            top: "64px",
            height: "100%",
            boxSizing: "border-box",
          }}
        >
          <Box
            sx={{
              width: "90%",
              height: "90%",
              backgroundColor: "#ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              color: "#333",
            }}
          >
            Static Map Box
          </Box>
        </Box>
      </Box>
    </>
  );
}

function getSectionColor(id) {
  const colors = {
    home: "#1976d2",
    about: "#388e3c",
    services: "#f57c00",
    contact: "#6a1b9a",
  };
  return colors[id] || "#333";
}

export default App;
