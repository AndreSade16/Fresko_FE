import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router";
import { BeatLoader } from "react-spinners";
import { toast } from "react-toastify";

function ForgotPasswordCard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(apiUrl + "/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
        }),
      });

      if (response.ok) {
        setIsLoading(false);
        toast.success("If that email exists, a reset code has been sent!");
        navigate("/reset-password", { state: { email } });
      } else {
        const errorData = await response.json().catch(() => null);
        setIsLoading(false);
        setErrorMessage(
          errorData?.message || `Error ${response.status}: Request failed`,
        );
      }
    } catch (error) {
      console.error("Error occurred during forgot password request:", error);
      setErrorMessage("Network error, please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-primary shadow-sm p-3">
      <Card.Body>
        <Card.Title className="fs-2">Forgot your password?</Card.Title>
        <Card.Text className="mb-4">
          Enter your email and we'll send you a code to reset your password.
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

          <Button
            variant="secondary"
            type="submit"
            className="fw-semibold mt-2 w-100 d-flex justify-content-center align-items-center"
            style={{ height: "36px" }}
          >
            {isLoading ? <BeatLoader className="my-1" /> : "Send code"}
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

export default ForgotPasswordCard;
