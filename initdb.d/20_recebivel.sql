-- Table: pagway.recebivel

-- DROP TABLE IF EXISTS pagway.recebivel;

CREATE TABLE IF NOT EXISTS pagway.recebivel
(
    id SERIAL PRIMARY KEY,
    transacao_id integer UNIQUE NOT NULL,
    status_recebivel text NOT NULL,
    data_pagamento_recebivel timestamp NOT NULL,
    valor_liquido_recebivel integer NOT NULL,
    CONSTRAINT fk_recebivel_transacao_id FOREIGN KEY (transacao_id)
        REFERENCES pagway.transacao (id) MATCH SIMPLE
        ON UPDATE CASCADE
        ON DELETE NO ACTION
);

CREATE INDEX IF NOT EXISTS recebivel_status_recebivel_idx
    ON pagway.recebivel(status_recebivel);