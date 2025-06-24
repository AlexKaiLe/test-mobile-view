// import React, { useState, useEffect } from "react";
// import {
//   AppBar,
//   Toolbar,
//   Button,
//   Box,
//   TextField,
//   Typography,
// } from "@mui/material";

// const sections = [
//   { id: "home", label: "Home" },
//   { id: "about", label: "About" },
//   { id: "services", label: "Services" },
//   { id: "contact", label: "Contact" },
// ];

// function getSectionColor(id) {
//   const colors = {
//     home: "#1976d2",
//     about: "#388e3c",
//     services: "#f57c00",
//     contact: "#6a1b9a",
//   };
//   return colors[id] || "#333";
// }

// // 🔧 Custom hook to track safe viewport height (handles mobile keyboard)
// function useViewportHeight() {
//   const [height, setHeight] = useState(window.innerHeight);

//   useEffect(() => {
//     const handleResize = () => {
//       setHeight(window.innerHeight);
//     };

//     window.addEventListener("resize", handleResize);
//     window.addEventListener("orientationchange", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       window.removeEventListener("orientationchange", handleResize);
//     };
//   }, []);

//   return height;
// }

// export default function App() {
//   const [chatOpen, setChatOpen] = useState(false);
//   const [chatInput, setChatInput] = useState("");
//   const viewportHeight = useViewportHeight();

//   // AppBar height is assumed 64px
//   const contentHeight = viewportHeight - 64;

//   return (
//     <>
//       <AppBar position="sticky">
//         <Toolbar sx={{ justifyContent: "center", gap: 2 }}>
//           {sections.map((section) => (
//             <Button key={section.id} color="inherit" href={`#${section.id}`}>
//               {section.label}
//             </Button>
//           ))}
//         </Toolbar>
//       </AppBar>

//       <Box
//         sx={{
//           height: "calc(100dvh - 64px)",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {!chatOpen ? (
//           <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
//             {/* Left scrollable sections */}
//             <Box
//               sx={{
//                 width: "60%",
//                 height: "100%",
//                 overflowY: "auto",
//                 scrollBehavior: "smooth",
//               }}
//             >
//               {sections.map((section) => (
//                 <Box
//                   key={section.id}
//                   id={section.id}
//                   sx={{
//                     minHeight: "100%",
//                     backgroundColor: getSectionColor(section.id),
//                     display: "flex",
//                     flexDirection: "column",
//                     justifyContent: "center",
//                     alignItems: "center",
//                     fontSize: "2rem",
//                     color: "white",
//                     p: 2,
//                     boxSizing: "border-box",
//                   }}
//                 >
//                   {section.label} Alex
//                   <Box
//                     sx={{
//                       width: "100%",
//                       height: 200,
//                       backgroundColor: "black",
//                       mt: 2,
//                     }}
//                   />
//                 </Box>
//               ))}
//             </Box>

//             {/* Right static map */}
//             <Box
//               sx={{
//                 width: "40%",
//                 backgroundColor: "#eee",
//                 borderLeft: "1px solid #ccc",
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: "90%",
//                   height: "90%",
//                   backgroundColor: "#ccc",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   fontSize: "1.5rem",
//                   color: "#333",
//                 }}
//               >
//                 Static Map Box
//               </Box>
//             </Box>
//           </Box>
//         ) : (
//           <Box
//             sx={{
//               height: "100%",
//               display: "flex",
//               flexDirection: "column",
//               position: "relative",
//               p: 1,
//               overflow: "hidden",
//               boxSizing: "border-box",
//             }}
//           >
//             <Box>
//               <Button onClick={() => setChatOpen(false)}>close</Button>
//             </Box>

//             {/* Chat conversation area */}
//             <Box
//               sx={{
//                 flex: 1,
//                 overflowY: "auto",
//                 mb: 2,
//                 border: "1px solid #ccc",
//                 borderRadius: 1,
//                 p: 1,
//                 bgcolor: "#fafafa",
//               }}
//             >
//               <Typography>Chat conversation here...</Typography>
//             </Box>

//             {/* Chat input */}
//             <TextField
//               fullWidth
//               placeholder="Ask the assistant..."
//               value={chatInput}
//               onChange={(e) => setChatInput(e.target.value)}
//               autoFocus
//             />
//           </Box>
//         )}

//         {!chatOpen && (
//           <Box
//             sx={{
//               p: 1,
//               borderTop: "1px solid #ddd",
//               bgcolor: "#fafafa",
//             }}
//           >
//             <TextField
//               fullWidth
//               placeholder="Ask the assistant..."
//               value={chatInput}
//               onFocus={() => setChatOpen(true)}
//               onChange={(e) => setChatInput(e.target.value)}
//             />
//           </Box>
//         )}
//       </Box>
//     </>
//   );
// }
import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      objectSize: 200,
      initialHeight: window.innerHeight,
      keyboardVisible: false,
    };
  }

  componentDidMount() {
    this.setState({ initialHeight: window.innerHeight });
    window.addEventListener("resize", this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResize);
  }

  handleResize = () => {
    const { initialHeight } = this.state;
    const currentHeight = window.innerHeight;

    if (currentHeight < initialHeight - 100) {
      // Keyboard likely opened
      this.setState({ keyboardVisible: true, objectSize: 100 });
    } else {
      // Keyboard likely closed
      this.setState({ keyboardVisible: false, objectSize: 200 });
    }
  };

  render() {
    const { objectSize, keyboardVisible } = this.state;

    return (
      <div
        className="App"
        style={{
          height: "100dvh",
          overflow: "hidden",
          position: "relative",
          backgroundColor: "#f5f5f5",
        }}
      >
        {/* The resizable object */}
        <div
          style={{
            width: objectSize,
            height: objectSize,
            backgroundColor: "skyblue",
            margin: "20px auto",
            transition: "all 0.3s ease",
          }}
        />

        {/* Input container fixed at the bottom */}
        <div
          style={{
            position: "absolute",
            bottom: keyboardVisible ? "300px" : "0px", // simulate shift up
            left: 0,
            right: 0,
            padding: 10,
            backgroundColor: "#fff",
            borderTop: "1px solid #ccc",
            transition: "bottom 0.3s ease",
          }}
        >
          <input
            type="text"
            placeholder="Type here..."
            style={{
              width: "100%",
              padding: 12,
              fontSize: 16,
              boxSizing: "border-box",
            }}
          />
        </div>
      </div>
    );
  }
}

export default App;
