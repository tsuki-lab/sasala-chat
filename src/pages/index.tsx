import axios from 'axios'
import { NextPage } from 'next'
import { useState } from 'react'
import { HumanMessage, Message } from './api/chat'

export const Home: NextPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true)
    e.preventDefault()
    const form = e.currentTarget
    const formData = new FormData(form)
    const text = formData.get('message')
    if (typeof text !== 'string' || text.length < 1) return

    const message: HumanMessage = {
      type: 'human',
      text: text as string,
    }
    setMessages((prev) => [...prev, message])
    form.message.value = ''

    const res = await axios.post('/api/chat', {
      messages: [...messages, message],
    })

    setMessages((prev) => [
      ...prev,
      res.data.messages[res.data.messages.length - 1],
    ])
    setLoading(false)
  }

  return (
    <div>
      <form onSubmit={submitHandler}>
        <input
          style={{ padding: '8px 4px', width: 300 }}
          type="text"
          name="message"
          required
          autoComplete="off"
        />
        <button
          style={{ height: 35, width: 60 }}
          type="submit"
          disabled={loading}
        >
          送信
        </button>
      </form>
      <div style={{ marginTop: 16 }}>
        Sasala「私は、サポートガイドAIのSasalaです。あなた様のお悩みやご質問に最大限の力でお答えできるように頑張ります。何かお困りのことがございましたら、お気軽におっしゃってくださいね。」
      </div>
      {messages.map((message, i) => (
        <div key={i} style={{ marginTop: 16 }}>
          {message.type === 'human' ? 'あなた' : 'Sasala'}「{message.text}」
        </div>
      ))}
      {loading && (
        <div style={{ marginTop: 16 }}>Sasala「お待ちくださいね。」</div>
      )}
    </div>
  )
}

export default Home
