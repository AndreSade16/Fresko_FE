import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import { Badge, Button, Card, Col, Container, Row } from "react-bootstrap";
import { GridLoader, PulseLoader } from "react-spinners";

import { apiFetch } from "../../../tools/fetchHelper";
import type { StandardError, User } from "../../../interfaces/interfaces";
import UserEditModal from "../../admin/UsersPage/UserEditModal/UserEditModal";
import UserDeleteModal from "../../admin/UsersPage/UserDeleteModal/UserDeleteModal";

function UserDetails() {
  const navigate = useNavigate();

  const { userId } = useParams<{ userId: string }>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isImageValid, setIsImageValid] = useState<boolean>(true);

  const fetchUser = useCallback(async () => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const data = await apiFetch<User>(`/users/${userId}`);
      setUser(data);
      setIsImageValid(true);
    } catch (error: unknown) {
      let message = `An error occurred while fetching the user`;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchUser();
  }, [fetchUser]);

  const handleDelete = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      await apiFetch(`/users/${user.userId}`, {
        method: "DELETE",
      });
      toast.success(`${user.username} deleted successfully.`);
      navigate(-1);
    } catch (error: unknown) {
      let message = "An error occurred while deleting the user.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (formData: FormData) => {
    if (!formData) return;
    if (!user) return;

    setIsFetching(true);
    try {
      const response = await apiFetch<User>(`/users/${user.userId}`, {
        method: "PATCH",
        body: formData,
      });
      toast.success(`User ${response.username} correctly edited`);
      fetchUser();
      setShowEditModal(false);
    } catch (error: unknown) {
      let message = `An error occurred while editing user ${formData.get("username")}.`;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center my-3">
      {isLoading && !user ? (
        <GridLoader color="white" className="mt-5" />
      ) : (
        user && (
          <Row className="w-100 d-flex justify-content-center">
            <Col sm={9} md={7} lg={5} className="d-flex justify-content-center">
              <Card className="bg-primary w-100" style={{ minWidth: "200px" }}>
                <Card.Body className="d-flex flex-column">
                  <Card.Title className="fs-2 fw-semibold">
                    {user.username}
                  </Card.Title>
                  {user.avatar && isImageValid && (
                    <div className="d-flex justify-content-center my-3">
                      <Card.Img
                        style={{
                          maxWidth: "300px",
                          aspectRatio: "auto",
                        }}
                        src={user.avatar}
                        onError={() => setIsImageValid(false)}
                      />
                    </div>
                  )}
                  <div className="d-flex flex-wrap gap-3 justify-content-around mb-3">
                    <div className="d-flex flex-nowrap gap-1">
                      <span className="fw-semibold">Role:</span>
                      <Badge
                        bg="secondary"
                        text="dark"
                        className="d-flex align-items-center"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  </div>
                  <Card.Subtitle className="mt-2 mb-4 text-muted text-center">
                    email: {user.email}
                  </Card.Subtitle>

                  <div className="d-flex flex-column flex-md-row justify-content-md-between border-bottom border-1 border-opacity-25 border-light py-3">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-center">
                      Full name:
                    </Card.Text>
                    <Card.Text className="text-end d-flex align-items-center">
                      {user.firstName} {user.lastName}
                    </Card.Text>
                  </div>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between py-3 border-bottom border-1 border-opacity-25 border-light gap-0 gap-md-5">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-start">
                      Username:
                    </Card.Text>
                    <Card.Text
                      className="text-md-end"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {user.username}
                    </Card.Text>
                  </div>
                  <div className="d-flex flex-column flex-md-row justify-content-md-between border-bottom border-1 border-opacity-25 border-light py-3">
                    <Card.Text className="fw-semibold mb-1 d-flex align-items-center">
                      User ID:
                    </Card.Text>
                    <Card.Text className="text-sm-end d-flex align-items-center">
                      {user.userId}
                    </Card.Text>
                  </div>

                  <Card.Footer className="d-flex flex-column flex-md-row gap-2 mt-3 bg-transparent border-0">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => setShowEditModal(true)}
                      disabled={isLoading || isFetching}
                    >
                      {isFetching ? <PulseLoader color="white" /> : "Edit"}
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => setShowDeleteModal(true)}
                      disabled={isLoading || isFetching}
                    >
                      {isFetching ? <PulseLoader color="white" /> : "Delete"}
                    </Button>
                  </Card.Footer>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )
      )}
      <Button
        className="mt-4 fw-semibold"
        variant="outline-secondary"
        onClick={() => navigate(-1)}
      >
        Go back
      </Button>
      {showEditModal && user && (
        <UserEditModal
          key={user.userId}
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          selectedUser={user}
          onEdit={handleEdit}
          isFetching={isFetching}
        />
      )}
      {user && (
        <UserDeleteModal
          show={showDeleteModal}
          selectedUser={user}
          onHide={() => {
            setShowDeleteModal(false);
          }}
          onDelete={handleDelete}
          isFetching={isFetching}
        />
      )}
    </Container>
  );
}

export default UserDetails;
