import { IconType } from "react-icons";
import { Button } from "./ui/button";

interface AuthSocialButtonProps {
  icon: IconType;
  onClick: () => void;
  label?: string;
}

const AuthSocialButton: React.FC<AuthSocialButtonProps> = ({
  icon: Icon,
  onClick,
  label,
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="default"
      className="w-full"
    >
      {label}&nbsp;
      <Icon />
    </Button>
  );
};

export default AuthSocialButton;
