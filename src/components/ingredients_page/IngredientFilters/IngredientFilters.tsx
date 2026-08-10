import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router";

interface IngredientFiltersProps {
  applyFilters?: (newParams: URLSearchParams) => void;
}

function IngredientFilters({ applyFilters }: IngredientFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedSeasonalities = searchParams.getAll("seasonality");

  const filters = {
    name: searchParams.get("name") || "",
    minShelfLifeDays: searchParams.get("minShelfLifeDays") || "",
    maxShelfLifeDays: searchParams.get("maxShelfLifeDays") || "",
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "ASC",
  };

  const handleFilterChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value, type } = e.target;
    const newParams = new URLSearchParams(searchParams);

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;

      newParams.delete(name);

      let updatedSeasonalities: string[];
      if (target.checked) {
        updatedSeasonalities = [...selectedSeasonalities, value];
      } else {
        updatedSeasonalities = selectedSeasonalities.filter(
          (season) => season !== value,
        );
      }

      updatedSeasonalities.forEach((season) => newParams.append(name, season));
    } else {
      if (value) {
        newParams.set(name, value);
      } else {
        newParams.delete(name);
      }
    }

    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    const emptyParams = new URLSearchParams();
    setSearchParams(emptyParams);
    if (applyFilters) applyFilters(emptyParams);
  };

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (applyFilters) applyFilters(searchParams);
  };

  return (
    <Accordion className="mb-4 w-75 mx-auto">
      <Accordion.Item
        eventKey="0"
        className="bg-dark text-light border-0 rounded-3 overflow-hidden"
      >
        <Accordion.Header className="bg-light">
          <span className="fw-bold text-dark">🔍 Filters & Search</span>
        </Accordion.Header>
        <Accordion.Body className="bg-dark text-light">
          <Form onSubmit={handleSubmit}>
            <Row className="g-3">
              <Col xs={12} md={4}>
                <Form.Group controlId="filterName">
                  <Form.Label className="small text-muted mb-1">
                    Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Search item..."
                    value={filters.name}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group controlId="filterSeasonality">
                  <Form.Label className="small text-muted mb-1">
                    Seasonality
                  </Form.Label>
                  <Row xs={1} sm={2}>
                    <Col>
                      <Form.Check
                        name="seasonality"
                        value="SPRING"
                        label="Spring"
                        checked={selectedSeasonalities.includes("SPRING")}
                        onChange={handleFilterChange}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        name="seasonality"
                        value="SUMMER"
                        label="Summer"
                        checked={selectedSeasonalities.includes("SUMMER")}
                        onChange={handleFilterChange}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        name="seasonality"
                        value="AUTUMN"
                        label="Autumn"
                        checked={selectedSeasonalities.includes("AUTUMN")}
                        onChange={handleFilterChange}
                      />
                    </Col>
                    <Col>
                      <Form.Check
                        name="seasonality"
                        value="WINTER"
                        label="Winter"
                        checked={selectedSeasonalities.includes("WINTER")}
                        onChange={handleFilterChange}
                      />
                    </Col>
                  </Row>
                </Form.Group>
              </Col>

              <Col xs={6} md={2}>
                <Form.Group controlId="filterMinShelfLifeDays">
                  <Form.Label className="small text-muted mb-1">
                    Min Shelf Life Days
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="any"
                    name="minShelfLifeDays"
                    value={filters.minShelfLifeDays}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={2}>
                <Form.Group controlId="filterMaxShelfLifeDays">
                  <Form.Label className="small text-muted mb-1">
                    Max Shelf Life Days
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="any"
                    name="maxShelfLifeDays"
                    value={filters.maxShelfLifeDays}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group controlId="filterSortBy">
                  <Form.Label className="small text-muted mb-1">
                    Sort By
                  </Form.Label>
                  <Form.Select
                    name="sortBy"
                    value={filters.sortBy}
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">Choose:</option>
                    <option value="name">Name</option>
                    <option value="purchaseDate">Shelf Life Days</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={6}>
                <Form.Group controlId="filterSortDirection">
                  <Form.Label className="small text-muted mb-1">
                    Direction
                  </Form.Label>
                  <Form.Select
                    name="direction"
                    value={filters.direction}
                    onChange={handleFilterChange}
                    size="sm"
                    disabled={!filters.sortBy}
                  >
                    <option value="ASC">Ascending (ASC)</option>
                    <option value="DESC">Descending (DESC)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-3">
              <Button
                type="button"
                variant="outline-secondary"
                size="sm"
                onClick={handleResetFilters}
              >
                Reset
              </Button>
              <Button
                type="submit"
                variant="light"
                size="sm"
                className="fw-semibold"
              >
                Apply Filters
              </Button>
            </div>
          </Form>
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
}

export default IngredientFilters;
