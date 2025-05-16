
import { Button } from "@mui/material";

interface PrimaryBtnProps {
    content: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
}

const PrimaryButton: React.FC<PrimaryBtnProps> = ({
  content,
  type = "button",
  onClick,
}) => {
  return (
    <Button
      variant="contained"
      type={type}
      onClick={onClick}
      sx={{
        textTransform: "none",
        padding: "6px 16px",
        borderRadius: "10px",
        fontSize: "16px",
        backgroundColor: "#2962FF",
        width: "100%",
        ":hover": {
          opacity: 0.8,
        },
      }}
    >
      {content}
    </Button>
  );
};

export default PrimaryButton;