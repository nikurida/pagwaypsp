CREATE TABLE IF NOT EXISTS pagway.transacao
(
    id SERIAL PRIMARY KEY,
    valor_transacao integer NOT NULL,
    descricao_transacao text NOT NULL,
    data_criacao_transacao timestamp NOT NULL,
    nome_portador_cartao text NOT NULL,
    numero_cartao char(4) NOT NULL,
    validade_cartao timestamp NOT NULL,
    codigo_seguranca_cartao char(3) NOT NULL
)