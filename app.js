/* ============================================================
   Bancada — ferramentas de bolso para dev
   Tudo client-side. Sem dependências.
   ============================================================ */

(() => {
  'use strict';

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------------------------------------------------------
     Ícones
     --------------------------------------------------------- */
  const ico = (d) =>
    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;

  const TOOLS = [
    {
      id: 'json',
      name: 'JSON',
      keys: 'json formatar validar minificar',
      icon: ico('<path d="M8 4C5 4 6 12 3 12c3 0 2 8 5 8"/><path d="M16 4c3 0 2 8 5 8-3 0-2 8-5 8"/>'),
    },
    {
      id: 'b64',
      name: 'Base64 e URL',
      keys: 'base64 url encode decode codificar',
      icon: ico('<path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4"/><path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4"/><path d="M9 12h6"/>'),
    },
    {
      id: 'uuid',
      name: 'Identificadores',
      keys: 'uuid v4 v7 token aleatorio nanoid id',
      icon: ico('<rect x="3" y="7" width="18" height="10" rx="2"/><path d="M7 11v2"/><path d="M11 11v2"/><path d="M15 11v2"/>'),
    },
    {
      id: 'jwt',
      name: 'JWT',
      keys: 'jwt token decodificar claims exp',
      icon: ico('<path d="M12 3l7 4v6c0 4-3 6.5-7 8-4-1.5-7-4-7-8V7l7-4z"/><path d="M9.5 12l1.8 1.8 3.2-3.6"/>'),
    },
    {
      id: 'time',
      name: 'Timestamp',
      keys: 'timestamp unix epoch data iso hora fuso',
      icon: ico('<circle cx="12" cy="12" r="8"/><path d="M12 8v4.5l3 1.8"/>'),
    },
    {
      id: 'diff',
      name: 'Diff de texto',
      keys: 'diff comparar texto diferenca',
      icon: ico('<path d="M4 5v9a3 3 0 0 0 3 3h9"/><path d="M13 14l3 3-3 3"/><path d="M20 19v-9a3 3 0 0 0-3-3H8"/><path d="M11 10L8 7l3-3"/>'),
    },
    {
      id: 'regex',
      name: 'Regex',
      keys: 'regex expressao regular padrao match substituir',
      icon: ico('<path d="M14 4v8"/><path d="M10.5 6l7 4"/><path d="M17.5 6l-7 4"/><circle cx="7" cy="18" r="1.6"/><path d="M12 15h8v5h-8z"/>'),
    },
    {
      id: 'hash',
      name: 'Hash',
      keys: 'hash sha1 sha256 sha512 resumo checksum',
      icon: ico('<path d="M9 4L7 20"/><path d="M17 4l-2 16"/><path d="M4 9h16"/><path d="M3 15h16"/>'),
    },
  ];

  /* ---------------------------------------------------------
     Tema
     --------------------------------------------------------- */
  const SUN =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
  const MOON =
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3A7 7 0 0 0 21 12.8z"/></svg>';

  const store = {
    get(k) {
      try {
        return localStorage.getItem(k);
      } catch (e) {
        return null;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem(k, v);
      } catch (e) {
        /* iframe sandbox: ignora */
      }
    },
  };

  let theme =
    store.get('bancada-theme') ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  const applyTheme = () => {
    document.documentElement.setAttribute('data-theme', theme);
    const btn = $('[data-theme-toggle]');
    if (!btn) return;
    btn.innerHTML = theme === 'dark' ? SUN : MOON;
    btn.setAttribute(
      'aria-label',
      theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
    );
  };

  applyTheme();
  $('[data-theme-toggle]').addEventListener('click', () => {
    theme = theme === 'dark' ? 'light' : 'dark';
    store.set('bancada-theme', theme);
    applyTheme();
  });

  /* ---------------------------------------------------------
     Toast + copiar
     --------------------------------------------------------- */
  const toastEl = $('[data-toast]');
  let toastTimer;
  const toast = (msg) => {
    toastEl.textContent = msg;
    toastEl.setAttribute('data-show', 'true');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.setAttribute('data-show', 'false'), 1800);
  };

  const copy = async (text, label = 'Copiado') => {
    if (!text) {
      toast('Nada para copiar');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast(label);
    } catch (e) {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        toast(label);
      } catch (e2) {
        toast('Não foi possível copiar');
      }
      ta.remove();
    }
  };

  document.addEventListener('click', (ev) => {
    const btn = ev.target.closest('[data-copy]');
    if (!btn) return;
    const target = $(btn.getAttribute('data-copy'));
    copy(target ? target.textContent : '');
  });

  /* ---------------------------------------------------------
     Status helper
     --------------------------------------------------------- */
  const setStatus = (name, kind, msg) => {
    const el = $(`[data-status="${name}"]`);
    if (!el) return;
    el.setAttribute('data-kind', kind);
    el.textContent = msg;
  };

  /* ---------------------------------------------------------
     Navegação entre ferramentas
     --------------------------------------------------------- */
  const toolList = $('[data-tool-list]');
  const paletteList = $('[data-palette-list]');
  let current = TOOLS[0].id;

  toolList.innerHTML = TOOLS.map(
    (t, i) => `
    <button class="tool-link" type="button" role="tab" id="tab-${t.id}"
      aria-controls="panel-${t.id}" aria-selected="${i === 0}" data-tool="${t.id}">
      ${t.icon}<span>${t.name}</span><span class="tool-index">${i + 1}</span>
    </button>`
  ).join('');

  const selectTool = (id, focusPanel = false) => {
    if (!TOOLS.some((t) => t.id === id)) return;
    current = id;
    $$('[data-tool]').forEach((b) =>
      b.setAttribute('aria-selected', String(b.dataset.tool === id))
    );
    $$('[data-panel]').forEach((p) => {
      p.hidden = p.dataset.panel !== id;
    });
    $('.main').scrollTop = 0;
    const chip = $(`[data-tool="${id}"]`);
    if (chip && chip.scrollIntoView)
      chip.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
    if (focusPanel) {
      const first = $(`[data-panel="${id}"] textarea, [data-panel="${id}"] input`);
      if (first) first.focus();
    }
  };

  toolList.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-tool]');
    if (b) selectTool(b.dataset.tool);
  });

  /* ---------------------------------------------------------
     Command palette
     --------------------------------------------------------- */
  const palette = $('[data-palette]');
  const paletteInput = $('[data-palette-input]');
  let filtered = TOOLS.slice();
  let activeIdx = 0;

  const renderPalette = () => {
    if (!filtered.length) {
      paletteList.innerHTML =
        '<p class="hint" style="padding:var(--space-4)">Nenhuma ferramenta com esse nome.</p>';
      return;
    }
    paletteList.innerHTML = filtered
      .map(
        (t, i) => `
      <button class="palette-item" type="button" data-pick="${t.id}" data-active="${i === activeIdx}">
        ${t.icon}<span>${t.name}</span><em>${TOOLS.findIndex((x) => x.id === t.id) + 1}</em>
      </button>`
      )
      .join('');
  };

  const openPalette = () => {
    palette.setAttribute('data-open', 'true');
    paletteInput.value = '';
    filtered = TOOLS.slice();
    activeIdx = 0;
    renderPalette();
    paletteInput.focus();
  };

  const closePalette = () => palette.setAttribute('data-open', 'false');

  $('[data-palette-open]').addEventListener('click', openPalette);
  $('[data-palette-close]').addEventListener('click', closePalette);
  palette.addEventListener('click', (ev) => {
    if (ev.target === palette) closePalette();
    const pick = ev.target.closest('[data-pick]');
    if (pick) {
      selectTool(pick.dataset.pick, true);
      closePalette();
    }
  });

  paletteInput.addEventListener('input', () => {
    const q = paletteInput.value.trim().toLowerCase();
    filtered = TOOLS.filter((t) => (t.name + ' ' + t.keys).toLowerCase().includes(q));
    activeIdx = 0;
    renderPalette();
  });

  paletteInput.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowDown') {
      ev.preventDefault();
      activeIdx = Math.min(activeIdx + 1, filtered.length - 1);
      renderPalette();
    } else if (ev.key === 'ArrowUp') {
      ev.preventDefault();
      activeIdx = Math.max(activeIdx - 1, 0);
      renderPalette();
    } else if (ev.key === 'Enter' && filtered[activeIdx]) {
      ev.preventDefault();
      selectTool(filtered[activeIdx].id, true);
      closePalette();
    }
  });

  document.addEventListener('keydown', (ev) => {
    const open = palette.getAttribute('data-open') === 'true';
    if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === 'k') {
      ev.preventDefault();
      open ? closePalette() : openPalette();
      return;
    }
    if (ev.key === 'Escape' && open) {
      closePalette();
      return;
    }
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
    if (!typing && !open && /^[1-8]$/.test(ev.key)) {
      const t = TOOLS[Number(ev.key) - 1];
      if (t) selectTool(t.id);
    }
  });

  /* ---------------------------------------------------------
     Utilidades de encoding
     --------------------------------------------------------- */
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const b64FromBytes = (bytes) => {
    let s = '';
    bytes.forEach((b) => (s += String.fromCharCode(b)));
    return btoa(s);
  };
  const bytesFromB64 = (str) => {
    const bin = atob(str);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  };
  const b64urlDecodeToText = (str) => {
    let s = str.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return dec.decode(bytesFromB64(s));
  };
  const b64urlEncodeText = (text) =>
    b64FromBytes(enc.encode(text)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  const escapeHtml = (s) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  /* ---------------------------------------------------------
     1. JSON
     --------------------------------------------------------- */
  const jsonIn = $('#json-in');
  const jsonOut = $('#json-out');

  const indentValue = () => {
    const v = $('[data-json-indent]').value;
    return v === 'tab' ? '\t' : Number(v);
  };

  const describe = (value) => {
    let keys = 0;
    let nodes = 0;
    let depth = 0;
    const walk = (v, d) => {
      nodes++;
      depth = Math.max(depth, d);
      if (Array.isArray(v)) v.forEach((x) => walk(x, d + 1));
      else if (v && typeof v === 'object')
        Object.entries(v).forEach(([, x]) => {
          keys++;
          walk(x, d + 1);
        });
    };
    walk(value, 1);
    return { keys, nodes, depth };
  };

  const posFromError = (text, msg) => {
    if (/line \d+/i.test(msg)) return '';
    const m = /position (\d+)/.exec(msg);
    if (!m) return '';
    const pos = Number(m[1]);
    const before = text.slice(0, pos);
    const line = before.split('\n').length;
    const col = pos - before.lastIndexOf('\n');
    return ` (linha ${line}, coluna ${col})`;
  };

  const sortDeep = (v) => {
    if (Array.isArray(v)) return v.map(sortDeep);
    if (v && typeof v === 'object')
      return Object.keys(v)
        .sort()
        .reduce((acc, k) => {
          acc[k] = sortDeep(v[k]);
          return acc;
        }, {});
    return v;
  };

  const runJson = (mode) => {
    const text = jsonIn.value.trim();
    if (!text) {
      jsonOut.textContent = '';
      setStatus('json', 'idle', 'Aguardando entrada');
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch (err) {
      jsonOut.textContent = '';
      setStatus('json', 'err', 'JSON inválido: ' + err.message + posFromError(text, err.message));
      return;
    }
    const value = mode === 'sort' ? sortDeep(parsed) : parsed;
    jsonOut.textContent =
      mode === 'minify' ? JSON.stringify(value) : JSON.stringify(value, null, indentValue());
    const info = describe(parsed);
    setStatus(
      'json',
      'ok',
      `JSON válido · ${info.keys} chaves · ${info.nodes} nós · profundidade ${info.depth} · ${jsonOut.textContent.length} caracteres`
    );
  };

  let jsonMode = 'format';
  jsonIn.addEventListener('input', () => runJson(jsonMode));
  $('[data-json-indent]').addEventListener('change', () => runJson(jsonMode));
  $('[data-act="json-format"]').addEventListener('click', () => {
    jsonMode = 'format';
    runJson(jsonMode);
  });
  $('[data-act="json-minify"]').addEventListener('click', () => {
    jsonMode = 'minify';
    runJson(jsonMode);
  });
  $('[data-act="json-sort"]').addEventListener('click', () => {
    jsonMode = 'sort';
    runJson(jsonMode);
  });
  $('[data-act="json-clear"]').addEventListener('click', () => {
    jsonIn.value = '';
    runJson(jsonMode);
    jsonIn.focus();
  });
  $('[data-act="json-sample"]').addEventListener('click', () => {
    jsonIn.value =
      '{"servico":"bancada","versao":2,"tags":["dev","offline"],"limites":{"payload_kb":512,"itens":null},"ativo":true}';
    jsonMode = 'format';
    runJson(jsonMode);
  });

  /* ---------------------------------------------------------
     2. Base64 / URL
     --------------------------------------------------------- */
  const b64In = $('#b64-in');
  const b64Out = $('#b64-out');
  const b64Mode = $('[data-b64-mode]');
  const b64Safe = $('[data-b64-urlsafe]');

  const runB64 = () => {
    const text = b64In.value;
    const mode = b64Mode.value;
    if (!text) {
      b64Out.textContent = '';
      setStatus('b64', 'idle', 'Aguardando entrada');
      return;
    }
    try {
      let out = '';
      if (mode === 'b64enc') {
        out = b64FromBytes(enc.encode(text));
        if (b64Safe.checked) out = out.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
      } else if (mode === 'b64dec') {
        let s = text.trim().replace(/\s+/g, '');
        s = s.replace(/-/g, '+').replace(/_/g, '/');
        while (s.length % 4) s += '=';
        out = dec.decode(bytesFromB64(s));
      } else if (mode === 'urlenc') {
        out = encodeURIComponent(text);
      } else {
        out = decodeURIComponent(text.trim());
      }
      b64Out.textContent = out;
      setStatus('b64', 'ok', `${text.length} → ${out.length} caracteres`);
    } catch (err) {
      b64Out.textContent = '';
      setStatus('b64', 'err', 'Entrada inválida para este modo');
    }
  };

  b64In.addEventListener('input', runB64);
  b64Mode.addEventListener('change', runB64);
  b64Safe.addEventListener('change', runB64);
  $('[data-act="b64-swap"]').addEventListener('click', () => {
    const map = { b64enc: 'b64dec', b64dec: 'b64enc', urlenc: 'urldec', urldec: 'urlenc' };
    const prev = b64Out.textContent;
    b64Mode.value = map[b64Mode.value];
    if (prev) b64In.value = prev;
    runB64();
  });
  $('[data-act="b64-clear"]').addEventListener('click', () => {
    b64In.value = '';
    runB64();
    b64In.focus();
  });

  /* ---------------------------------------------------------
     3. Identificadores
     --------------------------------------------------------- */
  const uuidList = $('[data-uuid-list]');
  let lastIds = [];

  const randBytes = (n) => crypto.getRandomValues(new Uint8Array(n));
  const hex = (bytes) =>
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');

  const uuidV4 = () => {
    const b = randBytes(16);
    b[6] = (b[6] & 0x0f) | 0x40;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = hex(b);
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  };

  const uuidV7 = () => {
    const b = randBytes(16);
    const ts = Date.now();
    for (let i = 0; i < 6; i++) b[i] = (ts / 2 ** (8 * (5 - i))) & 0xff;
    b[6] = (b[6] & 0x0f) | 0x70;
    b[8] = (b[8] & 0x3f) | 0x80;
    const h = hex(b);
    return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
  };

  const B62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const token62 = (len = 21) =>
    Array.from(randBytes(len))
      .map((b) => B62[b % 62])
      .join('');

  const renderIds = () => {
    if (!lastIds.length) return;
    uuidList.innerHTML = lastIds
      .map(
        (id) => `<div class="uuid-row"><span>${escapeHtml(id)}</span>
        <button class="btn btn-ghost" type="button" data-copy-id="${escapeHtml(id)}" style="min-height:32px">Copiar</button></div>`
      )
      .join('');
  };

  uuidList.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-copy-id]');
    if (b) copy(b.getAttribute('data-copy-id'));
  });

  $('[data-act="uuid-gen"]').addEventListener('click', () => {
    const kind = $('[data-uuid-kind]').value;
    let n = Number($('[data-uuid-count]').value) || 1;
    n = Math.max(1, Math.min(200, n));
    $('[data-uuid-count]').value = n;
    const upper = $('[data-uuid-upper]').checked;
    lastIds = Array.from({ length: n }, () => {
      if (kind === 'v4') return uuidV4();
      if (kind === 'v7') return uuidV7();
      if (kind === 'hex') return hex(randBytes(16));
      return token62(21);
    }).map((s) => (upper ? s.toUpperCase() : s));
    renderIds();
    toast(`${n} ${n === 1 ? 'identificador gerado' : 'identificadores gerados'}`);
  });

  $('[data-act="uuid-copy-all"]').addEventListener('click', () =>
    copy(lastIds.join('\n'), 'Lista copiada')
  );

  /* ---------------------------------------------------------
     4. JWT
     --------------------------------------------------------- */
  const jwtIn = $('#jwt-in');
  const fmtDate = (ms) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(new Date(ms));

  const relative = (ms) => {
    const diff = ms - Date.now();
    const abs = Math.abs(diff);
    const units = [
      ['dia', 86400000],
      ['hora', 3600000],
      ['minuto', 60000],
      ['segundo', 1000],
    ];
    for (const [name, size] of units) {
      if (abs >= size) {
        const n = Math.round(abs / size);
        const plural = n === 1 ? name : name + 's';
        return diff >= 0 ? `em ${n} ${plural}` : `há ${n} ${plural}`;
      }
    }
    return 'agora';
  };

  const runJwt = () => {
    const token = jwtIn.value.trim();
    const headerOut = $('#jwt-header');
    const payloadOut = $('#jwt-payload');
    const datesOut = $('[data-jwt-dates]');
    if (!token) {
      headerOut.textContent = '';
      payloadOut.textContent = '';
      datesOut.innerHTML = '<p class="hint">Cole um token para ver as datas convertidas.</p>';
      setStatus('jwt', 'idle', 'Aguardando token');
      return;
    }
    const parts = token.split('.');
    if (parts.length < 2) {
      headerOut.textContent = '';
      payloadOut.textContent = '';
      setStatus('jwt', 'err', 'Formato inválido: esperado header.payload.assinatura');
      return;
    }
    let header, payload;
    try {
      header = JSON.parse(b64urlDecodeToText(parts[0]));
      payload = JSON.parse(b64urlDecodeToText(parts[1]));
    } catch (err) {
      headerOut.textContent = '';
      payloadOut.textContent = '';
      setStatus('jwt', 'err', 'Não foi possível decodificar o token');
      return;
    }
    headerOut.textContent = JSON.stringify(header, null, 2);
    payloadOut.textContent = JSON.stringify(payload, null, 2);

    const labels = { iat: 'Emitido em (iat)', nbf: 'Válido a partir de (nbf)', exp: 'Expira em (exp)' };
    const rows = Object.keys(labels)
      .filter((k) => typeof payload[k] === 'number')
      .map((k) => {
        const ms = payload[k] * 1000;
        return `<tr><th>${labels[k]}</th><td>${fmtDate(ms)} <span class="hint">· ${relative(ms)}</span></td></tr>`;
      });

    if (rows.length) datesOut.innerHTML = `<table class="kv"><tbody>${rows.join('')}</tbody></table>`;
    else datesOut.innerHTML = '<p class="hint">Este token não traz claims de data.</p>';

    if (typeof payload.exp === 'number') {
      const expired = payload.exp * 1000 < Date.now();
      setStatus(
        'jwt',
        expired ? 'err' : 'ok',
        expired
          ? `Token expirado ${relative(payload.exp * 1000)} · alg ${header.alg || '?'}`
          : `Token válido · expira ${relative(payload.exp * 1000)} · alg ${header.alg || '?'}`
      );
    } else {
      setStatus('jwt', 'ok', `Decodificado · alg ${header.alg || '?'} · assinatura não verificada`);
    }
  };

  jwtIn.addEventListener('input', runJwt);
  $('[data-act="jwt-clear"]').addEventListener('click', () => {
    jwtIn.value = '';
    runJwt();
    jwtIn.focus();
  });
  $('[data-act="jwt-sample"]').addEventListener('click', () => {
    const now = Math.floor(Date.now() / 1000);
    const h = b64urlEncodeText(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const p = b64urlEncodeText(
      JSON.stringify({
        sub: '1f2c9a44',
        name: 'Ricardo',
        role: 'builder',
        iat: now - 600,
        exp: now + 3600,
      })
    );
    jwtIn.value = `${h}.${p}.${token62(32)}`;
    runJwt();
  });

  /* ---------------------------------------------------------
     5. Timestamp
     --------------------------------------------------------- */
  const tzName = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const tickNow = () => {
    const d = new Date();
    $('[data-now-s]').textContent = String(Math.floor(d.getTime() / 1000));
    $('[data-now-ms]').textContent = String(d.getTime());
    $('[data-now-iso]').textContent = d.toISOString();
    $('[data-now-local]').textContent = `${fmtDate(d.getTime())} (${tzName})`;
  };
  tickNow();
  setInterval(tickNow, 1000);

  const timeIn = $('[data-time-in]');

  const runTime = () => {
    const raw = timeIn.value.trim();
    const out = $('[data-time-out]');
    if (!raw) {
      out.innerHTML =
        '<tr><td><span class="hint">Digite um timestamp ou uma data para converter.</span></td></tr>';
      setStatus('time', 'idle', 'Aguardando valor');
      return;
    }
    let date = null;
    let origem = '';
    if (/^-?\d{1,11}$/.test(raw)) {
      date = new Date(Number(raw) * 1000);
      origem = 'Unix em segundos';
    } else if (/^-?\d{12,}$/.test(raw)) {
      date = new Date(Number(raw));
      origem = 'Unix em milissegundos';
    } else {
      const parsed = new Date(raw);
      if (!isNaN(parsed.getTime())) {
        date = parsed;
        origem = 'Data textual';
      }
    }
    if (!date || isNaN(date.getTime())) {
      out.innerHTML = '';
      setStatus('time', 'err', 'Não reconheci esse valor como timestamp ou data');
      return;
    }
    const rows = [
      ['Interpretado como', origem],
      ['Unix (s)', String(Math.floor(date.getTime() / 1000))],
      ['Unix (ms)', String(date.getTime())],
      ['ISO 8601 (UTC)', date.toISOString()],
      ['Local', `${fmtDate(date.getTime())} (${tzName})`],
      ['UTC legível', date.toUTCString()],
      ['Relativo', relative(date.getTime())],
      [
        'Dia da semana',
        new Intl.DateTimeFormat('pt-BR', { weekday: 'long' }).format(date),
      ],
    ];
    out.innerHTML = rows
      .map(([k, v]) => `<tr><th>${k}</th><td class="tnum">${escapeHtml(v)}</td></tr>`)
      .join('');
    setStatus('time', 'ok', 'Convertido');
  };

  timeIn.addEventListener('input', runTime);
  $('[data-act="time-now"]').addEventListener('click', () => {
    timeIn.value = String(Math.floor(Date.now() / 1000));
    runTime();
  });
  $('[data-act="time-clear"]').addEventListener('click', () => {
    timeIn.value = '';
    runTime();
    timeIn.focus();
  });

  /* ---------------------------------------------------------
     6. Diff
     --------------------------------------------------------- */
  const diffOut = $('[data-diff-out]');

  const lcsDiff = (a, b, norm) => {
    const n = a.length;
    const m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--)
      for (let j = m - 1; j >= 0; j--)
        dp[i][j] =
          norm(a[i]) === norm(b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
    const rows = [];
    let i = 0;
    let j = 0;
    while (i < n && j < m) {
      if (norm(a[i]) === norm(b[j])) {
        rows.push({ t: 'eq', text: b[j], la: i + 1, lb: j + 1 });
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        rows.push({ t: 'del', text: a[i], la: i + 1, lb: null });
        i++;
      } else {
        rows.push({ t: 'add', text: b[j], la: null, lb: j + 1 });
        j++;
      }
    }
    while (i < n) rows.push({ t: 'del', text: a[i], la: ++i, lb: null });
    while (j < m) rows.push({ t: 'add', text: b[j], la: null, lb: ++j });
    return rows;
  };

  $('[data-act="diff-run"]').addEventListener('click', () => {
    const a = $('#diff-a').value;
    const b = $('#diff-b').value;
    if (!a && !b) {
      setStatus('diff', 'err', 'Preencha os dois lados para comparar');
      return;
    }
    if (a.split('\n').length > 3000 || b.split('\n').length > 3000) {
      setStatus('diff', 'err', 'Limite de 3000 linhas por lado para manter a comparação rápida');
      return;
    }
    const trim = $('[data-diff-trim]').checked;
    const ic = $('[data-diff-case]').checked;
    const norm = (s) => {
      let v = s;
      if (trim) v = v.trim();
      if (ic) v = v.toLowerCase();
      return v;
    };
    const rows = lcsDiff(a.split('\n'), b.split('\n'), norm);
    const adds = rows.filter((r) => r.t === 'add').length;
    const dels = rows.filter((r) => r.t === 'del').length;

    if (!adds && !dels) {
      diffOut.innerHTML =
        '<div class="empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="8"/><path d="M8.5 12.2l2.3 2.3 4.7-5"/></svg><p>Os dois textos são idênticos.</p></div>';
      setStatus('diff', 'ok', 'Nenhuma diferença encontrada');
      return;
    }

    diffOut.innerHTML = rows
      .map((r) => {
        const sign = r.t === 'add' ? '+' : r.t === 'del' ? '−' : ' ';
        const ln = r.t === 'del' ? r.la : r.lb;
        return `<div class="diff-row" data-t="${r.t}"><span class="ln">${ln}</span><span class="sign">${sign}</span><span>${escapeHtml(r.text) || '&nbsp;'}</span></div>`;
      })
      .join('');
    setStatus('diff', 'ok', `${adds} adicionadas · ${dels} removidas · ${rows.length} linhas`);
  });

  $('[data-act="diff-clear"]').addEventListener('click', () => {
    $('#diff-a').value = '';
    $('#diff-b').value = '';
    diffOut.innerHTML =
      '<div class="empty"><svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 4v10a3 3 0 0 0 3 3h8"/><path d="M13 14l3 3-3 3"/></svg><p>Cole os dois textos e clique em Comparar para ver as diferenças destacadas.</p></div>';
    setStatus('diff', 'idle', 'Nenhuma comparação ainda');
  });

  /* ---------------------------------------------------------
     7. Regex
     --------------------------------------------------------- */
  const rxPattern = $('[data-regex-pattern]');
  const rxFlags = $('[data-regex-flags]');
  const rxText = $('[data-regex-text]');
  const rxReplace = $('[data-regex-replace]');
  const rxHl = $('[data-regex-hl]');
  const rxMatches = $('[data-regex-matches]');
  const rxReplaced = $('[data-regex-replaced]');

  const runRegex = () => {
    const pattern = rxPattern.value;
    const text = rxText.value;
    rxHl.innerHTML = escapeHtml(text);
    if (!pattern) {
      rxMatches.innerHTML = '<p class="hint">Sem correspondências.</p>';
      rxReplaced.textContent = '';
      setStatus('regex', 'idle', 'Aguardando padrão');
      return;
    }
    let flags = rxFlags.value.replace(/[^gimsuyd]/g, '');
    if (!flags.includes('g')) flags += 'g';
    let re;
    try {
      re = new RegExp(pattern, flags);
    } catch (err) {
      rxMatches.innerHTML = '<p class="hint">Sem correspondências.</p>';
      rxReplaced.textContent = '';
      setStatus('regex', 'err', 'Padrão inválido: ' + err.message);
      return;
    }
    if (!text) {
      setStatus('regex', 'idle', 'Padrão válido · aguardando texto');
      rxMatches.innerHTML = '<p class="hint">Sem correspondências.</p>';
      rxReplaced.textContent = '';
      return;
    }

    const found = [];
    let guard = 0;
    let m;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null && guard++ < 5000) {
      found.push(m);
      if (m[0] === '') re.lastIndex++;
    }

    let html = '';
    let cursor = 0;
    found.forEach((mm) => {
      if (mm.index < cursor) return;
      html += escapeHtml(text.slice(cursor, mm.index));
      html += `<mark class="hl">${escapeHtml(mm[0]) || '·'}</mark>`;
      cursor = mm.index + mm[0].length;
    });
    html += escapeHtml(text.slice(cursor));
    rxHl.innerHTML = html;

    if (!found.length) {
      rxMatches.innerHTML = '<p class="hint">Sem correspondências.</p>';
      setStatus('regex', 'err', 'Nenhuma correspondência');
    } else {
      rxMatches.innerHTML = found
        .slice(0, 60)
        .map((mm, i) => {
          const groups = mm
            .slice(1)
            .map((g, gi) => `$${gi + 1}=${g === undefined ? '—' : g}`)
            .join('  ');
          const named = mm.groups
            ? Object.entries(mm.groups)
                .map(([k, v]) => `${k}=${v === undefined ? '—' : v}`)
                .join('  ')
            : '';
          const extra = [groups, named].filter(Boolean).join('  ');
          return `<div class="match-item"><b>${i + 1}·${mm.index}</b><span>${escapeHtml(mm[0])}${
            extra ? ' <span class="hint">' + escapeHtml(extra) + '</span>' : ''
          }</span></div>`;
        })
        .join('');
      setStatus(
        'regex',
        'ok',
        `${found.length} ${found.length === 1 ? 'correspondência' : 'correspondências'} · flags ${flags}`
      );
    }

    try {
      rxReplaced.textContent = rxReplace.value ? text.replace(re, rxReplace.value) : '';
    } catch (err) {
      rxReplaced.textContent = '';
    }
  };

  [rxPattern, rxFlags, rxText, rxReplace].forEach((el) =>
    el.addEventListener('input', runRegex)
  );
  $('[data-act="regex-sample"]').addEventListener('click', () => {
    rxPattern.value = '(\\w+)@(\\w+\\.\\w+)';
    rxFlags.value = 'gi';
    rxText.value =
      'contato: ana@exemplo.com\nsuporte: dev@bancada.dev\nfinanceiro: nota@empresa.com.br';
    rxReplace.value = '$1 [em] $2';
    runRegex();
  });
  $('[data-act="regex-clear"]').addEventListener('click', () => {
    rxPattern.value = '';
    rxText.value = '';
    rxReplace.value = '';
    rxFlags.value = 'g';
    runRegex();
    rxPattern.focus();
  });

  /* ---------------------------------------------------------
     8. Hash
     --------------------------------------------------------- */
  const hashIn = $('#hash-in');
  const hashTargets = [
    ['SHA-1', '#hash-1'],
    ['SHA-256', '#hash-256'],
    ['SHA-384', '#hash-384'],
    ['SHA-512', '#hash-512'],
  ];

  let hashToken = 0;
  const runHash = async () => {
    const text = hashIn.value;
    const mine = ++hashToken;
    const bytes = enc.encode(text);
    $('#hash-bytes').textContent = String(bytes.length);
    if (!text) {
      hashTargets.forEach(([, sel]) => ($(sel).textContent = '—'));
      return;
    }
    if (!crypto.subtle) {
      hashTargets.forEach(([, sel]) => ($(sel).textContent = 'Web Crypto indisponível'));
      return;
    }
    for (const [alg, sel] of hashTargets) {
      try {
        const buf = await crypto.subtle.digest(alg, bytes);
        if (mine !== hashToken) return;
        $(sel).textContent = hex(new Uint8Array(buf));
      } catch (err) {
        $(sel).textContent = 'indisponível neste navegador';
      }
    }
  };

  hashIn.addEventListener('input', runHash);
  $('[data-act="hash-clear"]').addEventListener('click', () => {
    hashIn.value = '';
    runHash();
    hashIn.focus();
  });

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  renderPalette();
  selectTool(TOOLS[0].id);
})();
