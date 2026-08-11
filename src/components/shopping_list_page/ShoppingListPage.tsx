import { Alert, Button, Container } from "react-bootstrap";
import ShoppingList, {
  type SelectedItemsState,
} from "./ShoppingList/ShoppingList";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../redux/store";
import { useEffect, useState } from "react";
import { fetchActiveShoppingList } from "../../redux/reducers/ShoppingListSlice";
import SlCompletedModal from "./SlCompletedModal/SlCompletedModal";
import {
  type ShoppingListCompletedDTO,
  type ShoppingListCreatedDTO,
  type ShoppingListItem,
  type StandardError,
} from "../../interfaces/interfaces";
import { toast } from "react-toastify";
import { apiFetch } from "../../tools/fetchHelper";

function ShoppingListPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [showCompleteModal, setShowCompleteModal] = useState<boolean>(false);
  const [itemsOnList, setItemsOnList] = useState<ShoppingListItem[] | null>(
    null,
  );
  const activeShoppingList = useSelector(
    (state: RootState) => state.shoppingList.data,
  );

  useEffect(() => {
    dispatch(fetchActiveShoppingList());
  }, [dispatch]);

  const handleComplete = async (selectedItems: SelectedItemsState) => {
    if (!activeShoppingList?.items) return;

    const itemsBought = activeShoppingList.items
      .filter((item) => selectedItems[item.shoppingListItemId]?.checked)
      .map((item) => ({
        ...item,
        purchasedQuantity: selectedItems[item.shoppingListItemId].quantity,
        expirationDate: selectedItems[item.shoppingListItemId].expirationDate,
      }));

    setItemsOnList(itemsBought);
    setShowCompleteModal(true);
  };

  const handleSlCreation = async () => {
    if (activeShoppingList) return;

    try {
      const response = await apiFetch<ShoppingListCreatedDTO>(
        "/shopping-lists",
        {
          method: "POST",
        },
      );

      if (response.shoppingListId) {
        toast.success("Shopping list created!");
        dispatch(fetchActiveShoppingList());
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        toast.error((error as StandardError).message);
      }
    }
  };

  const handleSubmit = async () => {
    setShowCompleteModal(false);

    try {
      const payload = { items: itemsOnList };

      const body = JSON.stringify(payload);
      const response = await apiFetch<ShoppingListCompletedDTO>(
        "/shopping-lists/" + activeShoppingList?.shoppingListId + "/complete",
        {
          method: "POST",
          body: body,
        },
      );
      if (response.shoppingListId) {
        toast.success("Your shopping list has been completed!");
      }
      dispatch(fetchActiveShoppingList());
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "message" in error) {
        toast.error((error as StandardError).message);
      }
    }
  };

  return (
    <Container fluid className=" d-flex flex-column align-items-center">
      <h1 className="fst-italic my-5 text-left w-100 ps-2 fw-bolder">
        Shopping List
      </h1>

      {activeShoppingList ? (
        <ShoppingList
          activeShoppingList={activeShoppingList}
          onCompleteShopping={handleComplete}
        />
      ) : (
        <div className="d-flex flex-column align-items-center mt-4">
          <Alert>No active shopping list found</Alert>
          <Button
            variant="secondary"
            className="fw-semibold"
            onClick={handleSlCreation}
          >
            Create a Shopping List!
          </Button>
        </div>
      )}
      <SlCompletedModal
        showCompleteModal={showCompleteModal}
        setShowCompleteModal={setShowCompleteModal}
        itemsOnList={itemsOnList}
        onComplete={handleSubmit}
      />
    </Container>
  );
}

export default ShoppingListPage;
