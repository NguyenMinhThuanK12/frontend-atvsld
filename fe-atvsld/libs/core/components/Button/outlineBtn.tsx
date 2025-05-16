import { Button } from "@mui/material";

interface OutlineBtnProps {
  content: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

const OutlineButton: React.FC<OutlineBtnProps> = ({
  content,
  type = "button",
  onClick,
}) => {
  return (
    <Button
      variant="outlined"
      type={type}
      onClick={onClick}
      sx={{
        textTransform: "none",
        padding: "6px 16px",
        borderRadius: "10px",
        fontSize: "16px",
        backgroundColor: "#ffffff",
        color: "#2962FF",
        border: "1px solid #2962FF",
          width: "100%",
        fontWeight: 600,
        ":hover": {
          opacity: 0.8,
        },
      }}
    >
      {content}
    </Button>
  );
};

export default OutlineButton;
