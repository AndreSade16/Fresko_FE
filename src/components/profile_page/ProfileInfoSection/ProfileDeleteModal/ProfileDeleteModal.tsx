import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { PulseLoader } from "react-spinners";

interface DeleteModalProps {
  show: boolean;
  setShow: (value: boolean) => void;
  onDelete: (email: string, password: string) => void;
  isDeleting: boolean;
}

function DeleteModal({
  show,
  setShow,
  onDelete,
  isDeleting,
}: DeleteModalProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  return (
    <Modal
      show={show}
      onHide={() => setShow(false)}
      contentClassName="bg-primary text-light"
      centered
    >
      <Modal.Header>
        <Modal.Title>Password Update</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        ⚠️ Are you{" "}
        <strong className="text-decoration-underline text-secondary">
          extremely
        </strong>{" "}
        sure you want to delete your account? ⚠️
        <Form className="my-3">
          <Form.Group>
            <Form.Label className="small fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            ></Form.Control>
          </Form.Group>
          <Form.Group className="mt-1">
            <Form.Label className="small fw-semibold">Password</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            ></Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-light"
          onClick={() => setShow(false)}
          disabled={isDeleting}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => onDelete(email, password)}
          className="fw-semibold position-relative text-light"
          disabled={isDeleting}
        >
          <span style={{ visibility: isDeleting ? "hidden" : "visible" }}>
            Delete
          </span>

          {isDeleting && (
            <div className="position-absolute start-50 top-50 translate-middle d-flex align-items-center">
              <PulseLoader color="#000000" size={8} />
            </div>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
