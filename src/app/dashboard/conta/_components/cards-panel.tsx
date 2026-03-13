"use client";

import { useEffect } from "react";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { DsSavedCardItem, DsSavedCardList } from "@/design-system";
import { useCardsStore } from "@/stores/cards-store";
import type { DsCreditCardBrand } from "@/design-system/data-display";
import { AddCardDialog } from "./add-card-dialog";

function normalizeBrand(brand: string): DsCreditCardBrand {
  const lower = brand.toLowerCase();
  if (lower === "visa") return "visa";
  if (lower === "mastercard") return "mastercard";
  return "other";
}

function CardsPanel() {
  const { cards, isLoading, loadCards, removeCard, openAddDialog } = useCardsStore();

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return (
    <div className="flex flex-col gap-6 rounded-4xl border border-nova-gray-100 bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium leading-[1.3] text-black">Cartões cadastrados</h2>
        <button
          type="button"
          onClick={openAddDialog}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          <PlusIcon size={16} weight="bold" />
          Adicionar
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-nova-gray-500">Carregando cartões...</p>
      ) : cards.length === 0 ? (
        <p className="text-sm text-nova-gray-500">Nenhum cartão cadastrado.</p>
      ) : (
        <DsSavedCardList>
          {cards.map((card) => (
            <DsSavedCardItem
              key={card.id}
              lastFour={card.lastFourDigits}
              expiration={`${String(card.expiryMonth).padStart(2, "0")}/${String(card.expiryYear).slice(-2)}`}
              brand={normalizeBrand(card.brand)}
              removeLabel="Remover"
              onRemove={() => removeCard(card.id)}
            />
          ))}
        </DsSavedCardList>
      )}

      <AddCardDialog />
    </div>
  );
}

export { CardsPanel };
