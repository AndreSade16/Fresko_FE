import { useEffect, useState } from "react";
import type {
  PantryItemUpdateDTO,
  PantryPageContent,
  StandardError,
} from "../../interfaces/interfaces";
import DeleteModal from "./DeleteModal/DeleteModal";
import PantryFilters from "./PantryFilters/PantryFilters";
import { Button, Container } from "react-bootstrap";
import { useSearchParams } from "react-router";
import { type AppDispatch, type RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePantryItem,
  fetchPantry,
} from "../../redux/reducers/PantrySlice";
import PantryList from "./PantryList/PantryList";
import PantryItemCreationForm from "./PantryItemCreationFormProps/PantryItemCreationModal";
import { GridLoader } from "react-spinners";
import EditModal from "./EditModal/EditModal";
import { apiFetch } from "../../tools/fetchHelper";

function PantryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<PantryPageContent | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.pantry,
  );

  const handleLoadMore = (nextPage: number) => {
    const currentParams = Object.fromEntries(searchParams.entries());
    dispatch(fetchPantry({ ...currentParams, page: nextPage.toString() }));
  };

  const handleDelete = () => {
    if (selectedItem?.pantryItemId) {
      dispatch(deletePantryItem(selectedItem?.pantryItemId));
    }
    setShowDeleteModal(false);
    setSelectedItem(null);
  };

  const handleUpdate = async (
    pantryItemId: string,
    body: PantryItemUpdateDTO,
  ) => {
    try {
      await apiFetch("/pantry-items/me/" + pantryItemId, {
        method: "PATCH",
        body: JSON.stringify(body),
      });

      const currentParams = Object.fromEntries(searchParams.entries());
      dispatch(fetchPantry(currentParams));
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        setErrorMessage((error as StandardError).message);
      }
    }
    setShowEditModal(false);
    setSelectedItem(null);
  };

  useEffect(() => {
    const fetchPantryItems = (params: URLSearchParams) => {
      const filtersObject = Object.fromEntries(params.entries());
      dispatch(fetchPantry(filtersObject));
    };

    const timer = setTimeout(() => {
      fetchPantryItems(searchParams);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, dispatch]);

  const hasInitialData = data && data.content && data.content.length > 0;

  return (
    <Container fluid className="mt-5 d-flex flex-column align-items-center">
      <PantryFilters />
      <Button
        variant="secondary"
        className="mb-4 fw-semibold"
        onClick={() => setShowCreateModal(true)}
      >
        Create Pantry Item
      </Button>

      {isLoading && !hasInitialData ? (
        <GridLoader color="white" className="mt-5 pt-2" />
      ) : (
        <PantryList
          data={data}
          isLoading={isLoading}
          error={error || errorMessage}
          onLoadMore={handleLoadMore}
          onDeleteItem={(item) => {
            setShowDeleteModal(true);
            setSelectedItem(item);
          }}
          onEditItem={(item) => {
            setShowEditModal(true);
            setSelectedItem(item);
          }}
        />
      )}

      <PantryItemCreationForm
        showCreateModal={showCreateModal}
        setShowCreateModal={setShowCreateModal}
        onSuccess={() => setShowCreateModal(false)}
      />
      <EditModal
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        selectedItem={selectedItem}
        onUpdateItem={handleUpdate}
      />
      <DeleteModal
        selectedItem={selectedItem}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        onConfirmDelete={handleDelete}
      />
    </Container>
  );
}

export default PantryPage;
