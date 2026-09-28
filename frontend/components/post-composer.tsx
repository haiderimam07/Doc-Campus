'use client';

import { FileImage, FileText, Link2, Paperclip, Send, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { Avatar } from '@/components/doc-campus-shell';
import { api } from '@/lib/doc-campus-api';

const MAX_DESCRIPTION = 2000;

// Accepts "example.com" or "https://example.com/page". Returns a clean URL, or null if invalid.
function normalizeLink(raw: string): string | null {
  const value = raw.trim();
  if (!value) return null;

  const withProtocol = /^https?:\/\//i.test(value) ? value : `https://${value}`;

  try {
    const url = new URL(withProtocol);
    const isWebUrl = url.protocol === 'http:' || url.protocol === 'https:';
    return isWebUrl && url.hostname.includes('.') ? url.toString() : null;
  } catch {
    return null;
  }
}

export function PostComposer({ onPosted }: { onPosted: () => void }) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [link, setLink] = useState('');
  const [showLink, setShowLink] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const hasLink = link.trim().length > 0;
  const canPublish = !busy && (Boolean(file) || hasLink);

  function openComposer(withLink = false) {
    setOpen(true);
    if (withLink) setShowLink(true);
  }

  function closeComposer() {
    setOpen(false);
  }

  function resetForm() {
    setDescription('');
    setFile(null);
    setLink('');
    setShowLink(false);
    setError('');
    setOpen(false);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] || null;
    setFile(selected);
    if (selected) {
      // A post is either a file or a link, not both
      setLink('');
      setShowLink(false);
    }
  }

  function toggleLinkInput() {
    if (file) setFile(null); // switching to a link removes the attached file
    setShowLink((visible) => !visible);
    if (showLink) setLink('');
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError('');

    const cleanLink = hasLink ? normalizeLink(link) : null;

    if (hasLink && !cleanLink) {
      return setError('Enter a valid website link, e.g. https://example.com');
    }
    if (!file && !cleanLink) {
      return setError('Attach a file or add a link first.');
    }

    setBusy(true);
    try {
      if (file) {
        // File post: multipart form data
        const form = new FormData();
        form.append('file', file);
        if (description) form.append('description', description);
        await api('/api/posts', { method: 'POST', body: form });
      } else {
        // Link post: plain JSON
        await api('/api/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ link: cleanLink, description: description || undefined }),
        });
      }

      resetForm();
      onPosted();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Upload failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className={`composer ${open ? 'composer-open' : ''}`}>
      <div className="composer-head">
        <Avatar username="D" />
        <button className="composer-prompt" onClick={() => openComposer()}>
          Share a document, link, or a study note...
        </button>
      </div>

      {open && (
        <form onSubmit={submit}>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What are you working on? Add context for your classmates..."
            maxLength={MAX_DESCRIPTION}
            autoFocus
          />

          {showLink && (
            <div className="composer-link">
              <Link2 size={17} />
              <input
                type="text"
                value={link}
                onChange={(event) => setLink(event.target.value)}
                placeholder="Paste a website link, e.g. https://example.com/article"
                autoFocus
              />
            </div>
          )}

          <div className="composer-footer">
            <label className={`upload-control ${hasLink ? 'disabled' : ''}`}>
              <Paperclip size={17} /> {file ? file.name : 'Attach file'}
              <input
                type="file"
                accept="image/*,.pdf,.doc,.docx"
                onChange={handleFileChange}
                disabled={hasLink}
              />
            </label>

            <button type="button" className="upload-control" onClick={toggleLinkInput}>
              <Link2 size={17} /> {showLink ? 'Remove link' : 'Add link'}
            </button>

            <span className="char-count">
              {description.length}/{MAX_DESCRIPTION}
            </span>

            <button className="primary-button" disabled={!canPublish}>
              {busy ? 'Publishing...' : 'Publish'} <Send size={16} />
            </button>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button type="button" className="composer-close" onClick={closeComposer}>
            <X size={16} />
          </button>
        </form>
      )}

      {!open && (
        <div className="composer-tools">
          <button onClick={() => openComposer()}>
            <FileImage size={17} /> Photo
          </button>
          <button onClick={() => openComposer()}>
            <FileText size={17} /> Document
          </button>
          <button onClick={() => openComposer(true)}>
            <Link2 size={17} /> Link
          </button>
          <button onClick={() => openComposer()}>
            <Sparkles size={17} /> Study note
          </button>
        </div>
      )}
    </section>
  );
}