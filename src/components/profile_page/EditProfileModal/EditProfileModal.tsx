import { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

export interface UserEditPayload {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface EditProfileModalProps {
  show: boolean;
  onHide: () => void;
  currentUser: UserEditPayload;
  onSave: (updatedUser: UserEditPayload) => Promise<void> | void;
  isLoading?: boolean;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function EditProfileModal({
  show,
  onHide,
  currentUser,
  onSave,
  isLoading = false,
}: EditProfileModalProps) {
  const [formData, setFormData] = useState<UserEditPayload>(currentUser);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: keyof UserEditPayload, value: string) => {
    let errorMsg = "";

    switch (name) {
      case "username": {
        if (value.trim().length < 3) {
          errorMsg = "Username field must be at least 3 characters long";
        }
        break;
      }
      case "email": {
        if (!EMAIL_REGEX.test(value)) {
          errorMsg = "Email field must be a valid email";
        }
        break;
      }
      case "firstName": {
        if (value.trim().length < 3) {
          errorMsg = "First name field must be at least 3 characters long";
        }
        break;
      }
      case "lastName": {
        if (value.trim().length < 3) {
          errorMsg = "Last name field must be at least 3 characters long";
        }
        break;
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name as keyof UserEditPayload, value);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    if (isFormValid) {
      try {
        await onSave(formData);
        onHide();
      } catch (error) {
        console.log(error);
      } finally {
        setFormData(currentUser);
      }
    }
  };

  const isFormValid =
    Object.values(errors).every((x) => x === "") &&
    formData.username.length >= 3 &&
    formData.firstName.length >= 3 &&
    formData.lastName.length >= 3 &&
    EMAIL_REGEX.test(formData.email);

  return (
    <Modal
      show={show}
      onShow={() => setFormData(currentUser)}
      onHide={onHide}
      centered
      contentClassName="bg-primary text-light"
      onExited={() => {
        setFormData(currentUser);
        setErrors({});
      }}
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title className="fs-5 fw-bold">
          <i className="bi bi-pencil-square me-2"></i>Edit Profile
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body className="d-flex flex-column gap-3">
          {/* Username */}
          <Form.Group controlId="editUsername">
            <Form.Label className="small fw-semibold">Username</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              isInvalid={!!errors.username}
            />
            <Form.Control.Feedback type="invalid">
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Email */}
          <Form.Group controlId="editEmail">
            <Form.Label className="small fw-semibold">Email</Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          {/* First Name */}
          <Form.Group controlId="editFirstName">
            <Form.Label className="small fw-semibold">First Name</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              isInvalid={!!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.firstName}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Last Name */}
          <Form.Group controlId="editLastName">
            <Form.Label className="small fw-semibold">Last Name</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              isInvalid={!!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">
              {errors.lastName}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-light" onClick={onHide} disabled={isLoading}>
            Cancel
          </Button>
          <Button
            variant="warning"
            type="submit"
            disabled={!isFormValid || isLoading}
            className="fw-semibold"
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditProfileModal;
