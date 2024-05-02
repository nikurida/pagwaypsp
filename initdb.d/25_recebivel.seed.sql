INSERT INTO
  pagway.recebivel (
    id,
    transacao_id,
    status_recebivel,
    data_pagamento_recebivel,
    valor_liquido_recebivel
  )
  VALUES (
    1, 1, 'liquidado', '2024-02-14', 9500
  ), (
    2, 2, 'liquidado', '2024-03-14', 9500
  ), (
    3, 3, 'liquidado', '2024-04-14', 9500
  ), (
    4, 4, 'liquidado', '2024-05-14', 9500
  ), (
    5, 5, 'liquidado', '2024-06-14', 9500
  ), (
    6, 6, 'pendente', '2024-07-14', 9500
  ), (
    7, 7, 'pendente', '2024-08-14', 9500
  ), (
    8, 8, 'pendente', '2024-09-14', 9500
  ), (
    9, 9, 'pendente', '2024-10-14', 9500
  ), (
    10, 10, 'pendente', '2024-11-14', 9500
  );

  SELECT setval(pg_get_serial_sequence('pagway.recebivel', 'id') , COALESCE(max(id) + 1, 1) , false) FROM  pagway.recebivel;