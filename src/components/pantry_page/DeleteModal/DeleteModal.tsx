import { Button, Modal } from "react-bootstrap";
import type { PantryItem } from "../../../interfaces/interfaces";

interface DeleteModalProps {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  selectedItem: PantryItem | null;
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
        <strong>{selectedItem?.ingredientName}</strong> from your pantry?
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-light"
          onClick={() => setShowDeleteModal(false)}
        >
          Cancel
        </Button>
        <Button variant="warning" onClick={onConfirmDelete}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
