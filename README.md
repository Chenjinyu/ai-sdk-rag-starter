# Vercel AI SDK RAG Guide Starter Project

This is the starter project for the Vercel AI SDK [Retrieval-Augmented Generation (RAG) guide](https://sdk.vercel.ai/docs/guides/rag-chatbot).

In this project, you will build a chatbot that will only respond with information that it has within its knowledge base. The chatbot will be able to both store and retrieve information. This project has many interesting use cases from customer support through to building your own second brain!

This project will use the following stack:

- [Next.js](https://nextjs.org) 14 (App Router)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [OpenAI](https://openai.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [Postgres](https://www.postgresql.org/) with [ pgvector ](https://github.com/pgvector/pgvector)
- [shadcn-ui](https://ui.shadcn.com) and [TailwindCSS](https://tailwindcss.com) for styling


## [ai-sdk-ollama](https://github.com/jagreehal/ai-sdk-ollama)
the package is part of the Vercel AI SDK provier ecosystem
A Vercel AI SDK v5+ provider for Ollama built on the official ollama package. Type safe, future proof, with cross provider compatibility and native Ollama features.
```python
import { ollama } from "ai-sdk-ollama";

const model = ollama("llama3.2");

const response = await generateText({
  model,
  prompt: "Hello",
});

```

### Features
- works only inside the Vercel AI SDK workflow
- Supports AI SDK primitives:
  - generateText()
  - streamText()
  - tool calls
  - image generation 
- Built to work with route handlers(`route.ts`) in Next.js
- Uses the Vercel AI SDK request/response schema. 

