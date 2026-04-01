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
    paymentsLoadError: "Erro ao carregar dados de pagamento.",
  },

  adminDashboard: {
    loadError: "Erro ao carregar o painel administrativo. Tente novamente.",
  },

  agenda: {
    loadError: "Erro ao carregar a agenda. Tente novamente.",
  },

  scheduling: {
    loadTimeSlotsError: "Erro ao carregar horários.",
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

  services: {
    loadError: "Erro ao carregar serviços.",
  },

  registration: {
    genericError: "Erro ao cadastrar. Tente novamente.",
  },

  adminAppointments: {
    loadError: "Erro ao carregar agendamentos. Tente novamente.",
    createSuccess: "Agendamento criado com sucesso!",
    createError: "Erro ao criar agendamento. Tente novamente.",
    updateSuccess: "Agendamento atualizado com sucesso!",
    updateError: "Erro ao atualizar agendamento. Tente novamente.",
    rescheduleSuccess: "Agendamento remarcado com sucesso!",
    rescheduleError: "Erro ao remarcar agendamento. Tente novamente.",
    cancelSuccess: "Agendamento cancelado com sucesso!",
    cancelError: "Erro ao cancelar agendamento. Tente novamente.",
    completeSuccess: "Agendamento concluido com sucesso!",
    completeError: "Erro ao concluir agendamento. Tente novamente.",
    optionsError: "Erro ao carregar opções do formulário.",
    employeesError: "Erro ao carregar funcionários.",
    unitsError: "Erro ao carregar unidades.",
    clientsError: "Erro ao carregar clientes.",
    servicesError: "Erro ao carregar serviços.",
    requiredService: "Selecione o tipo de serviço.",
    requiredClient: "Selecione o cliente.",
    requiredDate: "Selecione a data.",
    requiredTime: "Selecione o horário.",
  },

  adminClients: {
    loadError: "Erro ao carregar clientes.",
    approveError: "Erro ao aprovar cliente. Tente novamente.",
    rejectError: "Erro ao reprovar cliente. Tente novamente.",
  },

  adminEmployees: {
    loadError: "Erro ao carregar funcionários.",
    loadDetailError: "Erro ao carregar funcionário.",
    saveSuccess: "Funcionário salvo com sucesso",
    saveError: "Erro ao salvar funcionário.",
    scheduleError: "Erro ao carregar agenda.",
  },

  adminPayments: {
    loadError: "Erro ao carregar pagamentos.",
    detailError: "Erro ao carregar detalhes do pagamento.",
  },

  adminServices: {
    loadError: "Erro ao carregar serviços.",
    createError: "Erro ao criar serviço.",
    updateError: "Erro ao atualizar serviço.",
    deleteError: "Erro ao excluir serviço.",
    requiredName: "Informe o nome do serviço.",
    requiredDescription: "Informe a descrição do serviço.",
    invalidPrice: "Informe um preço válido para o serviço.",
    updateSuccess: "Serviço atualizado com sucesso!",
    deleteSuccess: "Serviço excluído com sucesso!",
  },

  adminUnits: {
    loadError: "Erro ao carregar unidades.",
    createError: "Erro ao criar unidade.",
    updateError: "Erro ao atualizar unidade.",
    deleteError: "Erro ao excluir unidade.",
    requiredName: "Informe o nome da unidade.",
    invalidLatitude: "Informe uma latitude válida.",
    invalidLongitude: "Informe uma longitude válida.",
    invalidRadius: "Informe um raio de cobertura válido.",
    createSuccess: "Unidade criada com sucesso!",
    updateSuccess: "Unidade atualizada com sucesso!",
    deleteSuccess: "Unidade excluída com sucesso!",
  },

  adminPackages: {
    loadError: "Erro ao carregar pacotes.",
    createError: "Erro ao criar pacote.",
    updateError: "Erro ao atualizar pacote.",
    deactivateError: "Erro ao inativar pacote.",
    reactivateError: "Erro ao reativar pacote.",
    serviceOptionsError: "Erro ao carregar opções de serviços.",
    requiredName: "Informe o nome do pacote.",
    requiredService: "Selecione um serviço.",
    invalidPrice: "Informe um preço válido.",
    invalidTotalHours: "Informe a quantidade de horas válida.",
    createSuccess: "Pacote criado com sucesso!",
    updateSuccess: "Pacote atualizado com sucesso!",
    deactivateSuccess: "Pacote inativado com sucesso!",
    reactivateSuccess: "Pacote reativado com sucesso!",
  },

  adminHolidays: {
    loadError: "Erro ao carregar feriados.",
    createError: "Erro ao criar feriado.",
    updateError: "Erro ao atualizar feriado.",
    deleteError: "Erro ao excluir feriado.",
    syncError: "Erro ao sincronizar feriados.",
    requiredDate: "Informe a data do feriado.",
    requiredName: "Informe o nome do feriado.",
    invalidYear: "Informe um ano válido para sincronizar.",
    createSuccess: "Feriado criado com sucesso!",
    updateSuccess: "Feriado atualizado com sucesso!",
    deleteSuccess: "Feriado excluído com sucesso!",
    syncSuccess: (count: number) => `${count} feriados sincronizados com sucesso!`,
  },

  adminUsers: {
    loadError: "Erro ao carregar usuários.",
    detailError: "Erro ao carregar detalhes do usuário.",
    createError: "Erro ao criar usuário.",
    deactivateError: "Erro ao excluir usuário.",
    requiredName: "Informe o nome do usuário.",
    requiredEmail: "Informe o e-mail do usuário.",
    invalidEmail: "Informe um e-mail válido.",
    requiredPassword: "Informe a senha do usuário.",
  },

  adminReports: {
    summaryLoadError: "Erro ao carregar o resumo de relatórios.",
    activeClientsLoadError: "Erro ao carregar clientes ativos.",
    transactionsLoadError: "Erro ao carregar dados de faturamento.",
    hoursByServiceLoadError: "Erro ao carregar horas por serviço.",
    exportError: "Erro ao exportar relatório.",
    exportSuccess: "Relatório exportado com sucesso!",
  },

  address: {
    outOfCoverage: "Endereço fora da área de atendimento.",
    validationError: "Erro ao validar o endereço. Tente novamente.",
  },

  payment: {
    missingEmail: "E-mail não cadastrado. Volte ao passo de cadastro.",
    missingService: "Nenhum serviço selecionado.",
    missingDateTime: "Data e horário não selecionados.",
    createAppointmentError: "Erro ao criar agendamento.",
  },
} as const;

export { MESSAGES };
