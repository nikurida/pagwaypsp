insert into
  pagway.transacao (
    id,
    valor_transacao, 
    descricao_transacao, 
    data_criacao_transacao, 
    nome_portador_cartao,
    numero_cartao,
    validade_cartao,
    codigo_seguranca_cartao
  )
  values (
    1, 10000, 'Smartband 1', '2023-12-15', 'fulano cuiabano', '1234', '2027-01-15', '753'
  ), (
    2, 10000, 'Smartband 2', '2023-12-15', 'fulano cuiabano', '1234', '2027-02-15', '753'
  ), (
    3, 10000, 'Smartband 3', '2023-12-15', 'fulano cuiabano', '1234', '2027-03-15', '753'
  ), (
    4, 10000, 'Smartband 4', '2023-12-15', 'fulano cuiabano', '1234', '2027-04-15', '753'
  ), (
    5, 10000, 'Smartband 5', '2023-12-15', 'fulano cuiabano', '1234', '2027-05-15', '753'
  ), (
    6, 10000, 'Smartband 6', '2023-12-15', 'fulano cuiabano', '1234', '2027-06-15', '753'
  ), (
    7, 10000, 'Smartband 7', '2023-12-15', 'fulano cuiabano', '1234', '2027-07-15', '753'
  ), (
    8, 10000, 'Smartband 8', '2023-12-15', 'fulano cuiabano', '1234', '2027-08-15', '753'
  ), (
    9, 10000, 'Smartband 9', '2023-12-15', 'fulano cuiabano', '1234', '2027-09-15', '753'
  ), (
    10, 10000, 'Smartband 10', '2023-12-15', 'fulano cuiabano', '1234', '2027-10-15', '753'
  );

SELECT setval(pg_get_serial_sequence('pagway.transacao', 'id') , COALESCE(max(id) + 1, 1) , false) FROM  pagway.transacao;