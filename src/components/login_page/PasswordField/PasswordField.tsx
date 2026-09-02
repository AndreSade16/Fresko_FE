import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

interface PasswordFieldProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required: boolean;
}

function PasswordField({
  id,
  value,
  onChange,
  required = true,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="input-group border-1">
      <input
        type={visible ? "text" : "password"}
        className="form-control shadow-none border-0"
        id={id}
        placeholder="Enter password"
        value={value}
        onChange={onChange}
        required={required}
      />
      <button
        type="button"
        className="btn bg-white text-black shadow-none border-0"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? <FiEyeOff /> : <FiEye />}
      </button>
    </div>
  );
}

export default PasswordField;
