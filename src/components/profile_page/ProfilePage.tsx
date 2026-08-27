import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useState } from "react";
import ProfileInfoSection from "./ProfileInfoSection/ProfileInfoSection";
import EditProfileModal, {
  type UserEditPayload,
} from "./EditProfileModal/EditProfileModal";
import { SyncLoader } from "react-spinners";
import {
  fetchUserProfile,
  updateUserProfile,
} from "../../redux/reducers/UserSlice";
import { toast } from "react-toastify";
import type { StandardError, UserDTO } from "../../interfaces/interfaces";
import UpdateAvatarModal from "./UpdateAvatarModal/UpdateAvatarModal";
import { apiFetch } from "../../tools/fetchHelper";
import LemonImage from "../LemonImage/LemonImage";

function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user);
  const [showAvatarModal, setShowAvatarModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const { avatar, username, email, firstName, lastName, isLoading } = user;

  const handleSaveProfile = async (formData: UserEditPayload) => {
    try {
      if (
        formData.email === user.email &&
        formData.firstName === user.firstName &&
        formData.lastName === user.lastName &&
        formData.username === user.username
      )
        throw new Error("You should make any change for it to be saved.");

      await dispatch(updateUserProfile(formData)).unwrap();

      toast.success(`Changes applied correctly!`);
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
      throw error;
    }
  };

  const handleAvatarUpdate = async (file: File) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);

    setIsSaving(true);

    try {
      await apiFetch<UserDTO>("/users/me/avatar", {
        method: "PATCH",
        body: formData,
      });
      setShowAvatarModal(false);
      await dispatch(fetchUserProfile());
      toast.success("Avatar changed successfully!");
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
      throw error;
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container fluid className="py-4 position-relative">
      <LemonImage />
      <Row className="g-4 w-100">
        {isLoading ? (
          <Col className="d-flex flex-column align-items-center">
            <SyncLoader color="white" className="mt-5" />
          </Col>
        ) : (
          <Col md={3} className="d-flex flex-column align-items-center">
            <div
              className="rounded-3 border border-2 border-light overflow-hidden position-relative shadow-sm w-100"
              role="button"
              style={{ maxWidth: "300px" }}
              onClick={() => setShowAvatarModal(true)}
            >
              <Image
                src={avatar ?? "https://placehold.co/600x400/png"}
                className="object-fit-cover w-100 h-100"
                style={{
                  maxWidth: "300px",
                  maxHeight: "300px",
                  aspectRatio: "1",
                }}
              />

              <i className="bi bi-pencil-square position-absolute bottom-0 end-0 z-3 me-3 mb-2 fs-2 text-white">
                <small>Edit</small>
              </i>
            </div>
          </Col>
        )}

        <ProfileInfoSection
          user={user}
          setShowEditModal={() => setShowEditModal(true)}
        ></ProfileInfoSection>
      </Row>
      <EditProfileModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        currentUser={{
          username: username ?? "",
          email: email ?? "",
          firstName: firstName ?? "",
          lastName: lastName ?? "",
        }}
        onSave={handleSaveProfile}
      />

      <UpdateAvatarModal
        onUpdate={handleAvatarUpdate}
        setShowAvatarModal={() => setShowAvatarModal(false)}
        showAvatarModal={showAvatarModal}
        isSaving={isSaving}
      />
    </Container>
  );
}

export default ProfilePage;
