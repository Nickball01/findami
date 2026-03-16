export const config = { runtime: 'edge' };

export default async function handler(req) {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const { keyword } = await req.json();

  if (!keyword) {
    return new Response(JSON.stringify({ error: 'keyword mancante' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 20,
      messages: [{
        role: 'user',
        content: 'Classifica questa parola o frase in una categoria semantica breve in italiano (massimo 3 parole, solo la categoria, niente altro, tutto minuscolo): ' + keyword
      }]
    })
  });

  const data = await res.json();
  const categoria = data.content[0].text.trim().toLowerCase();

  return new Response(JSON.stringify({ categoria }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
