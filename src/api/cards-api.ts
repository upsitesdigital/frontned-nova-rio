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

async function listCards(token: string): Promise<Card[]> {
  return httpAuthGet<Card[]>("/cards", token);
}

async function removeCard(token: string, cardId: number): Promise<void> {
  await httpAuthDelete<void>(`/cards/${cardId}`, token);
}

async function addCard(token: string, data: AddCardRequest): Promise<Card> {
  return httpAuthPost<Card>("/cards", data, token);
}

async function setDefaultCard(token: string, cardId: number): Promise<void> {
  await httpAuthPost<void>(`/cards/${cardId}/default`, {}, token);
}

export { listCards, addCard, removeCard, setDefaultCard, type Card, type AddCardRequest };
