import { useState } from "react";
import { supabase } from "../utils";
import { Icon } from "../icons";
import { VenueFormPanel } from "./VenueFormPanel";

// ── Venue detail slide-over ────────────────────────────────────────────────────
function VenueDetailPanel({ venue, posts, onClose, onEdit, setPage }) {
  const linkedPosts = posts.filter(
    p => p.venue?.toLowerCase() === venue.venue_name?.toLowerCase()
  );

  return (
    <div className="ss-backdrop" onClick={onClose}>
      <div className="ss-panel" onClick={e => e.stopPropagation()}>
        <div className="ss-panel-header">
          <h2 className="ss-panel-title">{venue.venue_name}</h2>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="btn btn-secondary"
              style={{ padding: "6px 14px", fontSize: 13 }}
              onClick={onEdit}
            >
              Edit
            </button>
            <button className="ss-close-btn" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="ss-panel-body venue-detail-body">
          {/* Key facts */}
          <div className="venue-detail-facts">
            {venue.location && (
              <div className="venue-detail-fact">
                <span className="venue-detail-fact-label">Location</span>
                <span className="venue-detail-fact-value">{venue.location}</span>
              </div>
            )}
            {venue.venue_type && (
              <div className="venue-detail-fact">
                <span className="venue-detail-fact-label">Type</span>
                <span className="venue-detail-fact-value">{venue.venue_type}</span>
              </div>
            )}
            {venue.indoor_outdoor && (
              <div className="venue-detail-fact">
                <span className="venue-detail-fact-label">Setting</span>
                <span className="venue-detail-fact-value" style={{ textTransform: "capitalize" }}>{venue.indoor_outdoor}</span>
              </div>
            )}
            {venue.capacity && (
              <div className="venue-detail-fact">
                <span className="venue-detail-fact-label">Capacity</span>
                <span className="venue-detail-fact-value">{venue.capacity}</span>
              </div>
            )}
            {venue.website_url && (
              <div className="venue-detail-fact">
                <span className="venue-detail-fact-label">Website</span>
                <a
                  href={venue.website_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="venue-detail-link"
                  onClick={e => e.stopPropagation()}
                >
                  {venue.website_url}
                </a>
              </div>
            )}
          </div>

          {venue.lighting_notes && (
            <div className="venue-detail-section">
              <div className="venue-detail-section-title">Lighting Notes</div>
              <p className="venue-detail-text">{venue.lighting_notes}</p>
            </div>
          )}

          {venue.filming_highlights && (
            <div className="venue-detail-section">
              <div className="venue-detail-section-title">Filming Highlights</div>
              <p className="venue-detail-text">{venue.filming_highlights}</p>
            </div>
          )}

          {(venue.general_notes || venue.style_notes) && (
            <div className="venue-detail-section">
              <div className="venue-detail-section-title">General Notes</div>
              <p className="venue-detail-text">{venue.general_notes || venue.style_notes}</p>
            </div>
          )}

          {/* Past films */}
          <div className="venue-detail-section">
            <div className="venue-detail-section-title">
              Past Films ({linkedPosts.length})
            </div>
            {linkedPosts.length > 0 ? (
              <div className="venue-linked-posts">
                {linkedPosts.map(post => (
                  <div
                    key={post.id}
                    className="venue-linked-post"
                    title="Go to History"
                    onClick={() => { onClose(); setPage("history"); }}
                  >
                    <div className="venue-linked-post-title">{post.yt_title || "Untitled"}</div>
                    <div className="venue-linked-post-meta">
                      <span>{new Date(post.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      <span className={`venue-linked-post-status ${post.status === "published" ? "published" : "draft"}`}>
                        {post.status === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{ color: "var(--text-muted)", fontSize: 13, margin: 0 }}>
                No films recorded at this venue yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Delete confirmation ────────────────────────────────────────────────────────
function VenueDeleteConfirm({ onCancel, onConfirm, deleting }) {
  return (
    <div className="delete-dialog-backdrop" onClick={onCancel}>
      <div className="delete-dialog" onClick={e => e.stopPropagation()}>
        <h3 className="delete-dialog-title">Delete this venue?</h3>
        <p className="delete-dialog-body">
          This removes it from your library. Existing posts are not affected. This cannot be undone.
        </p>
        <div className="delete-dialog-actions">
          <button className="btn btn-secondary" onClick={onCancel} disabled={deleting}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={deleting}>
            {deleting ? <span className="spinner" /> : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── VenuePage ──────────────────────────────────────────────────────────────────
export function VenuePage({ user, posts, venues, onVenuesChange, setPage }) {
  const [formOpen, setFormOpen] = useState(false);
  const [editVenue, setEditVenue] = useState(null);
  const [detailVenue, setDetailVenue] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const openAdd = () => { setEditVenue(null); setFormOpen(true); };
  const openEdit = (v) => { setEditVenue(v); setDetailVenue(null); setFormOpen(true); };

  const handleSaved = () => {
    setFormOpen(false);
    setEditVenue(null);
    onVenuesChange();
  };

  const handleDeleteConfirm = async () => {
    setDeleting(true);
    setDeleteError("");
    const { error } = await supabase.from("venues").delete().eq("id", deleteId);
    if (error == null) {
      setDeleteId(null);
      onVenuesChange();
    } else {
      setDeleteError(error.message || "Delete failed.");
      setDeleteId(null);
    }
    setDeleting(false);
  };

  const getPostCount = (venueName) =>
    posts.filter(p => p.venue?.toLowerCase() === venueName?.toLowerCase()).length;

  return (
    <>
      <div className="main-header">
        <div>
          <h1 className="page-title">Venue Library</h1>
          <p className="page-description">Save venues to enrich your content generation automatically.</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Icon.Plus /> Add Venue
        </button>
      </div>

      <div className="main-body">
        {deleteError && (
          <div className="alert alert-error" style={{ marginBottom: 16 }}>{deleteError}</div>
        )}

        {venues.length > 0 ? (
          <div className="venue-grid">
            {venues.map(venue => {
              const postCount = getPostCount(venue.venue_name);
              return (
                <div
                  key={venue.id}
                  className="venue-card"
                  onClick={() => setDetailVenue(venue)}
                >
                  <div className="venue-card-body">
                    <div className="venue-card-name">{venue.venue_name}</div>
                    {venue.location && (
                      <div className="venue-card-location">{venue.location}</div>
                    )}
                    <div className="venue-card-badges">
                      {venue.venue_type && <span className="venue-badge">{venue.venue_type}</span>}
                      {venue.indoor_outdoor && venue.indoor_outdoor !== "both" && (
                        <span className="venue-badge" style={{ textTransform: "capitalize" }}>{venue.indoor_outdoor}</span>
                      )}
                    </div>
                  </div>
                  <div className="venue-card-footer">
                    <span className="venue-card-posts">
                      {postCount} film{postCount !== 1 ? "s" : ""}
                    </span>
                    <div className="venue-card-actions">
                      <button
                        className="venue-card-action-btn"
                        onClick={e => { e.stopPropagation(); openEdit(venue); }}
                      >
                        Edit
                      </button>
                      <button
                        className="venue-card-action-btn venue-card-action-delete"
                        onClick={e => { e.stopPropagation(); setDeleteId(venue.id); }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="card">
            <div className="card-body">
              <div className="empty-state">
                <div className="empty-icon"><Icon.MapPin /></div>
                <h4 className="empty-title">No venues yet</h4>
                <p className="empty-desc">
                  Add your first venue to start building your library. The next time you film there,
                  FilmPost will automatically use your saved notes to write richer content.
                </p>
                <button className="btn btn-primary" style={{ marginTop: 20 }} onClick={openAdd}>
                  Add Your First Venue
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {formOpen && (
        <VenueFormPanel
          venue={editVenue}
          userId={user.id}
          onClose={() => { setFormOpen(false); setEditVenue(null); }}
          onSaved={handleSaved}
        />
      )}

      {detailVenue && (
        <VenueDetailPanel
          venue={detailVenue}
          posts={posts}
          onClose={() => setDetailVenue(null)}
          onEdit={() => openEdit(detailVenue)}
          setPage={setPage}
        />
      )}

      {deleteId && (
        <VenueDeleteConfirm
          onCancel={() => setDeleteId(null)}
          onConfirm={handleDeleteConfirm}
          deleting={deleting}
        />
      )}
    </>
  );
}
