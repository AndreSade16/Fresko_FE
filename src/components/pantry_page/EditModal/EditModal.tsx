import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import type { PantryItemUpdateDTO } from "../../../interfaces/interfaces";

interface EditModalProps {
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => boolean;
}

function EditModal({ showEditModal, setShowEditModal }: EditModalProps) {
  const [editFormData, setEditFormData] = useState<PantryItemUpdateDTO>({
    quantity: 0,
    purchaseDate: null,
    expirationDate: null,
    storageLocation: "",
  });

  const handleEditSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (selectedItem && onUpdateItem) {
      onUpdateItem(selectedItem.pantryItemId, editFormData);
    }
    setShowEditModal(false);
  };
  return (
    <Modal
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
      centered
      className="text-dark"
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit {selectedItem?.ingredientName}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleEditSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="editQuantity">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              step="any"
              min="0.01"
              required
              value={editFormData.quantity}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  quantity: parseFloat(e.target.value) || 0,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editStorageLocation">
            <Form.Label>Storage Location</Form.Label>

            <Form.Select
              value={editFormData.storageLocation}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  storageLocation: e.target.value as StorageLocation,
                })
              }
              required
            >
              <option value="FRIDGE">FRIDGE</option>
              <option value="FREEZER">FREEZER</option>
              <option value="PANTRY">PANTRY</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3" controlId="editPurchaseDate">
            <Form.Label>Purchase Date</Form.Label>
            <Form.Control
              type="date"
              required
              value={editFormData.purchaseDate}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  purchaseDate: e.target.value,
                })
              }
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="editExpirationDate">
            <Form.Label>Expiration Date</Form.Label>
            <Form.Control
              type="date"
              required
              value={editFormData.expirationDate}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  expirationDate: e.target.value,
                })
              }
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default EditModal;
