import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Button,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material";

const WhenToMeet = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const hours = Array.from({ length: 18 }, (_, i) => i + 5);

  const [selectedSlots, setSelectedSlots] = useState(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const dragMode = useRef("select");

  const getSlotId = (day, hour) => `${day}-${hour}`;

  const formatTime = (hour) => {
    const period = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:00 ${period}`;
  };

  const dragStartRef = useRef(null);

  const handleMouseDown = (day, hour) => {
    const slotId = getSlotId(day, hour);
    setIsDragging(true);
    dragMode.current = selectedSlots.has(slotId) ? "deselect" : "select";
    dragStartRef.current = { day, hour };
    updateSlots(dragStartRef.current, { day, hour });
  };

  const handleMouseEnter = (day, hour) => {
    if (!isDragging || !dragStartRef.current) return;
    updateSlots(dragStartRef.current, { day, hour });
  };

  const handleClick = (day, hour) => {
    const slotId = getSlotId(day, hour);
    const newSet = new Set(selectedSlots);
    if (newSet.has(slotId)) {
      newSet.delete(slotId);
    } else {
      newSet.add(slotId);
    }
    setSelectedSlots(newSet);
  };

  const updateSlots = (start, end) => {
    const dayMin = Math.min(start.day, end.day);
    const dayMax = Math.max(start.day, end.day);
    const hourMin = Math.min(start.hour, end.hour);
    const hourMax = Math.max(start.hour, end.hour);

    const newSet = new Set(selectedSlots);
    for (let d = dayMin; d <= dayMax; d++) {
      for (let h = hourMin; h <= hourMax; h++) {
        const slotId = getSlotId(d, h);
        dragMode.current === "select"
          ? newSet.add(slotId)
          : newSet.delete(slotId);
      }
    }
    setSelectedSlots(newSet);
  };

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback(
    (day, hour) => {
      handleMouseDown(day, hour);
    },
    [handleMouseDown]
  );

  const handleTouchMove = useCallback(
    (e) => {
      if (!isDragging) return;

      // Prevent only if you're actively selecting, not always
      e.preventDefault();

      const touch = e.touches[0];
      const el = document.elementFromPoint(touch.clientX, touch.clientY);
      if (el?.dataset?.day && el?.dataset?.hour) {
        handleMouseEnter(parseInt(el.dataset.day), parseInt(el.dataset.hour));
      }
    },
    [isDragging, handleMouseEnter]
  );

  const handleTouchEnd = useCallback(() => handleMouseUp(), [handleMouseUp]);

  const clearAvailability = () => setSelectedSlots(new Set());
  const getSelectedCount = () => selectedSlots.size;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper
        elevation={3}
        sx={{
          borderRadius: 2,
          flex: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
        }}
      >
        <Box
          sx={{
            overflowX: "auto",
            bgcolor: "white",
            flex: 1,
            touchAction: "auto",
          }}
          onMouseUp={handleMouseUp}
          onTouchEnd={handleTouchEnd}
          onTouchMove={(e) => {
            e.preventDefault(); // prevent vertical scroll
            handleTouchMove(e);
          }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: `${
                isMobile ? "60px" : "80px"
              } repeat(7, 1fr)`,
              gridTemplateRows: `40px repeat(${hours.length}, 1fr)`, // 1 header + 18 flexible rows
              height: "100%",
              boxSizing: "border-box",
            }}
          >
            <Box
              sx={{
                borderBottom: "2px solid #e0e0e0",
                borderRight: "1px solid #e0e0e0",
              }}
            />
            {days.map((day) => (
              <Box
                key={day}
                sx={{
                  borderBottom: "2px solid #e0e0e0",
                  borderRight: "1px solid #e0e0e0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  fontSize: isMobile ? "0.75rem" : "0.875rem",
                }}
              >
                {day}
              </Box>
            ))}

            {hours.map((hour) => (
              <React.Fragment key={hour}>
                <Box
                  sx={{
                    borderRight: "1px solid #e0e0e0",
                    borderBottom: "1px solid #e0e0e0",
                    display: "flex",
                    alignItems: "top",
                    justifyContent: "flex-end",
                    pr: 0.5,
                    textAlign: "left",
                    fontSize: isMobile ? "0.6rem" : "0.75rem",
                    height: "100%",
                    color: "#666",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    boxSizing: "border-box",
                  }}
                >
                  {formatTime(hour)}
                </Box>
                {days.map((_, dayIndex) => {
                  const slotId = getSlotId(dayIndex, hour);
                  const isSelected = selectedSlots.has(slotId);
                  return (
                    <Box
                      key={slotId}
                      data-day={dayIndex}
                      data-hour={hour}
                      sx={{
                        border: "1px solid #e0e0e0",
                        height: "100%",
                        boxSizing: "border-box",
                        fontSize: "0.75rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        userSelect: "none",
                        bgcolor: isSelected ? "primary.main" : "white",
                        color: isSelected ? "white" : "inherit",
                        transition: "background-color 0.15s ease",
                        "&:hover": {
                          bgcolor: isSelected ? "primary.dark" : "#f5f5f5",
                        },
                      }}
                      onClick={() => handleClick(dayIndex, hour)}
                      onMouseDown={() => handleMouseDown(dayIndex, hour)}
                      onMouseEnter={() => handleMouseEnter(dayIndex, hour)}
                      onTouchStart={() => handleTouchStart(dayIndex, hour)}
                    >
                      {isSelected && "✓"}
                    </Box>
                  );
                })}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default WhenToMeet;
