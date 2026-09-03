import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";
import PasswordField from "../../../login_page/PasswordField/PasswordField";
import "./ResetPasswordCard.css";

function ResetPasswordCard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(apiUrl + "/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      });

      if (response.ok) {
        setIsLoading(false);
        toast.success("Password reset successful! You can now log in.");
        navigate("/login");
      } else {
        const errorData = await response.json().catch(() => null);
        setIsLoading(false);
        setErrorMessage(
          errorData?.message || `Error ${response.status}: Reset failed`,
        );
      }
    } catch (error) {
      console.error("Error occurred during password reset:", error);
      setErrorMessage("Network error, please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-primary shadow-sm p-3">
      <Card.Body>
        <Card.Title className="fs-2">Reset your password</Card.Title>
        <Card.Text className="mb-4">
          Enter the code we sent you and choose a new password.
        </Card.Text>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formCode">
            <Form.Label>Verification code</Form.Label>
            <Form.Control
              type="text"
              inputMode="numeric"
              className="code-input"
              maxLength={6}
              placeholder="Enter the code you received"
              value={code}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const onlyNumbers = e.target.value.replace(/\D/g, "");
                setCode(onlyNumbers);
              }}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formNewPassword">
            <Form.Label>New password</Form.Label>
            <PasswordField
              id="newPassword"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
              required
            />
          </Form.Group>

          <Button
            variant="secondary"
            type="submit"
            className="fw-semibold mt-2 w-100 d-flex justify-content-center align-items-center"
            style={{ height: "36px" }}
          >
            {isLoading ? <BeatLoader className="my-1" /> : "Reset password"}
          </Button>
        </Form>
        {errorMessage && (
          <Alert variant="danger" className="mt-3 mb-0">
            {errorMessage}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );
}

export default ResetPasswordCard;
