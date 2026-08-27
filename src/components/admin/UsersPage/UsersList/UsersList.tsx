import { Alert, Badge, Button, Card, Col, Row } from "react-bootstrap";

import { PulseLoader } from "react-spinners";
import { useEffect, useRef, type Dispatch, type SetStateAction } from "react";
import type {
  StandardError,
  User,
  UserPage,
} from "../../../../interfaces/interfaces";
import { useNavigate } from "react-router";

interface UsersListProps {
  data: UserPage | null;
  isLoading: boolean;
  error: StandardError | string | null;
  onLoadMore: (nextPage: number) => void;
  onDeleteUser: (user: User) => void;
  isFetching: boolean;
  setIsFetching: Dispatch<SetStateAction<boolean>>;
  onEditUser: (user: User) => void;
}

function UsersList({
  data,
  isLoading,
  onLoadMore,
  onEditUser,
  onDeleteUser,
  isFetching,
}: UsersListProps) {
  const navigate = useNavigate();
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const users = data?.content || [];
  const isLastPage = data?.last ?? true;
  const currentPage = data?.number ?? 0;

  useEffect(() => {
    if (isLoading || isLastPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore(currentPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [isLoading, isLastPage, currentPage, onLoadMore]);

  if (!isLoading && data !== null && users.length === 0) {
    return (
      <Alert variant="secondary" className="my-3 text-center">
        No user found.
      </Alert>
    );
  }

  return (
    <div
      className="ingredient-list-container mt-3 w-100"
      style={{ minWidth: "200px" }}
    >
      <Row xs={1} sm={2} md={3} lg={4} className="g-4">
        {users.map((user) => {
          const { username, userId, email, firstName, lastName, avatar, role } =
            user;

          return (
            <Col key={userId}>
              <Card
                className="h-100 shadow-sm hover-card bg-primary text-white"
                onClick={() => navigate(`/admin/users/${userId}`)}
                style={{ cursor: "pointer" }}
              >
                {avatar && (
                  <Card.Img
                    variant="top"
                    src={avatar}
                    alt={username}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                )}
                <Card.Body className="d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <Card.Title className="mb-0 fs-6 fw-bold">
                      {firstName} {lastName}
                    </Card.Title>
                    <Badge bg="warning" className="ms-1 text-dark">
                      {role}
                    </Badge>
                  </div>

                  <Card.Text className="text-light small flex-grow-1">
                    {email}
                  </Card.Text>

                  <Card.Text className="text-light small flex-grow-1">
                    <b>ID:</b> {userId}
                  </Card.Text>

                  <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
                    <Button
                      variant="outline-warning"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => onEditUser(user)}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <PulseLoader className="my-1" color="white" />
                      ) : (
                        "Edit"
                      )}
                    </Button>

                    <Button
                      variant="outline-danger"
                      size="sm"
                      className="w-100 fw-semibold"
                      onClick={() => onDeleteUser(user)}
                      disabled={isFetching}
                    >
                      {isFetching ? (
                        <PulseLoader className="my-1" color="white" />
                      ) : (
                        "Delete"
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <div ref={sentinelRef} style={{ height: "20px", margin: "10px 0" }} />

      {isLoading && (
        <div className="text-center my-4">
          <PulseLoader color="white" />
        </div>
      )}
    </div>
  );
}

export default UsersList;
