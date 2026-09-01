import { Button, Modal } from "react-bootstrap";
import type { PantryPageContent } from "../../../interfaces/interfaces";

interface DeleteModalProps {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  selectedItem: PantryPageContent | null;
  onConfirmDelete: () => void;
}

function DeleteModal({
  showDeleteModal,
  setShowDeleteModal,
  selectedItem,
  onConfirmDelete,
}: DeleteModalProps) {
  return (
    <Modal
      show={showDeleteModal}
      onHide={() => setShowDeleteModal(false)}
      centered
      contentClassName="bg-primary text-light"
    >
      <Modal.Header closeButton closeVariant="white">
        {" "}
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to remove{" "}
        <strong>{selectedItem?.ingredientDefinition.name}</strong> from your
        pantry?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-light"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </Button>
        <Button
          variant="warning"
          onClick={onConfirmDelete}
          className="fw-semibold"
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
