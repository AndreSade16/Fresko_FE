import { Badge, Button, Card, Col, Form } from "react-bootstrap";
import type { UserState } from "../../../redux/reducers/UserSlice";
import React, { useState } from "react";
import PwUpdateModal from "../PwUpdateModal/PwUpdateModal";
import { toast } from "react-toastify";
import { apiFetch } from "../../../tools/fetchHelper";
import {
  type StandardError,
  type UserDTO,
} from "../../../interfaces/interfaces";
import DeleteModal from "./ProfileDeleteModal/ProfileDeleteModal";
import { useDispatch } from "react-redux";
import { type AppDispatch } from "../../../redux/store";
import { logout } from "../../../redux/reducers/AuthSlice";

interface ProfileInfoSectionProps {
  user: UserState;
  setShowEditModal: () => void;
}

interface PasswordChangeDTO {
  newPassword: string;
  repeatNewPassword: string;
  oldPassword: string;
}

function ProfileInfoSection({
  user,
  setShowEditModal,
}: ProfileInfoSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { userId, username, firstName, lastName, email, role } = user;
  const [showPwUpdateModal, setShowPwUpdateModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [formData, setFormData] = useState<PasswordChangeDTO>({
    oldPassword: "",
    repeatNewPassword: "",
    newPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const PW_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  const validatePw = (name: keyof PasswordChangeDTO, value: string) => {
    let errorMsg = "";

    if (!PW_REGEX.test(value)) {
      errorMsg =
        "Passwords must be at least 8 characters long and contain at least a number and an uppercase letter.";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validatePw(name as keyof PasswordChangeDTO, value);
  };

  const arePasswordsValid =
    Object.values(errors).every((x) => x === "") &&
    PW_REGEX.test(formData.oldPassword);
  PW_REGEX.test(formData.newPassword);
  PW_REGEX.test(formData.repeatNewPassword);

  const handleUpdatePassword = async () => {
    if (!arePasswordsValid) {
      toast.error("Validation error. Check your passwords.");
      return;
    }

    setIsUpdating(true);

    try {
      await apiFetch<UserDTO>("/users/me/password", {
        method: "PATCH",
        body: JSON.stringify(formData),
      });

      toast.success("Password changed successfully!");
      setShowPwUpdateModal(false);
      setFormData({
        oldPassword: "",
        repeatNewPassword: "",
        newPassword: "",
      });
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async (email: string, password: string) => {
    setIsDeleting(true);
    try {
      await apiFetch<void>("/users/me", {
        method: "DELETE",
        body: JSON.stringify({ email: email, password: password }),
      });
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
      throw error;
    } finally {
      setIsDeleting(false);
      dispatch(logout());
    }
  };

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
          <div className="d-flex flex-wrap justify-content-between align-items-center pb-2 border-bottom border-light border-opacity-10">
            <span className="text-light text-opacity-75">Role:</span>
            <Badge bg="warning" text="dark" className="fs-7">
              {role}
            </Badge>
          </div>
          <div className="d-flex flex-wrap justify-content-between align-items-center text-wrap">
            <span className="text-light text-opacity-75">User ID:</span>
            <span className="fw-semibold">#{userId}</span>
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
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              setShowPwUpdateModal(true);
            }}
          >
            <Form.Group className="mb-3" controlId="currentPassword">
              <Form.Label className="small">Current Password</Form.Label>
              <Form.Control
                type="password"
                name="oldPassword"
                placeholder="Enter current password"
                value={formData.oldPassword}
                onChange={handleChange}
                isInvalid={formData.oldPassword !== "" && !!errors.oldPassword}
              />
              {formData.oldPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.oldPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="newPassword">
              <Form.Label className="small">New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                name="newPassword"
                isInvalid={formData.newPassword !== "" && !!errors.newPassword}
              />
              {formData.newPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.newPassword}
                </Form.Control.Feedback>
              )}
            </Form.Group>
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label className="small">Confirm New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm new password"
                value={formData.repeatNewPassword}
                onChange={handleChange}
                name="repeatNewPassword"
                isInvalid={
                  formData.repeatNewPassword !== "" &&
                  !!errors.repeatNewPassword
                }
              />
              {formData.repeatNewPassword && (
                <Form.Control.Feedback type="invalid">
                  {errors.repeatNewPassword}
                </Form.Control.Feedback>
              )}
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

      <Card className="shadow-sm border-danger bg-primary text-light">
        <Card.Header className="bg-transparent border-danger border-opacity-25 py-3">
          <h5 className="mb-0 fw-bold text-danger">
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
            variant="danger"
            className="fw-semibold align-self-start text-light"
            onClick={() => setShowDeleteModal(true)}
          >
            <i className="bi bi-trash me-1"></i> Delete Account
          </Button>
        </Card.Body>
      </Card>
      <PwUpdateModal
        show={showPwUpdateModal}
        setShow={(value) => setShowPwUpdateModal(value)}
        onUpdate={handleUpdatePassword}
        isUpdating={isUpdating}
      />
      <DeleteModal
        show={showDeleteModal}
        setShow={setShowDeleteModal}
        onDelete={handleDelete}
        isDeleting={isDeleting}
      />
    </Col>
  );
}

export default ProfileInfoSection;
