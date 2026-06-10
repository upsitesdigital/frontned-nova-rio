import { httpAuthGet, httpAuthPost, httpAuthDelete } from "./http-client";

interface Card {
  id: number;
  uuid: string;
  lastFourDigits: string;
  brand: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
}

interface AddCardRequest {
  lastFourDigits: string;
  brand: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  gatewayToken: string;
  isDefault?: boolean;
}

async function listCards(): Promise<Card[]> {
  return httpAuthGet<Card[]>("/cards");
}

async function removeCard(cardId: number): Promise<void> {
  await httpAuthDelete<void>(`/cards/${cardId}`);
}

async function addCard(data: AddCardRequest): Promise<Card> {
  return httpAuthPost<Card>("/cards", data);
}

async function setDefaultCard(cardId: number): Promise<void> {
  await httpAuthPost<void>(`/cards/${cardId}/default`, {});
}

export { listCards, addCard, removeCard, setDefaultCard, type Card, type AddCardRequest };
