"use client";

import { useState } from "react";
import {
  Button,
  Group,
  Textarea,
  Stack,
  Title,
  Container,
  Paper,
  ColorSwatch,
  Divider,
  BackgroundImage,
} from "@mantine/core";

const textColors = [
  "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF",
  "#00FFFF", "#FFFFFF", "#000000", "#FFA500", "#800080",
];

const backgroundColors = [
  "#000000", "#1E1E1E", "#2E2E2E", "#3E3E3E", "#4E4E4E",
  "#5E5E5E", "#6E6E6E", "#7E7E7E", "#8E8E8E", "#9E9E9E",
];

interface StyledSegment {
  text: string;
  color?: string;
  backgroundColor?: string;
  bold?: boolean;
  underline?: boolean;
}

export default function Home() {
  const [segments, setSegments] = useState<StyledSegment[]>([
    { text: "Welcome to the Discord Text Generator!" },
  ]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSegments([{ text: e.target.value }]);
  };

  const handleTextSelection = () => {
    const textarea = document.getElementById("text-area") as HTMLTextAreaElement;
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    if (selectionStart === selectionEnd) {
      setSelectedIndex(null); // No text selected
      return;
    }

    const plainText = segments.map((seg) => seg.text).join("");
    const before = plainText.slice(0, selectionStart);
    const selected = plainText.slice(selectionStart, selectionEnd);
    const after = plainText.slice(selectionEnd);

    const newSegments: StyledSegment[] = [];
    if (before) newSegments.push({ text: before });
    if (selected) newSegments.push({ text: selected });
    if (after) newSegments.push({ text: after });

    setSegments(newSegments);
    setSelectedIndex(newSegments.findIndex((seg) => seg.text === selected));
  };

  const applyStyle = (color: string, isBackground: boolean = false) => {
    if (selectedIndex === null) return;

    const updatedSegments = [...segments];
    const selectedSegment = updatedSegments[selectedIndex];

    if (isBackground) {
      selectedSegment.backgroundColor = color;
    } else {
      selectedSegment.color = color;
    }

    setSegments(updatedSegments);
  };

  const toggleBold = () => {
    if (selectedIndex === null) return;

    const updatedSegments = [...segments];
    const selectedSegment = updatedSegments[selectedIndex];
    selectedSegment.bold = !selectedSegment.bold;

    setSegments(updatedSegments);
  };

  const toggleUnderline = () => {
    if (selectedIndex === null) return;

    const updatedSegments = [...segments];
    const selectedSegment = updatedSegments[selectedIndex];
    selectedSegment.underline = !selectedSegment.underline;

    setSegments(updatedSegments);
  };

  const resetStyles = () => {
    if (selectedIndex === null) return;

    const updatedSegments = [...segments];
    const selectedSegment = updatedSegments[selectedIndex];
    selectedSegment.color = undefined;
    selectedSegment.backgroundColor = undefined;
    selectedSegment.bold = false;
    selectedSegment.underline = false;

    setSegments(updatedSegments);
  };

  const copyToClipboard = () => {
    const discordFormattedText = segments
      .map((segment) => {
        const colorCode = segment.color ? `\`${segment.color}\`` : "";
        const bgColorCode = segment.backgroundColor
          ? `\`${segment.backgroundColor}\``
          : "";
        const boldCode = segment.bold ? "**" : "";
        const underlineCode = segment.underline ? "__" : "";
        return `${boldCode}${underlineCode}${colorCode}${bgColorCode}${segment.text}${underlineCode}${boldCode}`;
      })
      .join("");
    navigator.clipboard.writeText(discordFormattedText);
    alert("Copied to clipboard!");
  };

  return (
    <BackgroundImage
      src="/bg.jpeg"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Container size="sm" style={{ padding: "20px" }}>
        <Paper
          shadow="lg"
          radius="md"
          p="xl"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Title order={1} align="center" style={{ marginBottom: "20px" }}>
            Discord Text Generator
          </Title>
          <Textarea
            id="text-area"
            value={segments.map((seg) => seg.text).join("")}
            onChange={handleTextChange}
            onSelect={handleTextSelection}
            autosize
            minRows={4}
            placeholder="Type your text here..."
            style={{ marginBottom: "20px" }}
          />
          <Paper
            shadow="xs"
            radius="md"
            p="md"
            style={{
              border: "1px solid #ccc",
              minHeight: "100px",
              marginBottom: "20px",
              backgroundColor: "#1E1E1E",
              color: "#FFFFFF",
              whiteSpace: "pre-wrap",
            }}
          >
            {segments.map((segment, index) => (
              <span
                key={index}
                style={{
                  color: segment.color || "inherit",
                  backgroundColor: segment.backgroundColor || "inherit",
                  fontWeight: segment.bold ? "bold" : "normal",
                  textDecoration: segment.underline ? "underline" : "none",
                }}
              >
                {segment.text}
              </span>
            ))}
          </Paper>
          <Divider my="sm" />
          <Group spacing="xs" style={{ marginBottom: "20px" }}>
            <Button onClick={resetStyles} variant="outline">
              Reset
            </Button>
            <Button onClick={toggleBold} variant="outline">
              Bold
            </Button>
            <Button onClick={toggleUnderline} variant="outline">
              Underline
            </Button>
          </Group>
          <Stack spacing="lg">
            <div>
              <Title order={3} style={{ marginBottom: "10px" }}>
                Text Color:
              </Title>
              <Group spacing="xs">
                {textColors.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    onClick={() => applyStyle(color)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Group>
            </div>
            <div>
              <Title order={3} style={{ marginBottom: "10px" }}>
                Background Color:
              </Title>
              <Group spacing="xs">
                {backgroundColors.map((color) => (
                  <ColorSwatch
                    key={color}
                    color={color}
                    onClick={() => applyStyle(color, true)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </Group>
            </div>
          </Stack>
          <Button
            style={{ marginTop: "20px" }}
            onClick={copyToClipboard}
            variant="gradient"
            gradient={{ from: "indigo", to: "cyan" }}
            fullWidth
          >
            Copy as Discord Formatted Text
          </Button>
        </Paper>
      </Container>
    </BackgroundImage>
  );
}
