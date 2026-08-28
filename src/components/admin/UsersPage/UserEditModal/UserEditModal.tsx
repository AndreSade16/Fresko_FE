import { Button, Form, Modal } from "react-bootstrap";
import { PulseLoader } from "react-spinners";
import type { StandardError, User } from "../../../../interfaces/interfaces";
import { useState } from "react";
import { toast } from "react-toastify";

interface UserEditModalProps {
  show: boolean;
  selectedUser: User;
  onHide: () => void;
  onEdit: (formData: FormData) => void;
  isFetching: boolean;
}

function UserEditModal({
  show,
  selectedUser,
  onHide,
  onEdit,
  isFetching,
}: UserEditModalProps) {
  const [username, setUsername] = useState(selectedUser.username);
  const [email, setEmail] = useState(selectedUser.email);
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState(selectedUser.firstName);
  const [lastName, setLastName] = useState(selectedUser.lastName);
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("email", email);
      if (password) formData.append("password", password);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      if (avatar) formData.append("avatar", avatar);

      onEdit(formData);
    } catch (error: unknown) {
      let message = `An error occurred while deleting user ${username}.`;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      contentClassName="bg-primary"
      centered
      size="lg"
      backdrop="static"
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="fw-bold fs-2">Edit User</Modal.Title>
      </Modal.Header>
      <Form className="mt-4" onSubmit={handleSubmit}>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-light"
            type="submit"
            className="fw-semibold mt-2 w-100 d-flex justify-content-center align-items-center"
            onClick={onHide}
            disabled={isFetching}
          >
            {isFetching ? (
              <PulseLoader className="my-1" color="white" />
            ) : (
              "Cancel"
            )}
          </Button>
          <Button
            variant="outline-secondary"
            type="submit"
            className="fw-semibold mt-2 w-100 d-flex justify-content-center align-items-center"
            disabled={isFetching}
          >
            {isFetching ? (
              <PulseLoader className="my-1" color="white" />
            ) : (
              "Update"
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UserEditModal;
