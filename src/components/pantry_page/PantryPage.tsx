import { useEffect, useState } from "react";
import type { PantryItem } from "../../interfaces/interfaces";
import DeleteModal from "./DeleteModal/DeleteModal";
import PantryFilters from "./PantryFilters/PantryFilters";
import { Container } from "react-bootstrap";
import { useSearchParams } from "react-router";

function PantryPage() {
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] = useState<PantryItem | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(true);
  const handleDelete = (item) => {
    setSelectedItem(null);
  };
  const fetchPantryItems = (params: URLSearchParams) => {
    const filtersObject = Object.fromEntries(params.entries());
    console.log("FILTERS SENT TO API:", filtersObject);

    // dispatch(getPantryItemsThunk(filtersObject));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchPantryItems(searchParams);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams]);
  return (
    <Container fluid className="mt-5">
      <PantryFilters />
      <DeleteModal
        selectedItem={selectedItem}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        onConfirmDelete={() => handleDelete(selectedItem)}
      />
    </Container>
  );
}

export default PantryPage;
