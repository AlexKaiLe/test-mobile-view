import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  Container,
} from "@mui/material";
import { Send as SendIcon } from "@mui/icons-material";

class ChatApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [
        { id: 1, text: "Hello! This is a sample message.", sender: "other" },
        {
          id: 2,
          text: "This is how the chat looks with proper keyboard handling.",
          sender: "me",
        },
        {
          id: 3,
          text: "The input stays at the bottom and content adjusts properly.",
          sender: "other",
        },
      ],
      inputValue: "",
      viewportHeight: window.innerHeight,
      keyboardVisible: false,
    };

    this.messagesEndRef = React.createRef();
    this.inputRef = React.createRef();
  }

  componentDidMount() {
    // Handle viewport changes for mobile keyboard
    this.handleViewportChange();
    window.addEventListener("resize", this.handleViewportChange);

    // Prevent body scroll on mobile
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.height = "100%";

    // Handle iOS keyboard specifically
    if (this.isIOS()) {
      window.addEventListener("focusin", this.handleFocusIn);
      window.addEventListener("focusout", this.handleFocusOut);
    }
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleViewportChange);
    document.body.style.overflow = "";
    document.body.style.position = "";
    document.body.style.width = "";
    document.body.style.height = "";

    if (this.isIOS()) {
      window.removeEventListener("focusin", this.handleFocusIn);
      window.removeEventListener("focusout", this.handleFocusOut);
    }
  }

  isIOS = () => {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  };

  handleViewportChange = () => {
    const currentHeight = window.innerHeight;
    const initialHeight = this.state.viewportHeight;

    // Detect keyboard presence by viewport height change
    const heightDiff = initialHeight - currentHeight;
    const keyboardVisible = heightDiff > 150; // threshold for keyboard detection

    this.setState({
      viewportHeight: currentHeight,
      keyboardVisible,
    });
  };

  handleFocusIn = () => {
    setTimeout(() => {
      this.scrollToBottom();
    }, 300);
  };

  handleFocusOut = () => {
    this.setState({ keyboardVisible: false });
  };

  scrollToBottom = () => {
    if (this.messagesEndRef.current) {
      this.messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  };

  handleSendMessage = () => {
    if (this.state.inputValue.trim()) {
      const newMessage = {
        id: Date.now(),
        text: this.state.inputValue,
        sender: "me",
      };

      this.setState(
        {
          messages: [...this.state.messages, newMessage],
          inputValue: "",
        },
        () => {
          setTimeout(this.scrollToBottom, 100);
        }
      );
    }
  };

  handleInputChange = (e) => {
    this.setState({ inputValue: e.target.value });
  };

  handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      this.handleSendMessage();
    }
  };

  render() {
    const { messages, inputValue, viewportHeight, keyboardVisible } =
      this.state;

    return (
      <Box
        sx={{
          height: "100vh",
          maxHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          bgcolor: "#f5f5f5",
          position: "relative",
        }}
      >
        {/* Header */}
        <Paper
          elevation={1}
          sx={{
            p: 2,
            bgcolor: "primary.main",
            color: "white",
            flexShrink: 0,
          }}
        >
          <Typography variant="h6" align="center">
            Chat App
          </Typography>
        </Paper>

        {/* Messages Container */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0, // Important for flex scroll
            // Adjust height based on keyboard presence
            height: keyboardVisible ? `${viewportHeight - 120}px` : "auto",
          }}
        >
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.sender === "me" ? "flex-end" : "flex-start",
                mb: 1,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  maxWidth: "70%",
                  bgcolor: message.sender === "me" ? "primary.main" : "white",
                  color: message.sender === "me" ? "white" : "text.primary",
                  borderRadius:
                    message.sender === "me"
                      ? "20px 20px 4px 20px"
                      : "20px 20px 20px 4px",
                }}
              >
                <Typography variant="body1">{message.text}</Typography>
              </Paper>
            </Box>
          ))}
          <div ref={this.messagesEndRef} />
        </Box>

        {/* Input Container */}
        <Paper
          elevation={3}
          sx={{
            p: 2,
            bgcolor: "white",
            flexShrink: 0,
            position: "sticky",
            bottom: 0,
            left: 0,
            right: 0,
            // Prevent the input from being pushed off screen
            zIndex: 1000,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              gap: 1,
            }}
          >
            <TextField
              ref={this.inputRef}
              fullWidth
              multiline
              maxRows={4}
              placeholder="Type a message..."
              value={inputValue}
              onChange={this.handleInputChange}
              onKeyPress={this.handleKeyPress}
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "20px",
                  bgcolor: "#f8f8f8",
                },
              }}
              // Prevent zoom on iOS
              inputProps={{
                style: { fontSize: "16px" },
              }}
            />
            {/* <IconButton
              color="primary"
              onClick={this.handleSendMessage}
              disabled={!inputValue.trim()}
              sx={{
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
                "&.Mui-disabled": {
                  bgcolor: "#ccc",
                },
              }}
            >
              <SendIcon />
            </IconButton> */}
          </Box>
        </Paper>
      </Box>
    );
  }
}

export default ChatApp;
