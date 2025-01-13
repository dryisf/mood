'use client';

import { askQuestion } from '@/utils/api';
import { useState } from 'react';

export default function Question() {
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const [response, setResponse] = useState('');

  function onChange(e) {
    setValue(e.target.value);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const answer = await askQuestion(value);
    setResponse(answer);
    setValue('');
    setLoading(false);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          disabled={loading}
          onChange={onChange}
          value={value}
          type="text"
          placeholder="Ask a question"
          className="border border-black/20 px-4 py-2 text-lg rounded-lg"
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-blue-400 px-4 py-2 rounded-lg text-lg"
        >
          Ask
        </button>
      </form>
      {loading && <div>Loading...</div>}
      {response && <div>{response}</div>}
    </div>
  );
}
