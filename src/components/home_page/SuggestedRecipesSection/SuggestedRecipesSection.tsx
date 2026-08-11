import { Button, Card, Col, Row } from "react-bootstrap";
import type { SuggestedRecipe } from "../../../interfaces/interfaces";
import { useNavigate } from "react-router";
import { SyncLoader } from "react-spinners";

interface SuggestedRecipesSectionProps {
  suggestedRecipes: SuggestedRecipe[] | null;
  isLoading: boolean;
}

function SuggestedRecipesSection({
  suggestedRecipes,
  isLoading,
}: SuggestedRecipesSectionProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="border-0 rounded-4 overflow-hidden shadow-lg position-relative my-5 mx-lg-4 bg-dark"
      style={{ minWidth: "195px" }}
    >
      <Card.Body
        className="position-relative p-0 text-light"
        style={{ zIndex: 2 }}
      >
        <div className="d-flex justify-content-between align-items-start mb-4">
          <h2 className="fw-bold m-0 fst-italic text-light">
            Suggested Recipes
          </h2>
        </div>

        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center py-4">
            <SyncLoader color="#ffffff" />
          </div>
        ) : suggestedRecipes && suggestedRecipes.length > 0 ? (
          <Row className="g-3">
            {suggestedRecipes.map((recipe) => (
              <Col key={recipe.id} xs={12} md={6} lg={4}>
                <Card
                  className="bg-primary text-light border-0 rounded-3 shadow-sm overflow-hidden"
                  style={{ height: "115px" }}
                >
                  <div className="d-flex h-100">
                    <img
                      src={
                        recipe.imageUrl ||
                        "https://via.placeholder.com/150?text=Food"
                      }
                      alt={recipe.name}
                      className="object-fit-cover flex-shrink-0"
                      style={{
                        width: "115px",
                        height: "100%",
                      }}
                    />

                    <Card.Body className="d-flex flex-column justify-content-center p-2 ps-3 overflow-hidden">
                      <span
                        className="text-light opacity-75 small text-uppercase fw-bold d-none d-sm-block"
                        style={{ fontSize: "0.75rem", lineHeight: "1.2" }}
                      >
                        Difficulty: {recipe.difficulty.replace("_", " ")}
                      </span>
                      <span
                        className="text-light opacity-75 small text-uppercase fw-bold d-none d-sm-block"
                        style={{ fontSize: "0.75rem", lineHeight: "1.2" }}
                      >
                        Cost: {recipe.cost}
                      </span>
                      <h6 className="fw-semibold m-0 my-1 fs-6">
                        {recipe.name}
                      </h6>
                      <span
                        className="text-light opacity-75 small text-uppercase fw-bold d-none d-sm-block text-truncate"
                        style={{ fontSize: "0.75rem", lineHeight: "1.2" }}
                      >
                        Time: {recipe.totalTime} min
                      </span>
                    </Card.Body>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="text-muted m-0">No suggested recipes...</p>
        )}

        <div className="mt-4 text-center">
          <Button
            variant="secondary"
            className="w-100 py-2 text-dark fw-bold border-1 border-dark shadow-sm rounded-3"
            style={{ maxWidth: "280px" }}
            onClick={() => navigate("/recipes")}
          >
            Browse all
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

export default SuggestedRecipesSection;
