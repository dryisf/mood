import { Document } from '@langchain/core/documents';
import { StructuredOutputParser } from '@langchain/core/output_parsers';
import { PromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { loadQARefineChain } from 'langchain/chains';
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import z from 'zod';

const parser = StructuredOutputParser.fromZodSchema(
  z.object({
    sentimentScore: z
      .number()
      .describe(
        'sentiment of the text and rated on a scale from -10 to 10, where -10 is extremely negative, 0 is neutral, and 10 is extremely positive.'
      ),
    mood: z
      .string()
      .describe('the mood of the person who wrote the journal entry'),
    subject: z.string().describe('the subject of the journal entry'),
    summary: z.string().describe('a summary of the journal entry'),
    negative: z
      .boolean()
      .describe(
        'whether the journal entry is negative (i.e. does it contain negative emotions ?)'
      ),
    color: z
      .string()
      .describe(
        'a hexadecimal color code representing the mood of the journal entry. Example #0101fe for blue representing happiness. The color must never be black. I want joyful colors for good mood and sad colors for bad mood'
      ),
  })
);

async function getPrompt(content: string) {
  const format_instructions = parser.getFormatInstructions();

  const prompt = new PromptTemplate({
    template:
      'Analyze the following journal entry. Follow the instructions and format your response to match the format instructions, no matter what! \n{format_instructions}\n{entry}',
    inputVariables: ['entry'],
    partialVariables: { format_instructions },
  });

  const input = await prompt.format({ entry: content });

  return input;
}

export async function analyze(prompt: string) {
  const input = await getPrompt(prompt);
  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  });
  const result = await model.invoke(input);

  try {
    return parser.parse(result.content);
  } catch (e) {
    console.error(e);
  }
}

export async function qa(question, entries) {
  const docs = entries.map(
    (entry) =>
      new Document({
        pageContent: entry.content,
        metadata: { id: entry.id, createdAt: entry.createdAt },
      })
  );

  const model = new ChatOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    temperature: 0,
    modelName: 'gpt-3.5-turbo',
  });

  const chain = loadQARefineChain(model);

  const embeddings = new OpenAIEmbeddings();

  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);

  const relevantDocs = await store.similaritySearch(question, 5);

  const result = await chain.invoke({
    input_documents: relevantDocs,
    question,
  });

  return result.output_text;
}
