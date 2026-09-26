interface Props {
  children: React.ReactNode;
  color?: 'primary' | 'secondary' | 'danger' | 'success' | 'dark' | 'light';
  onClick: () => void;
  className?: string;
  type?: string;
}

const Button = ({ children, onClick, color='dark'}: Props) => {
  return (
    
    <button type="button" className={"btn btn-" + color} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;