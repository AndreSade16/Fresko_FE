import { Container } from "react-bootstrap";
import IngredientFilters from "./IngredientFilters/IngredientFilters";
import type { AppDispatch, RootState } from "../../redux/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { fetchIngredients } from "../../redux/reducers/IngredientDefinitionSlice";
import IngredientsList from "./IngredientsList/IngredientsList";
import { GridLoader } from "react-spinners";
import IngredientAddModal from "./IngredientAddModal/IngredientAddModal";
import type {
  IngredientDefinitionPageContent,
  ShoppingListItemCreatedDTO,
  StandardError,
} from "../../interfaces/interfaces";
import { apiFetch } from "../../tools/fetchHelper";
import { fetchActiveShoppingList } from "../../redux/reducers/ShoppingListSlice";
import { toast } from "react-toastify";

function IngredientPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchParams] = useSearchParams();
  const [selectedItem, setSelectedItem] =
    useState<IngredientDefinitionPageContent | null>(null);

  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState<boolean>(false);

  const { data, isLoading, error } = useSelector(
    (state: RootState) => state.ingredientDefinitions,
  );

  const activeShoppingList = useSelector(
    (state: RootState) => state.shoppingList,
  );

  const userRole = useSelector((state: RootState) => state.user.role);

  const handleLoadMore = (nextPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", nextPage.toString());

    dispatch(fetchIngredients(newParams));
  };

  useEffect(() => {
    dispatch(fetchActiveShoppingList());
  }, [dispatch]);

  useEffect(() => {
    const fetchIngredientsList = (params: URLSearchParams) => {
      dispatch(fetchIngredients(params));
    };

    const timer = setTimeout(() => {
      fetchIngredientsList(searchParams);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchParams, dispatch]);

  const hasInitialData = Boolean(
    data && data.content && data.content.length > 0,
  );

  const handleAdd = async (quantity: number) => {
    const shoppingListId = activeShoppingList.data?.shoppingListId;

    if (!selectedItem || !shoppingListId) {
      toast.error("Shopping list not found. Please try again.");
      return;
    }

    setIsAdding(true);
    setErrorMessage(null);

    const currentName = selectedItem.name;

    try {
      await apiFetch<ShoppingListItemCreatedDTO>(
        "/shopping-lists/me/" + shoppingListId + "/items",
        {
          method: "POST",
          body: JSON.stringify({
            ingredientDefinitionId: selectedItem.ingredientDefinitionId,
            suggestedQuantity: quantity,
          }),
        },
      );

      toast.success(`${currentName} added to your shopping list!`);

      dispatch(fetchActiveShoppingList());
    } catch (error: unknown) {
      let message = "An error occurred while adding the ingredient.";
      if (typeof error === "object" && error !== null && "message" in error) {
        message = (error as StandardError).message;
      }
      toast.error(message);
      setErrorMessage(message);
    } finally {
      setIsAdding(false);
      setShowAddModal(false);
      setSelectedItem(null);
    }
  };

  return (
    <Container fluid className=" d-flex flex-column align-items-center">
      <h1 className="fst-italic my-5 text-left w-100 ps-2 fw-bolder">
        Ingredients
      </h1>

      <IngredientFilters />

      {isLoading && !hasInitialData ? (
        <GridLoader color="white" className="mt-5 pt-2" />
      ) : (
        <IngredientsList
          data={data}
          isLoading={isLoading}
          userRole={userRole}
          error={error || errorMessage}
          onLoadMore={handleLoadMore}
          onDeleteItem={(item) => {
            setSelectedItem(item);
          }}
          onAddItem={(item) => {
            setShowAddModal(true);
            setSelectedItem(item);
          }}
          isAdding={isAdding}
          setIsAdding={setIsAdding}
        />
      )}

      <IngredientAddModal
        selectedItem={selectedItem}
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        onConfirmAdd={(quantity) => handleAdd(quantity)}
        isAdding={isAdding}
      />
    </Container>
  );
}

export default IngredientPage;
