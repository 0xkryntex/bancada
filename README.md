# Bancada

Ferramentas de bolso para desenvolvedor, em uma única página estática. Nada é enviado para servidor: todo o processamento acontece no seu navegador.

## Ferramentas

| Ferramenta          | O que faz                                                                             |
| ------------------- | ------------------------------------------------------------------------------------- |
| **JSON**            | Formata, minifica, ordena chaves e valida, apontando linha e coluna do erro           |
| **Base64 e URL**    | Codifica e decodifica em UTF-8, com variante url-safe e percent-encoding              |
| **Identificadores** | UUID v4, UUID v7 ordenável por tempo, token hex e token base62, em lote               |
| **JWT**             | Decodifica header e payload e traduz `iat`, `nbf` e `exp` para o fuso local           |
| **Timestamp**       | Converte entre Unix (s/ms), ISO 8601 e data legível, com relógio ao vivo              |
| **Diff de texto**   | Comparação linha a linha por maior subsequência comum, com contagem de mudanças       |
| **Regex**           | Testa padrões com destaque ao vivo, lista de capturas, grupos nomeados e substituição |
| **Hash**            | SHA-1, SHA-256, SHA-384 e SHA-512 via Web Crypto                                      |

## Atalhos

- `Ctrl K` (ou `⌘ K`) abre a busca de ferramentas
- `1` a `8` alternam entre as ferramentas
- `↑` `↓` e `Enter` navegam na busca

## Rodando localmente

Não há build nem dependências. Sirva a pasta com qualquer servidor estático:

```bash
python3 -m http.server 8000
```

E abra `http://localhost:8000`.

## Estrutura

```
.
├── index.html      # marcação e painéis das ferramentas
├── base.css        # reset e estilos base
├── style.css       # tokens de design e componentes
├── app.js          # lógica de todas as ferramentas
└── favicon.svg
```

## Licença

MIT
