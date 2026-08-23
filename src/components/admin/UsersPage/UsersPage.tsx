import { Container } from "react-bootstrap";
import UserFilters from "./UsersFilters/UsersFilters";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { GridLoader } from "react-spinners";
import { useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import { fetchAdminUsers } from "../../../redux/reducers/AdminUsersSlice";
import UsersList from "./UsersList/UsersList";

function UsersPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [isFetching, setIsFetisFetching] = useState<boolean>(false);

  const { isLoading, error, data } = useSelector(
    (state: RootState) => state.adminUsers,
  );

  const userRole = useSelector((state: RootState) => state.user.role);

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

  const handleDelete = () => {};
  const handleEdit = () => {};

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
          activeUserRole={userRole}
          isFetching={isFetching}
          setIsFetching={setIsFetisFetching}
          onDeleteUser={handleDelete}
          onEditUser={handleEdit}
        />
      )}
    </Container>
  );
}

export default UsersPage;
