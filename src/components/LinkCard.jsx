import { supabase } from '../lib/supabase';
import './LinkCard.css';

const PASTELS = ['#fde2e2', '#e2f0fd', '#e2fde7', '#f0e2fd', '#fdf3e2', '#e2fdfa'];

function pastelFor(id) {
  const index = id.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % PASTELS.length;
  return PASTELS[index];
}

function faviconFor(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return null;
  }
}

export default function LinkCard({ link, categoryName, onLinkUpdated }) {
  const favicon = faviconFor(link.url);

  async function toggleFavorite(e) {
    e.stopPropagation();
    const { data, error } = await supabase
      .from('links')
      .update({ is_favorite: !link.is_favorite })
      .eq('id', link.id)
      .select()
      .single();

    if (!error) onLinkUpdated(data);
  }

  async function moveToTrash(e) {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `Are you sure you want to move "${link.name}" to Trash?`
    );
    if (!confirmDelete) return;

    const { data, error } = await supabase
      .from('links')
      .update({ is_trashed: true })
      .eq('id', link.id)
      .select()
      .single();

    if (!error) onLinkUpdated(data);
  }

  async function restoreFromTrash(e) {
    e.stopPropagation();
    const { data, error } = await supabase
      .from('links')
      .update({ is_trashed: false })
      .eq('id', link.id)
      .select()
      .single();

    if (!error) onLinkUpdated(data);
  }

  async function permanentlyDelete(e) {
    e.stopPropagation();
    const confirmDelete = window.confirm(
      `⚠️ Permanently delete "${link.name}"? This cannot be undone.`
    );
    if (!confirmDelete) return;

    const { error } = await supabase
      .from('links')
      .delete()
      .eq('id', link.id);

    if (!error) {
      // remove from UI
      onLinkUpdated({ ...link, deleted: true });
    }
  }

  return (
    <div
      className="link-card"
      style={{ backgroundColor: pastelFor(link.id) }}
      onClick={() => window.open(link.url, '_blank', 'noopener,noreferrer')}
    >
      {/* Header */}
      <div className="link-card-top">
        <div className="link-card-icon">
          {favicon ? (
            <img src={favicon} alt={`${link.name} favicon`} width="28" height="28" />
          ) : (
            <span>🔗</span>
          )}
        </div>
        <div className="link-card-actions">
          {!link.is_trashed ? (
            <>
              <button
                className={`favorite-btn ${link.is_favorite ? 'active' : ''}`}
                onClick={toggleFavorite}
              >
                ⭐
              </button>
              <button className="trash-btn" onClick={moveToTrash}>
                🗑️
              </button>
            </>
          ) : (
            <>
              <button className="restore-btn" onClick={restoreFromTrash}>
                ♻️ Restore
              </button>
              <button className="delete-btn" onClick={permanentlyDelete}>
                ❌ Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Body */}
      <h3 className="link-card-name">{link.name}</h3>
      <p className="link-card-domain">
        {(() => {
          try {
            return new URL(link.url).hostname;
          } catch {
            return link.url;
          }
        })()}
      </p>

      {/* Tags */}
      <div className="link-card-tags">
        <span className="link-card-tag type-tag">{link.type}</span>
        {categoryName && <span className="link-card-tag category-tag">{categoryName}</span>}
      </div>
    </div>
  );
}
