class Messages {
  static readonly auth = {
    sessionExpired: "Sessão expirada. Faça login novamente.",
    fillAllFields: "Preencha todos os campos.",
    invalidEmail: "Formato de e-mail inválido.",
    wrongCredentials: "E-mail ou senha incorretos.",
    loginError: "Erro ao entrar. Tente novamente.",
    pendingApproval: "Seu cadastro está em análise. Aguarde a aprovação para fazer login.",
  };

  static readonly password = {
    mismatch: "As senhas não coincidem.",
    weak: "A senha deve conter pelo menos 8 caracteres, maiúscula, minúscula, número e símbolo.",
    requestError: "Erro ao solicitar alteração de senha.",
    verifyError: "Erro ao alterar senha. Tente novamente.",
    changed: "Senha alterada com sucesso!",
    resetSendError: "Erro ao enviar código. Tente novamente.",
    resetError: "Erro ao redefinir senha. Tente novamente.",
    fillEmail: "Preencha o campo de e-mail.",
  };

  static readonly email = {
    requestError: "Erro ao solicitar alteração de e-mail.",
    verifyError: "Erro ao verificar código. Tente novamente.",
    changed: "E-mail alterado com sucesso!",
  };

  static readonly profile = {
    loadError: "Erro ao carregar o perfil. Tente novamente.",
    saveError: "Erro ao salvar o perfil. Tente novamente.",
    updated: "Perfil atualizado com sucesso!",
    deleteError: "Erro ao excluir conta. Tente novamente.",
  };

  static readonly dashboard = {
    loadError: "Erro ao carregar o painel. Tente novamente.",
    paymentsLoadError: "Erro ao carregar dados de pagamento.",
  };

  static readonly adminDashboard = {
    loadError: "Erro ao carregar o painel administrativo. Tente novamente.",
  };

  static readonly agenda = {
    loadError: "Erro ao carregar a agenda. Tente novamente.",
  };

  static readonly scheduling = {
    loadTimeSlotsError: "Erro ao carregar horários.",
  };

  static readonly appointments = {
    selectDateTime: "Selecione a data e o horário.",
    rescheduleSuccess: "Agendamento atualizado com sucesso!",
    rescheduleError: "Erro ao reagendar. Tente novamente.",
    cancelSuccess: "Agendamento cancelado com sucesso!",
    cancelError: "Erro ao cancelar. Tente novamente.",
  };

  static readonly cards = {
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
  };

  static readonly payments = {
    loadError: "Erro ao carregar pagamentos",
  };

  static readonly services = {
    loadErrorTitle: "Ops, algo deu errado",
    loadError:
      "Tivemos um problema técnico ao carregar os serviços. Nossa equipe já está trabalhando nisso. Tente novamente em instantes.",
    retry: "Tentar novamente",
  };

  static readonly registration = {
    genericError: "Erro ao cadastrar. Tente novamente.",
  };

  static readonly adminAppointments = {
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
  };

  static readonly adminClients = {
    loadError: "Erro ao carregar clientes.",
    approveError: "Erro ao aprovar cliente. Tente novamente.",
    rejectError: "Erro ao reprovar cliente. Tente novamente.",
  };

  static readonly adminEmployees = {
    loadError: "Erro ao carregar funcionários.",
    loadDetailError: "Erro ao carregar funcionário.",
    saveSuccess: "Funcionário salvo com sucesso",
    saveError: "Erro ao salvar funcionário.",
    scheduleError: "Erro ao carregar agenda.",
  };

  static readonly adminPayments = {
    loadError: "Erro ao carregar pagamentos.",
    detailError: "Erro ao carregar detalhes do pagamento.",
  };

  static readonly adminServices = {
    loadError: "Erro ao carregar serviços.",
    createError: "Erro ao criar serviço.",
    updateError: "Erro ao atualizar serviço.",
    deleteError: "Erro ao excluir serviço.",
    requiredName: "Informe o nome do serviço.",
    requiredDescription: "Informe a descrição do serviço.",
    invalidPrice: "Informe um preço válido para o serviço.",
    updateSuccess: "Serviço atualizado com sucesso!",
    deleteSuccess: "Serviço excluído com sucesso!",
  };

  static readonly adminUnits = {
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
  };

  static readonly adminPackages = {
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
  };

  static readonly adminHolidays = {
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
  };

  static readonly adminUsers = {
    loadError: "Erro ao carregar usuários.",
    detailError: "Erro ao carregar detalhes do usuário.",
    createError: "Erro ao criar usuário.",
    deactivateError: "Erro ao excluir usuário.",
    requiredName: "Informe o nome do usuário.",
    requiredEmail: "Informe o e-mail do usuário.",
    invalidEmail: "Informe um e-mail válido.",
    requiredPassword: "Informe a senha do usuário.",
  };

  static readonly adminReports = {
    summaryLoadError: "Erro ao carregar o resumo de relatórios.",
    activeClientsLoadError: "Erro ao carregar clientes ativos.",
    transactionsLoadError: "Erro ao carregar dados de faturamento.",
    hoursByServiceLoadError: "Erro ao carregar horas por serviço.",
    exportError: "Erro ao exportar relatório.",
    exportSuccess: "Relatório exportado com sucesso!",
  };

  static readonly address = {
    outOfCoverage: "Endereço fora da área de atendimento.",
    validationError: "Erro ao validar o endereço. Tente novamente.",
  };

  static readonly payment = {
    missingEmail: "E-mail não cadastrado. Volte ao passo de cadastro.",
    missingService: "Nenhum serviço selecionado.",
    missingDateTime: "Data e horário não selecionados.",
    invalidFields: "Verifique os dados destacados antes de continuar.",
    createAppointmentError: "Erro ao criar agendamento.",
  };

  static readonly orderSummary = {
    title: "Resumo do pedido",
    service: "Serviço",
    subtotal: "Subtotal",
    discount: "Desconto",
    serviceFee: "Taxa de serviço",
    total: "Total",
    terms: "Ao confirmar o pagamento, você concorda com nossos termos de serviço",
    pay: "Pagar",
    processing: "Processando...",
    emptyService: "---",
  };
}

export { Messages };
