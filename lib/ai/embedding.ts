import { embed, embedMany } from 'ai';
import { openai } from '@ai-sdk/openai';
import { db } from '../db';
import { cosineDistance, desc, gt, sql } from 'drizzle-orm';
import { embeddings } from '../db/schema/embeddings';

const embeddingModel = openai.embedding('text-embedding-ada-002');

function getEmbeddingModel(selectedModelName: string) { 

}

const generateChunks = (input: string): string[] => {
  return input
    .trim()
    .split('.')
    .filter(i => i !== '');
};

export const generateEmbeddings = async (
  value: string,
): Promise<Array<{ embedding: number[]; content: string }>> => {
  const chunks = generateChunks(value);
  const { embeddings } = await embedMany({
    model: embeddingModel,
    values: chunks,
  });
  return embeddings.map((e, i) => ({ content: chunks[i], embedding: e }));
};

export const generateEmbedding = async (value: string): Promise<number[]> => {
  const input = value.replaceAll('\\n', ' ');
  const { embedding } = await embed({
    model: embeddingModel,
    value: input,
  });
  return embedding;
};

export const findRelevantContent = async (userQuery: string) => {
  const userQueryEmbedded = await generateEmbedding(userQuery);
  const getCosineDistance = cosineDistance(
    embeddings.embedding,
    userQueryEmbedded,
  )
  console.log('[DEBUG][findRelevantContent] getCosineDistance:', { getCosineDistance })
  
  const similarity = sql<number>`1 - (${getCosineDistance})`;
  console.log('[DEBUG][findRelevantContent] get the similarity from DB:', {similarity})
  const similarGuides = await db
    .select({ name: embeddings.content, similarity })
    .from(embeddings)
    .where(gt(similarity, 0.5))
    .orderBy(t => desc(t.similarity))
    .limit(4);

  // LOG THE RESULT of the db.select() query
  console.log("[DEBUG] ai.embedding.ts. findRelevantContent (similarGuides):", similarGuides);
  const simailarJointStr = simailarContent(similarGuides);
  console.log("[DEBUG]] ai.embedding.ts. findRelevantContent (simailarJointStr):", simailarJointStr);
  return simailarJointStr;
};

const simailarContent = (similarGuides: Array<{ name: string; similarity: number }>) => {
  return similarGuides.map(g => g.name).join('\n');
}