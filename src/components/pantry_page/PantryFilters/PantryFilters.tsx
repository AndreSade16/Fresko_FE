import { Accordion, Button, Col, Form, Row } from "react-bootstrap";
import { useSearchParams } from "react-router";

interface PantryFiltersProps {
  applyFilters?: (newParams: URLSearchParams) => void;
}

function PantryFilters({ applyFilters }: PantryFiltersProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = {
    name: searchParams.get("name") || "",
    minQuantity: searchParams.get("minQuantity") || "",
    maxQuantity: searchParams.get("maxQuantity") || "",
    minPurchaseDate: searchParams.get("minPurchaseDate") || "",
    maxPurchaseDate: searchParams.get("maxPurchaseDate") || "",
    minExpirationDate: searchParams.get("minExpirationDate") || "",
    maxExpirationDate: searchParams.get("maxExpirationDate") || "",
    storageLocation: searchParams.get("storageLocation") || "",
    sortBy: searchParams.get("sortBy") || "",
    direction: searchParams.get("direction") || "ASC",
  };

  const handleFilterChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    const newParams = new URLSearchParams(searchParams);

    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
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
    <Accordion className="mb-4 w-75 mx-auto z-1">
      <Accordion.Item
        eventKey="0"
        className="bg-dark text-light border-0 rounded-3 overflow-hidden"
      >
        <Accordion.Header className="bg-light">
          <span className="fw-bold text-dark">🔍 Filters & Search</span>
        </Accordion.Header>
        <Accordion.Body className="bg-primary text-light">
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
                <Form.Group controlId="filterStorageLocation">
                  <Form.Label className="small text-muted mb-1">
                    Storage Location
                  </Form.Label>
                  <Form.Select
                    name="storageLocation"
                    value={filters.storageLocation}
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All Locations</option>
                    <option value="REFRIGERATOR">Fridge</option>
                    <option value="PANTRY">Pantry</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={6} md={2}>
                <Form.Group controlId="filterMinQuantity">
                  <Form.Label className="small text-muted mb-1">
                    Min Qty
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="any"
                    name="minQuantity"
                    value={filters.minQuantity}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={2}>
                <Form.Group controlId="filterMaxQuantity">
                  <Form.Label className="small text-muted mb-1">
                    Max Qty
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="any"
                    name="maxQuantity"
                    value={filters.maxQuantity}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={3}>
                <Form.Group controlId="filterMinPurchaseDate">
                  <Form.Label className="small text-muted mb-1">
                    Purchased From
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="minPurchaseDate"
                    value={filters.minPurchaseDate}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={3}>
                <Form.Group controlId="filterMaxPurchaseDate">
                  <Form.Label className="small text-muted mb-1">
                    Purchased To
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="maxPurchaseDate"
                    value={filters.maxPurchaseDate}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={3}>
                <Form.Group controlId="filterMinExpirationDate">
                  <Form.Label className="small text-muted mb-1">
                    Expires From
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="minExpirationDate"
                    value={filters.minExpirationDate}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={3}>
                <Form.Group controlId="filterMaxExpirationDate">
                  <Form.Label className="small text-muted mb-1">
                    Expires To
                  </Form.Label>
                  <Form.Control
                    type="date"
                    name="maxExpirationDate"
                    value={filters.maxExpirationDate}
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
                    <option value="expirationDate">Expiration Date</option>
                    <option value="purchaseDate">Purchase Date</option>
                    <option value="quantity">Quantity</option>
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

export default PantryFilters;
