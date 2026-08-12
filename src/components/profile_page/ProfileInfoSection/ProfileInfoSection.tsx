import { Badge, Button, Card, Col, Form } from "react-bootstrap";
import type { UserState } from "../../../redux/reducers/UserSlice";

interface ProfileInfoSectionProps {
  user: UserState;
  setShowEditModal: () => void;
}

function ProfileInfoSection({
  user,
  setShowEditModal,
}: ProfileInfoSectionProps) {
  const { userId, username, firstName, lastName, email, role } = user;
  return (
    <Col
      md={9}
      className="d-flex flex-column gap-4"
      style={{ minWidth: "230px" }}
    >
      <Card className="shadow-sm border-0 bg-primary text-light">
        <Card.Header className="d-flex justify-content-between align-items-center bg-transparent border-bottom border-light border-opacity-25 py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-person-badge me-2"></i>User Profile
          </h5>
          <Button variant="outline-light" size="sm" onClick={setShowEditModal}>
            <i className="bi bi-pencil me-1"></i> Edit Profile
          </Button>
        </Card.Header>
        <Card.Body className="d-flex flex-column gap-2">
          <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom border-light border-opacity-10 pb-2 text-wrap">
            <span className="text-light text-opacity-75">User ID:</span>
            <span className="fw-semibold">#{userId}</span>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom border-light border-opacity-10 pb-2">
            <span className="text-light text-opacity-75">Username:</span>
            <span className="fw-semibold">@{username}</span>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom border-light border-opacity-10 pb-2">
            <span className="text-light text-opacity-75">Full Name:</span>
            <span className="fw-semibold">
              {firstName} {lastName}
            </span>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom border-light border-opacity-10 pb-2">
            <span className="text-light text-opacity-75">Email:</span>
            <span className="fw-semibold text-break">{email}</span>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center pt-1">
            <span className="text-light text-opacity-75">Role:</span>
            <Badge bg="warning" text="dark" className="fs-7">
              {role}
            </Badge>
          </div>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-0 bg-primary text-light">
        <Card.Header className="bg-transparent border-bottom border-light border-opacity-25 py-3">
          <h5 className="mb-0 fw-bold">
            <i className="bi bi-shield-lock me-2"></i>Change Password
          </h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={(e) => e.preventDefault()}>
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label className="small">Current Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter current password"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label className="small">New Password</Form.Label>
              <Form.Control type="password" placeholder="Enter new password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label className="small">Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
              />
            </Form.Group>
            <Button
              variant="warning"
              type="submit"
              className="w-100 fw-semibold"
            >
              Update Password
            </Button>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm border-danger bg-secondary bg-opacity-10 text-light">
        <Card.Header className="bg-transparent border-secondary border-opacity-25 py-3">
          <h5 className="mb-0 fw-bold text-secondary">
            <i className="bi bi-exclamation-triangle me-2 text-danger"></i>
            Danger Zone
          </h5>
        </Card.Header>
        <Card.Body className="d-flex flex-column gap-3">
          <p className="small mb-0 text-light text-opacity-75">
            Once you delete your account, there is no going back. Please be
            certain.
          </p>
          <Button
            variant="secondary"
            className="fw-semibold align-self-start"
            onClick={() => console.log("Delete Account Clicked")}
          >
            <i className="bi bi-trash me-1"></i> Delete Account
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default ProfileInfoSection;
