import { useState } from "react";
import { Card, Button, Stack, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router";
import CreateRecipeModal from "./CreateRecipeModal/CreateRecipeModal";

function AdminPage() {
  const navigate = useNavigate();

  const [showRecipeModal, setShowRecipeModal] = useState(false);
  const [showIngredientModal, setShowIngredientModal] = useState(false);

  return (
    <Container fluid className="py-4">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm bg-primary border-0 text-light">
            <Card.Header className="bg-primary border-bottom border-light border-opacity-25 py-3">
              <Card.Title className="mb-0 fs-5 fw-bold d-flex align-items-center gap-2">
                Admin Dashboard
              </Card.Title>
            </Card.Header>

            <Card.Body className="p-4">
              <Card.Text className="text-light text-opacity-75 mb-4">
                Select an action below to manage system data and users.
              </Card.Text>

              <Stack gap={3}>
                <Button
                  variant="outline-light"
                  className="fw-semibold d-flex align-items-center justify-content-between p-3"
                  onClick={() => setShowRecipeModal(true)}
                >
                  <span className="d-flex align-items-center gap-2">
                    Create New Recipe
                  </span>
                  <span className="fs-6">→</span>
                </Button>

                <Button
                  variant="outline-light"
                  className="fw-semibold d-flex align-items-center justify-content-between p-3"
                  onClick={() => setShowIngredientModal(true)}
                >
                  <span className="d-flex align-items-center gap-2">
                    Create New Ingredient
                  </span>
                  <span className="fs-6">→</span>
                </Button>

                <Button
                  variant="outline-light"
                  className="fw-semibold d-flex align-items-center justify-content-between p-3"
                  onClick={() => navigate("/admin/users")}
                >
                  <span className="d-flex align-items-center gap-2">
                    Browse Users
                  </span>
                  <span className="fs-6">→</span>
                </Button>
              </Stack>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <CreateRecipeModal
        show={showRecipeModal}
        onHide={() => setShowRecipeModal(false)}
      />
    </Container>
  );
}

export default AdminPage;
