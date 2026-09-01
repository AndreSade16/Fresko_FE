import React, { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { BeatLoader } from "react-spinners";
import { setAccessToken } from "../../../redux/reducers/AuthSlice";
import { useDispatch } from "react-redux";
import PasswordField from "../PasswordField/PasswordField";

function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const apiUrl = import.meta.env.VITE_API_URL;

    try {
      const response = await fetch(apiUrl + "/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (response.ok) {
        setIsLoading(false);
        const data = await response.json();

        dispatch(setAccessToken(data.token));

        navigate("/home");
      } else {
        const errorData = await response.json().catch(() => null);
        setIsLoading(false);
        setErrorMessage(
          errorData?.errorsList ||
            errorData?.message ||
            `Error ${response.status}: Login failed`,
        );
      }
    } catch (error) {
      console.error("Error occurred during login:", error);
      setErrorMessage("Network error, please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-primary shadow-sm p-3">
      <Card.Body>
        <Card.Title className="fs-2">Login to your account</Card.Title>
        <Form className="mt-4" onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <PasswordField
              id="loginPassword"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
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
            {isLoading ? <BeatLoader className="my-1" /> : "Login"}
          </Button>
        </Form>
        {errorMessage && (
          <Alert variant="danger" className="mt-3 mb-0">
            {errorMessage}
          </Alert>
        )}
        <Card.Text className="mt-3 text-center">
          If you don't have an account,{" "}
          <Link to={"/register"} className="text-secondary fw-semibold">
            register here
          </Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default LoginCard;
