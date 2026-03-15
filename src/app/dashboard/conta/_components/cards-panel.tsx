"use client";

import { useEffect } from "react";
import { PlusIcon } from "@phosphor-icons/react/dist/ssr";
import { DsSavedCardItem, DsSavedCardList } from "@/design-system";
import { useCardsStore } from "@/stores/cards-store";
import { normalizeBrand } from "@/lib/card-format";
import { AddCardDialog } from "./add-card-dialog";

function CardsPanel() {
  const { cards, isLoading, loadCards, removeCard, openAddDialog } = useCardsStore();

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return (
    <div className="flex w-125 flex-col gap-6 rounded-4xl border border-nova-gray-100 bg-white px-6 py-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-medium leading-[1.3] text-black">Cartões cadastrados</h2>
        <button
          type="button"
          onClick={openAddDialog}
          className="flex items-center gap-2 text-base font-medium leading-[1.3] text-nova-gray-700 hover:underline"
        >
          <PlusIcon size={20} weight="bold" />
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
