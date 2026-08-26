import { Container } from "react-bootstrap";
import UserFilters from "./UsersFilters/UsersFilters";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { GridLoader } from "react-spinners";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../../redux/reducers/AdminUsersSlice";
import UsersList from "./UsersList/UsersList";
import type { StandardError, User } from "../../../interfaces/interfaces";
import { toast } from "react-toastify";
import { apiFetch } from "../../../tools/fetchHelper";
import UserDeleteModal from "./UserDeleteModal/UserDeleteModal";
import UserEditModal from "./UserEditModal/UserEditModal";

function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);

  const { isLoading, error, data } = useSelector(
    (state: RootState) => state.adminUsers,
  );

  // const userRole = useSelector((state: RootState) => state.user.role);

  useEffect(() => {
    const fetchUsersList = (params: URLSearchParams) => {
      dispatch(fetchAdminUsers(params));
    };

    const timer = setTimeout(() => {
      fetchUsersList(searchParams);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, dispatch]);

  const handleLoadMore = (nextPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", nextPage.toString());

    dispatch(fetchAdminUsers(newParams));
  };

  const handleDelete = async (user: User) => {
    if (!user) return;
    const { username, userId, firstName, lastName } = user;

    setIsFetching(true);

    try {
      await apiFetch(`/users/${userId}`, { method: "DELETE" });
      toast.success(
        `User ${username} (${firstName} ${lastName}) deleted successfully!`,
      );
      dispatch(fetchAdminUsers(searchParams));
    } catch (error: unknown) {
      let message = `An error occurred while deleting user ${username}.`;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setSelectedUser(null);
      setIsFetching(false);
    }
  };
  const handleEdit = async (formData: FormData) => {
    if (!formData) return;
    if (!selectedUser) return;

    setIsFetching(true);
    try {
      const response = await apiFetch<User>(`/users/${selectedUser.userId}`, {
        method: "PATCH",
        body: formData,
      });
      toast.success(`User ${response.username} correctly edited`);
      await dispatch(fetchAdminUsers(searchParams));
    } catch (error: unknown) {
      let message = `An error occurred while editing user ${formData.get("username")}.`;
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
    } finally {
      setSelectedUser(null);
      setIsFetching(false);
    }
  };

  const hasInitialData = Boolean(
    data && data.content && data.content.length > 0,
  );

  return (
    <Container fluid className="d-flex flex-column align-items-center">
      <h1 className="fst-italic my-5 text-left w-100 ps-2 fw-bolder">Users</h1>
      <UserFilters />

      {isLoading && !hasInitialData ? (
        <GridLoader color="white" className="mt-5 pt-2" />
      ) : (
        <UsersList
          data={data}
          isLoading={isLoading}
          error={error}
          onLoadMore={handleLoadMore}
          isFetching={isFetching}
          setIsFetching={setIsFetching}
          onDeleteUser={(user) => {
            setSelectedUser(user);
            setShowDeleteModal(true);
          }}
          onEditUser={(user) => {
            setSelectedUser(user);
            setShowEditModal(true);
          }}
        />
      )}
      {selectedUser && (
        <UserDeleteModal
          show={showDeleteModal}
          selectedUser={selectedUser}
          onHide={() => {
            setShowDeleteModal(false);
            setSelectedUser(null);
          }}
          onDelete={handleDelete}
          isFetching={isFetching}
        />
      )}
      {selectedUser && (
        <UserEditModal
          show={showEditModal}
          selectedUser={selectedUser}
          onHide={() => {
            setShowEditModal(false);
            setSelectedUser(null);
          }}
          onEdit={handleEdit}
          isFetching={isFetching}
        />
      )}
    </Container>
  );
}

export default UsersPage;
