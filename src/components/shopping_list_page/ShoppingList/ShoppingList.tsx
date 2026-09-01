import { Badge, Card, Col, Form, Row, Button, Alert } from "react-bootstrap";

import type { ActiveShoppingList } from "../../../interfaces/interfaces";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router";

interface ShoppingListProps {
  activeShoppingList: ActiveShoppingList | null;

  onCompleteShopping?: (selectedItems: SelectedItemsState) => void;

  onDeleteItem: (shoppingListItemId: string) => void;
}

export interface SelectedItemsState {
  [shoppingListItemId: string]: {
    checked: boolean;

    quantity: number;

    expirationDate: string;
  };
}

const getDefaultExpirationDate = (shelfLifeDays: number = 0): string => {
  const date = new Date();

  date.setDate(date.getDate() + shelfLifeDays);

  return date.toISOString().split("T")[0];
};

function ShoppingList({
  activeShoppingList,

  onCompleteShopping,

  onDeleteItem,
}: ShoppingListProps) {
  const navigate = useNavigate();

  const [selectedItems, setSelectedItems] = useState<SelectedItemsState>({});

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedItems({});
  }, [activeShoppingList?.shoppingListId]);

  const handleCheckboxChange = (
    itemId: string,

    isChecked: boolean,

    defaultQuantity: number,

    shelfLifeDays: number,
  ) => {
    setSelectedItems((prev) => ({
      ...prev,

      [itemId]: {
        checked: isChecked,

        quantity: prev[itemId]?.quantity ?? defaultQuantity,

        expirationDate:
          prev[itemId]?.expirationDate ??
          getDefaultExpirationDate(shelfLifeDays),
      },
    }));
  };

  const handleQuantityChange = (itemId: string, rawQuantity: string) => {
    // Se il campo viene svuotato, salviamo la quantità come 0
    const numQuantity = rawQuantity === "" ? 0 : Number(rawQuantity);

    setSelectedItems((prev) => ({
      ...prev,
      [itemId]: {
        checked: false, // Deselezioniamo l'elemento se si modifica la quantità a 0
        expirationDate:
          prev[itemId]?.expirationDate ?? getDefaultExpirationDate(0),
        quantity: numQuantity < 0 ? 0 : numQuantity,
      },
    }));
  };

  const handleDateChange = (itemId: string, newDate: string) => {
    setSelectedItems((prev) => ({
      ...prev,

      [itemId]: {
        checked: prev[itemId]?.checked ?? false,

        quantity: prev[itemId]?.quantity ?? 1,

        expirationDate: newDate,
      },
    }));
  };

  const items = activeShoppingList?.items ?? [];

  const handleCheckAll = () => {
    setSelectedItems((prev) => {
      const updated: SelectedItemsState = { ...prev };

      items.forEach((item) => {
        const { shoppingListItemId, suggestedQuantity, ingredientDefinition } =
          item;

        const currentQty =
          prev[shoppingListItemId]?.quantity ?? suggestedQuantity ?? 1;

        updated[shoppingListItemId] = {
          checked: Number(currentQty) > 0,
          quantity: currentQty,
          expirationDate:
            prev[shoppingListItemId]?.expirationDate ??
            getDefaultExpirationDate(ingredientDefinition.shelfLifeDays ?? 0),
        };
      });

      return updated;
    });
  };

  const handleUncheckAll = () => {
    setSelectedItems((prev) => {
      const updated: SelectedItemsState = { ...prev };

      items.forEach((item) => {
        const { shoppingListItemId } = item;

        if (updated[shoppingListItemId]) {
          updated[shoppingListItemId] = {
            ...updated[shoppingListItemId],

            checked: false,
          };
        }
      });

      return updated;
    });
  };

  const totalItems = activeShoppingList?.items.length ?? 0;

  const completedCount = Object.values(selectedItems).filter(
    (item) => item.checked,
  ).length;

  const handleComplete = () => {
    if (onCompleteShopping) {
      onCompleteShopping(selectedItems);
    }
  };

  return (
    <div className="shopping-list-container overflow-hidden w-100 pb-5 mb-5">
      <Row
        xs={1}
        sm={2}
        md={3}
        lg={4}
        className={
          items.length <= 0
            ? "g-2 g-sm-3 mx-0 d-flex justify-content-center"
            : "g-2 g-sm-3 mx-0 d-flex mb-5 mb-md-0 pb-2 pb-md-0"
        }
      >
        {items.length <= 0 ? (
          <div className="d-flex flex-column align-items-center mt-4">
            <Alert className="text-center">
              This shopping list is empty, try adding some ingredients!
            </Alert>

            <div className="d-flex justify-content-around gap-3">
              <Button
                variant="secondary"
                className="fw-semibold z-1 border-black shadow-lg"
                onClick={() => navigate("/recipes")}
              >
                Browse Recipes
              </Button>

              <Button
                variant="warning"
                className="fw-semibold z-1 border-black shadow-lg"
                onClick={() => navigate("/ingredients")}
              >
                Browse Ingredients
              </Button>
            </div>
          </div>
        ) : (
          activeShoppingList?.items.map((item) => {
            const {
              ingredientDefinition,

              suggestedQuantity,

              shoppingListItemId,
            } = item;

            const { name, imageUrl, category, shelfLifeDays } =
              ingredientDefinition;

            const isChecked =
              selectedItems[shoppingListItemId]?.checked ?? false;

            const currentQuantity =
              selectedItems[shoppingListItemId]?.quantity ??
              suggestedQuantity ??
              "";

            const defaultDate = getDefaultExpirationDate(shelfLifeDays);

            const currentDate =
              selectedItems[shoppingListItemId]?.expirationDate ?? defaultDate;

            return (
              <Col
                key={shoppingListItemId}
                className="d-flex align-items-center px-1"
                style={{ minWidth: 0 }}
              >
                <Card
                  className="h-100 w-100 shadow-sm hover-card bg-primary d-flex flex-row align-items-center justify-content-between position-relative overflow-hidden pe-2"
                  style={{
                    minWidth: 0,
                    cursor: isChecked ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (isChecked) {
                      handleCheckboxChange(
                        shoppingListItemId,

                        false,

                        suggestedQuantity ?? 1,

                        shelfLifeDays ?? 0,
                      );
                    }
                  }}
                >
                  {isChecked && (
                    <div
                      className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center text-warning"
                      style={{
                        backgroundColor: "rgba(0, 0, 0, 0.45)",

                        fontSize: "3rem",

                        fontWeight: "bold",

                        zIndex: 10,

                        pointerEvents: "none",

                        lineHeight: 1,

                        userSelect: "none",
                      }}
                    >
                      ✅
                    </div>
                  )}

                  {imageUrl && (
                    <div
                      className="d-none d-sm-flex align-items-center justify-content-center p-1 flex-shrink-1"
                      style={{
                        width: "25%",

                        minWidth: "40px",

                        maxWidth: "120px",
                      }}
                    >
                      <Card.Img
                        src={imageUrl}
                        alt={name}
                        style={{
                          width: "100%",

                          aspectRatio: "1",

                          objectFit: "cover",

                          borderRadius: "6px",
                        }}
                      />
                    </div>
                  )}

                  <Card.Body
                    className="d-flex flex-column flex-grow-1 p-2 overflow-hidden"
                    style={{ minWidth: 0 }}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center mb-1 gap-1"
                      style={{ minWidth: 0 }}
                    >
                      <Card.Title
                        className="mb-0 fs-6 fw-bold text-truncate"
                        style={{ minWidth: 0 }}
                      >
                        {name}
                      </Card.Title>

                      <Badge
                        bg="secondary"
                        className="text-dark flex-shrink-0 px-1"
                        style={{ fontSize: "0.65rem" }}
                      >
                        {category}
                      </Badge>
                    </div>

                    <Form.Group
                      controlId={`quantity-${shoppingListItemId}`}
                      className="mb-1"
                      style={{ minWidth: 0 }}
                    >
                      <Form.Label
                        className="mb-0"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Quantity
                      </Form.Label>

                      <Form.Control
                        type="number"
                        min="0"
                        value={currentQuantity === 0 ? "" : currentQuantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            shoppingListItemId,
                            e.target.value,
                          )
                        }
                        disabled={isChecked}
                        size="sm"
                        className="px-1 py-0"
                        style={{
                          fontSize: "0.8rem",
                          height: "auto",
                          minWidth: "0px",
                          width: "100%",
                        }}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId={`expiration-${shoppingListItemId}`}
                      style={{ minWidth: 0 }}
                    >
                      <Form.Label
                        className="mb-0"
                        style={{ fontSize: "0.7rem" }}
                      >
                        Expiration Date
                      </Form.Label>

                      <Form.Control
                        type="date"
                        value={currentDate}
                        onChange={(e) =>
                          handleDateChange(shoppingListItemId, e.target.value)
                        }
                        disabled={isChecked}
                        size="sm"
                        className="px-1 py-0"
                        style={{
                          fontSize: "0.75rem",

                          height: "auto",

                          minWidth: "0px",

                          width: "100%",
                        }}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId={`bought-${shoppingListItemId}`}
                      style={{ minWidth: 0 }}
                      className="d-flex gap-2 my-1 align-items-center"
                    >
                      <Form.Label
                        className="mb-0 fs-6 text-warning"
                        style={{ fontSize: "0.7rem" }}
                      >
                        In Cart:
                      </Form.Label>

                      <Form.Check
                        className="me-2 flex-shrink-0 align-self-end"
                        disabled={
                          !currentQuantity || Number(currentQuantity) <= 0
                        }
                        checked={isChecked}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleCheckboxChange(
                            shoppingListItemId,

                            e.target.checked,

                            suggestedQuantity ?? 1,

                            shelfLifeDays ?? 0,
                          )
                        }
                      />
                    </Form.Group>
                  </Card.Body>

                  <Button
                    variant="secondary"
                    disabled={isChecked}
                    onClick={(e) => {
                      e.stopPropagation();

                      onDeleteItem(shoppingListItemId);
                    }}
                  >
                    <i className="bi bi-trash3-fill"></i>
                  </Button>
                </Card>
              </Col>
            );
          })
        )}
      </Row>

      <div
        className="position-fixed bottom-0 start-0 w-100 bg-dark text-white p-2 p-md-3 shadow-lg border-top d-flex gap-2 flex-wrap justify-content-between align-items-center"
        style={{ zIndex: 1000 }}
      >
        <div className="d-flex flex-row flex-wrap gap-1">
          <span className="fw-bold small">Progress:</span>

          <span className="text-warning small">
            {completedCount} of {totalItems} items checked
          </span>
        </div>

        <div className="d-flex gap-2 flex-wrap align-items-center">
          <Button
            variant="outline-light"
            size="sm"
            className="fw-semibold"
            disabled={items.length === 0 || completedCount === totalItems}
            onClick={handleCheckAll}
          >
            Check All
          </Button>

          <Button
            variant="outline-light"
            size="sm"
            className="fw-semibold"
            disabled={completedCount === 0}
            onClick={handleUncheckAll}
          >
            Uncheck All
          </Button>

          <Button
            variant="warning"
            size="sm"
            className="fw-bold px-4"
            disabled={completedCount === 0}
            onClick={handleComplete}
            style={{ cursor: completedCount > 0 ? "pointer" : "not-allowed" }}
          >
            {completedCount <= 0 ? "Buy anything first" : "Complete"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ShoppingList;
