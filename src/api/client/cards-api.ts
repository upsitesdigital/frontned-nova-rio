import { HttpClient } from "@/api/core/http-client";

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

class CardsApi {
  static listCards(): Promise<Card[]> {
    return HttpClient.authGet<Card[]>("/cards");
  }

  static async removeCard(cardId: number): Promise<void> {
    await HttpClient.authDelete<void>(`/cards/${cardId}`);
  }

  static addCard(data: AddCardRequest): Promise<Card> {
    return HttpClient.authPost<Card>("/cards", data);
  }

  static async setDefaultCard(cardId: number): Promise<void> {
    await HttpClient.authPost<void>(`/cards/${cardId}/default`, {});
  }
}

export { CardsApi, type Card, type AddCardRequest };
