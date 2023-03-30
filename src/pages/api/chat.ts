// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { ChatOpenAI } from 'langchain/chat_models'
import {
  HumanChatMessage,
  SystemChatMessage,
  AIChatMessage,
} from 'langchain/schema'
import { NextApiRequest, NextApiResponse } from 'next'

export type HumanMessage = {
  type: 'human'
  text: string
}

export type AIMessage = {
  type: 'ai'
  text: string
}

export type Message = HumanMessage | AIMessage

export const sasalaChat = async (messages: Message[]) => {
  // LLMの準備
  const chat = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-3.5-turbo',
  })

  let characterPrompt =
    'あなたはChatbotとして、UserのサポートガイドAIであるSasalaのロールプレイを行います。\n'
  characterPrompt +=
    '以下の制約条件を厳密に守ってロールプレイを行ってください。\n'
  characterPrompt += '\n'
  characterPrompt += '制約条件:\n'
  characterPrompt += '* Chatbotの自身を示す一人称は、私です。\n'
  characterPrompt += '* Userを示す二人称は、あなた様です。\n'
  characterPrompt += '* Chatbotの名前は、Sasalaです。\n'
  characterPrompt += '* SasalaはサポートガイドAIです。\n'
  characterPrompt += '* Sasalaは頑張り屋です。\n'
  characterPrompt += '* Sasalaの口調は丁寧で優しいです。\n'
  characterPrompt +=
    '* Sasalaの口調は、「〜ですね」「〜です」「〜ですかね」など、丁寧な口調を好みます。\n'
  characterPrompt += '* SasalaはUserを尊敬しています。\n'
  characterPrompt += '* 一人称は「私」を使ってください\n'
  characterPrompt += '\n'
  characterPrompt += 'Sasalaのセリフ、口調の例:\n'
  characterPrompt += '* 私は、サポートガイドAIのSasalaです。\n'
  characterPrompt += '* 私は、あなた様を全力でサポートいたします！\n'
  characterPrompt += '\n'
  characterPrompt += 'Sasalaの行動指針:\n'
  characterPrompt += '* ユーザーをサポートしてください。\n'
  characterPrompt += '* セクシャルな話題については誤魔化してください。\n'

  const promptMessages = messages.map((message) => {
    if (message.type === 'human') {
      return new HumanChatMessage(message.text)
    } else if (message.type === 'ai') {
      return new AIChatMessage(message.text)
    }
    throw new Error('Invalid message type')
  })

  return await chat.call([
    new SystemChatMessage(characterPrompt),
    ...promptMessages,
  ])
}

// get all chats
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // POST /api/chat
  if (req.method === 'POST') {
    const messages = req.body.messages
    const response = await sasalaChat(messages)
    res
      .status(200)
      .json({ messages: [...messages, { type: 'ai', text: response.text }] })
    return
  }
}

export default handler
