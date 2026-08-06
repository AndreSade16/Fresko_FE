import { useEffect, useState } from "react";
import type { PantryItem } from "../../interfaces/interfaces";
import DeleteModal from "./DeleteModal/DeleteModal";
import PantryFilters from "./PantryFilters/PantryFilters";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router";
import { type AppDispatch, type RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePantryItem,
  fetchPantry,
} from "../../redux/reducers/PantrySlice";
import PantryList from "./PantryList/PantryList";

function PantryPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
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

  useEffect(() => {
    const fetchPantryItems = (params: URLSearchParams) => {
      const filtersObject = Object.fromEntries(params.entries());
      console.log("FILTERS SENT TO API:", filtersObject);

      dispatch(fetchPantry(filtersObject));
    };
    const timer = setTimeout(() => {
      fetchPantryItems(searchParams);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, dispatch]);

  return (
    <Container fluid className="mt-5">
      <PantryFilters />
      <PantryList
        data={data}
        isLoading={isLoading}
        error={error}
        onLoadMore={handleLoadMore}
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
