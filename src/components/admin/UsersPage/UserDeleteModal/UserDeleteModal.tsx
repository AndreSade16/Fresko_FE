import { Button, Modal } from "react-bootstrap";
import { PulseLoader } from "react-spinners";
import type { User } from "../../../../interfaces/interfaces";

interface UserDeleteModalProps {
  show: boolean;
  selectedUser: User;
  onHide: () => void;
  onDelete: (selectedUser: User) => void;
  isFetching: boolean;
}

function UserDeleteModal({
  show,
  selectedUser,
  onHide,
  onDelete,
  isFetching,
}: UserDeleteModalProps) {
  const { username, firstName, lastName } = selectedUser;
  return (
    <Modal
      show={show}
      backdrop="static"
      centered
      contentClassName="bg-primary text-light"
      onHide={onHide}
    >
      <Modal.Header closeButton closeVariant="white">
        <Modal.Title>Delete Ingredient Definition</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete user{" "}
        <b>
          {username} ({firstName} {lastName})
        </b>
        ?<br />* This action is <b className="text-danger">irreversible</b>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="outline-light"
          className="fw-semibold d-inline-flex align-items-center justify-content-center"
          style={{ minWidth: "140px", height: "38px" }}
          onClick={onHide}
          disabled={isFetching}
        >
          {isFetching ? (
            <div className="d-flex align-items-center justify-content-center">
              <PulseLoader color="white" size={10} />
            </div>
          ) : (
            "Cancel"
          )}
        </Button>
        <Button
          variant="outline-danger"
          className="fw-semibold d-inline-flex align-items-center justify-content-center"
          style={{ minWidth: "140px", height: "38px" }}
          onClick={() => onDelete(selectedUser)}
          disabled={isFetching}
        >
          {isFetching ? (
            <div className="d-flex align-items-center justify-content-center">
              <PulseLoader color="white" size={10} />
            </div>
          ) : (
            "Delete"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default UserDeleteModal;
