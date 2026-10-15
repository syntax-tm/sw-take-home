import { Box, Typography } from "@mui/material";

export default function DetailRows({ items }: { items: [string, string][] }) {
  return (
    <Box sx={{ mt: 1, borderTop: "1px solid", borderLeft: "1px solid", borderColor: "divider" }}>
      {items.map(([label, value]) => (
        <Box
          key={label}
          sx={{
            display: "flex",
            justifyContent: "space-between",
            gap: 1.5,
            px: 1.25,
            py: 0.9,
            borderRight: "1px solid",
            borderBottom: "1px solid",
            borderColor: "divider",
          }}
        >
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{ textAlign: "right", overflowWrap: "anywhere" }}>
            {value === "unknown" ? "Unknown" : value === "n/a" ? "N/A" : value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
