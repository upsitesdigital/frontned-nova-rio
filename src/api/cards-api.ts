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

interface TokenizeCardRequest {
  cardNumber: string;
  cardCvv: string;
  holderName: string;
  expiryMonth: number;
  expiryYear: number;
  brand: string;
}

interface TokenizeCardResponse {
  gatewayToken: string;
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

async function tokenizeCard(data: TokenizeCardRequest): Promise<TokenizeCardResponse> {
  return httpAuthPost<TokenizeCardResponse>("/cards/tokenize", data);
}

async function addCard(data: AddCardRequest): Promise<Card> {
  return httpAuthPost<Card>("/cards", data);
}

async function setDefaultCard(cardId: number): Promise<void> {
  await httpAuthPost<void>(`/cards/${cardId}/default`, {});
}

export {
  listCards,
  tokenizeCard,
  addCard,
  removeCard,
  setDefaultCard,
  type Card,
  type TokenizeCardRequest,
  type TokenizeCardResponse,
  type AddCardRequest,
};
