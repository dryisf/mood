function createURL(path: string) {
  return window.location.origin + path;
}

export async function createNewEntry() {
  const response = await fetch(
    new Request(createURL('/api/journal'), {
      method: 'POST',
    })
  );

  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
}

export async function updateEntry(id: string, content: string) {
  const response = await fetch(
    new Request(createURL(`/api/journal/${id}`), {
      method: 'PATCH',
      body: JSON.stringify({ content }),
    })
  );

  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
}

export async function askQuestion(question) {
  const response = await fetch(
    new Request(createURL('/api/question'), {
      method: 'POST',
      body: JSON.stringify({ question }),
    })
  );

  if (response.ok) {
    const data = await response.json();
    return data.data;
  }
}
