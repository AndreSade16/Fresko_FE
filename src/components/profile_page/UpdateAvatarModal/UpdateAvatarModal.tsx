import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

interface UpdateAvatarModalProps {
  onUpdate: (file: File) => void;
  setShowAvatarModal: () => void;
  showAvatarModal: boolean;
  isSaving: boolean;
}

function UpdateAvatarModal({
  onUpdate,
  setShowAvatarModal,
  showAvatarModal,
  isSaving,
}: UpdateAvatarModalProps) {
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    console.log("Ciao");

    if (!avatar) return;
    onUpdate(avatar);
    setAvatar(null);
  };

  return (
    <Modal
      show={showAvatarModal}
      onHide={() => {
        setShowAvatarModal();
        setAvatar(null);
      }}
      contentClassName="bg-primary text-light"
      centered
    >
      <Modal.Header>
        <Modal.Title>Change your Avatar</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formAvatar">
            <Form.Label>Avatar</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setAvatar(e.target.files[0]);
                }
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-light"
            onClick={() => {
              setShowAvatarModal();
              setAvatar(null);
            }}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            variant="warning"
            type="submit"
            disabled={isSaving}
            className="fw-semibold"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}

export default UpdateAvatarModal;
