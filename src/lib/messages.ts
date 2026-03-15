const MESSAGES = {
  auth: {
    sessionExpired: "Sessão expirada. Faça login novamente.",
    fillAllFields: "Preencha todos os campos.",
    invalidEmail: "Formato de e-mail inválido.",
    wrongCredentials: "E-mail ou senha incorretos.",
    loginError: "Erro ao entrar. Tente novamente.",
    pendingApproval: "Seu cadastro está em análise. Aguarde a aprovação para fazer login.",
  },

  password: {
    mismatch: "As senhas não coincidem.",
    weak: "A senha deve conter pelo menos 8 caracteres, maiúscula, minúscula, número e símbolo.",
    requestError: "Erro ao solicitar alteração de senha.",
    verifyError: "Erro ao alterar senha. Tente novamente.",
    changed: "Senha alterada com sucesso!",
    resetSendError: "Erro ao enviar código. Tente novamente.",
    resetError: "Erro ao redefinir senha. Tente novamente.",
    fillEmail: "Preencha o campo de e-mail.",
  },

  email: {
    requestError: "Erro ao solicitar alteração de e-mail.",
    verifyError: "Erro ao verificar código. Tente novamente.",
    changed: "E-mail alterado com sucesso!",
  },

  profile: {
    loadError: "Erro ao carregar o perfil. Tente novamente.",
    saveError: "Erro ao salvar o perfil. Tente novamente.",
    updated: "Perfil atualizado com sucesso!",
    deleteError: "Erro ao excluir conta. Tente novamente.",
  },

  dashboard: {
    loadError: "Erro ao carregar o painel. Tente novamente.",
  },

  appointments: {
    selectDateTime: "Selecione a data e o horário.",
    rescheduleSuccess: "Agendamento atualizado com sucesso!",
    rescheduleError: "Erro ao reagendar. Tente novamente.",
    cancelSuccess: "Agendamento cancelado com sucesso!",
    cancelError: "Erro ao cancelar. Tente novamente.",
  },

  cards: {
    loadError: "Erro ao carregar cartões.",
    addSuccess: "Cartão adicionado com sucesso",
    addError: "Erro ao adicionar cartão",
    removeSuccess: "Cartão removido com sucesso",
    removeError: "Erro ao remover cartão",
    invalidNumber: "Número do cartão inválido",
    missingHolder: "Informe o nome impresso no cartão",
    missingMonth: "Selecione o mês",
    missingYear: "Selecione o ano",
    missingCvv: "Informe o CVV",
    invalidCvv: "CVV inválido",
    tokenizeError: "Erro ao processar dados do cartão",
  },

  payments: {
    loadError: "Erro ao carregar pagamentos",
  },
} as const;

export { MESSAGES };
