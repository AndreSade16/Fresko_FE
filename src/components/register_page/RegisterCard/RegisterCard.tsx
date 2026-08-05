import { useState } from "react";
import { Alert, Button, Card, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router";
import { BeatLoader } from "react-spinners";

function RegisterCard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const formData = new FormData();
    const apiUrl = import.meta.env.VITE_API_URL;

    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await fetch(apiUrl + "/auth/register", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setSuccessMessage("Registration successful!");
        setIsLoading(false);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        const errorData = await response.json().catch(() => null);
        setIsLoading(false);
        setErrorMessage(
          errorData?.message || `Error ${response.status}: Registration failed`,
        );
      }
    } catch (error) {
      console.error("Error occurred during registration:", error);
      setErrorMessage("Network error. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-primary shadow-sm p-3">
      <Card.Body>
        <Card.Title className="fw-bold fs-2">Create an account</Card.Title>

        <Form className="mt-4" onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formFirstName">
            <Form.Label>First Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLastName">
            <Form.Label>Last Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formAvatar">
            <Form.Label>Avatar</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setAvatar(e.target.files[0]);
                }
              }}
            />
          </Form.Group>

          <Button
            variant="secondary"
            type="submit"
            className="fw-semibold mt-2 w-100 d-flex justify-content-center align-items-center"
          >
            {isLoading ? <BeatLoader /> : "Register"}
          </Button>
        </Form>

        {errorMessage && (
          <Alert variant="danger" className="mt-3 mb-0">
            {errorMessage}
          </Alert>
        )}

        {successMessage && (
          <Alert variant="secondary" className="mt-3 mb-0">
            {successMessage}
          </Alert>
        )}

        <Card.Text className="mt-3 text-center">
          Already have an account?{" "}
          <Link to={"/login"} className="text-secondary fw-semibold">
            login here
          </Link>
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

export default RegisterCard;
