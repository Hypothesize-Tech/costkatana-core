# Gateway usage, dashboards, and `trackUsage`

This guide explains how **gateway traffic** and **explicit SDK tracking** relate, and how to structure **multi-turn** requests so models and dashboards stay correct.

## 1. Two ways usage hits your project

### A. Through the Cost Katana Gateway

You call the gateway (SDK `gateway.openai` / `gateway.anthropic`, or HTTP `POST …/api/gateway/v1/chat/completions` or `…/v1/messages`). The server forwards to the provider and **creates usage / analytics from the proxied request body** (plus auth, project id, etc.).

- You must send **provider-correct** JSON: right **route**, **model** id, and **message** shape.
- **Project scoping:** set `projectId` on the SDK tracker and/or the usual env (`PROJECT_ID`) so rows land in the right dashboard project.

### B. Through `trackUsage` / comprehensive tracking

You (or the SDK) send a **separate** payload to the tracking endpoints with fields you define: prompt text, tokens, model, metadata, etc.

- Use this when there is **no** gateway hop, or when you want a **custom** label for the “request” that is not the raw provider body.

These paths can both be active in one app; they are not interchangeable copies of the same row.

## 2. Conversation context: your choice; usage rows stay “one turn”

The gateway is used for **any** AI app shape: you pass **only** the latest user line, or the **full** `messages` thread when you want the model to remember prior turns. Cost Katana does not require a separate flag for that.

### Sending history when you need it

Example thread body:

```json
[
  { "role": "user", "content": "Who is Alice?" },
  { "role": "assistant", "content": "Alice is …" },
  { "role": "user", "content": "What did she publish in 2020?" }
]
```

Rules of thumb:

- Alternate **user** / **assistant** (some APIs merge consecutive same-role messages; still keep intent clear).
- **Append** the new user turn to **prior** messages from **committed** state—do not drop assistant replies between turns.
- In UI code, **read the input once** (`const userText = input.trim()`), **clear the field**, then build `messages` including `userText`. Avoid using React state that has not flushed yet, and never put the last assistant reply in `role: "user"`.

### How **costkatana-backend-nest** records Usage (default)

- **Request / `prompt`:** the **last** `role: "user"` message (not the whole thread concatenated).
- **Response / completion:** this assistant reply only.
- **If the body has two or more chat messages:** stored **`promptTokens`** (and **cost** derived from tokens in that row) use an **estimate** for the **last user message only**; **output tokens** stay what the provider reported for this reply. The **forwarded** request to the vendor is unchanged (full thread still goes upstream).
- **If the body has a single user (or one-turn) message:** stored input tokens follow the normal provider extraction path.

Provider invoices may still charge **full-context** input for that HTTP call—our Usage row is intentionally **per-turn** for dashboards, not a line-item copy of the vendor bill.

## 3. What the dashboard “Request” / prompt should mean

For gateway-backed calls, the Nest gateway persists the **last `role: "user"`** message’s content (not every message concatenated).

### Input tokens vs. the Request line

They are aligned for **product** semantics: the **Request** line and stored **prompt tokens** both target **this turn’s user text** when multiple messages were sent. **Output** tokens are for this reply only.

## 4. Model and route mismatches (common failures)

| Mistake | Symptom |
|--------|---------|
| OpenAI model id on `/v1/messages` or Claude id on `/v1/chat/completions` | 4xx from provider or gateway |
| Anthropic body without `max_tokens` | Validation errors |
| Wrong or deprecated model string | “model not found” / empty generations |

Prefer **`OPENAI.*`, `ANTHROPIC.*`, `GOOGLE.*`, …** from `cost-katana` instead of free-form strings when possible.

## 5. Where to find runnable examples

- **This repo:** `examples/README.md` (install and run TypeScript samples).
- **costkatana-examples:** [`2-gateway/npm-package/multi-turn-chat-usage-tracking.ts`](https://github.com/Hypothesize-Tech/costkatana-examples/blob/main/2-gateway/npm-package/multi-turn-chat-usage-tracking.ts) and [`2-gateway/http-headers/multi-turn-chat-usage.http`](https://github.com/Hypothesize-Tech/costkatana-examples/blob/main/2-gateway/http-headers/multi-turn-chat-usage.http).
