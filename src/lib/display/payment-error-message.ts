class PaymentErrorMessage {
  private static readonly map: { match: RegExp; message: string }[] = [
    {
      match: /already has an appointment/i,
      message: "Você já possui um agendamento neste horário.",
    },
    {
      match: /not (covered|available)|coverage|out of (the )?coverage/i,
      message: "Endereço fora da área de cobertura.",
    },
    {
      match: /time slot|slot.*(unavailable|taken)|unavailable/i,
      message: "Horário indisponível. Escolha outro horário.",
    },
    {
      match: /payment|card|declined|transaction/i,
      message: "Não foi possível processar o pagamento. Verifique os dados do cartão.",
    },
  ];

  static translate(error: string | null): string {
    if (!error) return "Não foi possível concluir o agendamento. Tente novamente.";
    const found = PaymentErrorMessage.map.find((entry) => entry.match.test(error));
    return found ? found.message : error;
  }
}

export { PaymentErrorMessage };
