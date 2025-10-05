import React, { useCallback, useMemo, useState } from 'react';
import { Input } from '@shadcn-components/ui/input';
import { Textarea } from '@shadcn-components/ui/textarea';
import { Button } from '@shadcn-components/ui/button';
import BaseTextareaCopy from '@components/common/BaseTextareaCopy';

type Header = { key: string; value: string };

const DEFAULT_ENDPOINT = 'https://ethereum-rpc.publicnode.com';
const DEFAULT_BODY = JSON.stringify(
  {
    jsonrpc: '2.0',
    id: 1,
    method: 'eth_blockNumber',
    params: [],
  },
  null,
  2
);

export default function KrainodePlayground() {
  const [endpoint, setEndpoint] = useState<string>(DEFAULT_ENDPOINT);
  const [headers, setHeaders] = useState<Header[]>([]);
  const [body, setBody] = useState<string>(DEFAULT_BODY);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<string>('');

  const headersRecord = useMemo<Record<string, string>>(() => {
    const rec: Record<string, string> = { 'content-type': 'application/json' };
    headers
      .filter((h) => h.key.trim().length > 0)
      .forEach((h) => (rec[h.key] = h.value));
    return rec;
  }, [headers]);

  const addHeader = () => setHeaders((h) => [...h, { key: '', value: '' }]);
  const removeHeader = (idx: number) =>
    setHeaders((h) => h.filter((_, i) => i !== idx));
  const updateHeader = (idx: number, field: 'key' | 'value', v: string) =>
    setHeaders((h) =>
      h.map((item, i) => (i === idx ? { ...item, [field]: v } : item))
    );

  const onSend = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResponse('');
    let parsed: any = null;
    try {
      parsed = JSON.parse(body);
    } catch {
      setLoading(false);
      setError('Body must be valid JSON.');
      return;
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: headersRecord,
        body: JSON.stringify(parsed),
      });
      const text = await res.text();
      try {
        const obj = JSON.parse(text);
        setResponse(JSON.stringify(obj, null, 2));
      } catch {
        setResponse(text);
      }
    } catch (e: any) {
      setError(
        e?.message ||
          'Network error. Some RPCs block browser requests via CORS; try another endpoint.'
      );
    } finally {
      setLoading(false);
    }
  }, [endpoint, headersRecord, body]);

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
        <div className="lg:col-span-4">
          <label className="text-sm font-medium">RPC Endpoint</label>
          <Input
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="https://..."
          />
        </div>
        <div className="lg:col-span-2 flex items-end">
          <Button onClick={onSend} disabled={loading} className="w-full">
            {loading ? 'Sending…' : 'Send'}
          </Button>
        </div>
      </div>

      {/* Optional headers */}
      <div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Headers (optional)</label>
          <Button variant="outline" onClick={addHeader} type="button">
            Add header
          </Button>
        </div>
        {headers.length === 0 ? (
          <p className="text-xs text-gray-500 mt-2">
            No custom headers. <span className="font-medium">Content-Type: application/json</span> will be sent by default.
          </p>
        ) : null}
        <div className="mt-2 flex flex-col gap-2">
          {headers.map((h, i) => (
            <div className="grid grid-cols-12 gap-2" key={`hdr-${i}`}>
              <Input
                className="col-span-5"
                placeholder="Key (e.g. Authorization)"
                value={h.key}
                onChange={(e) => updateHeader(i, 'key', e.target.value)}
              />
              <Input
                className="col-span-6"
                placeholder="Value"
                value={h.value}
                onChange={(e) => updateHeader(i, 'value', e.target.value)}
              />
              <Button
                className="col-span-1"
                variant="destructive"
                onClick={() => removeHeader(i)}
                type="button"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Request body */}
      <div>
        <label className="text-sm font-medium">JSON Body</label>
        <Textarea
          className="mt-2 h-56 font-mono"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <p className="text-xs text-gray-500 mt-1">
          Tip: This runs entirely in your browser. Avoid pasting sensitive keys; some RPCs may not allow browser requests due to CORS.
        </p>
      </div>

      {error ? (
        <div className="rounded-md border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {/* Response */}
      <div>
        <label className="text-sm font-medium">Response</label>
        <div className="mt-2 [&_textarea]:min-h-[20rem] [&_textarea]:resize-y [&_textarea]:w-full [&_textarea]:max-w-full[&_textarea]:font-mono">
          <BaseTextareaCopy
            value={response}
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <p className="text-xs text-gray-400">
          powered by{' '}
          <a
            href="https://krainode.krissemmy.com"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-gray-600"
          >
            KraiNode
          </a>
        </p>
      </div>
    </div>
  );
}
