'use client';

import { updateEntry } from '@/utils/api';
import { useRef, useState } from 'react';

export default function Editor({ entry }) {
  const timeoutRef = useRef<number | null>(null);
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);

  const { mood, summary, color, subject, negative } = analysis;

  const analysisData = [
    { name: 'Summary', value: summary },
    { name: 'Subject', value: subject },
    { name: 'Mood', value: mood },
    { name: 'Negative', value: negative ? 'True' : 'False' },
  ];

  async function saveChange(_value: string) {
    setIsLoading(true);
    const data = await updateEntry(entry.id, _value);
    setAnalysis(data.analysis);
    setIsLoading(false);
  }

  function onChange(_value: string) {
    setValue(_value);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      saveChange(_value);
    }, 2500);
  }

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isLoading && <div>...Loading</div>}
        <textarea
          className="w-full h-full p-8 text-xl outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        ></textarea>
      </div>
      <div className="border-l border-black/10">
        <div className="px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul>
            {analysisData.map((data) => (
              <li
                key={data.name}
                className="px-2 py-4 flex items-center justify-between border-b border-t border-black/10"
              >
                <span className="text-lg font-semibold">{data.name}</span>
                <span>{data.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
