import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import LinkCard from '../components/LinkCard';
import AddLinkModal from '../components/AddLinkModal';
import './Dashboard.css';

export default function Dashboard() {
  const { profile, currentUser, signOut } = useAuth();

  const [links, setLinks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [theme, setTheme] = useState('violet'); // violet, black, white

  const displayName = profile?.display_name || currentUser?.user_metadata?.full_name || 'there';
  const avatarUrl = profile?.avatar_url || currentUser?.user_metadata?.avatar_url;

  useEffect(() => {
    if (profile?.id) {
      loadData();
    }
  }, [profile?.id]);

  async function loadData() {
    setLoading(true);

    const [linksRes, categoriesRes] = await Promise.all([
      supabase
        .from('links')
        .select('*')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false }),
      supabase
        .from('categories')
        .select('*')
        .eq('user_id', profile.id)
        .order('name')
    ]);

    if (!linksRes.error) setLinks(linksRes.data);
    if (!categoriesRes.error) setCategories(categoriesRes.data);
    setLoading(false);
  }

  function handleLinkAdded(newLink) {
    setLinks((prev) => [newLink, ...prev]);
  }

  // 🔑 NEW: update handler for favorites/trash
  function handleLinkUpdated(updatedLink) {
    setLinks((prev) =>
      prev.map((l) => (l.id === updatedLink.id ? updatedLink : l))
    );
  }

  async function handleNewCategory() {
    const name = prompt('Enter a new category name:');
    if (!name) return;

    const { data, error } = await supabase
      .from('categories')
      .insert({ user_id: profile.id, name })
      .select()
      .single();

    if (!error) setCategories((prev) => [...prev, data]);
  }

  function categoryNameFor(categoryId) {
    return categories.find((c) => c.id === categoryId)?.name;
  }

  // Filtering logic for Favorites, Trash, Categories
  const visibleLinks = links
    .filter((l) => {
      if (activeCategory === 'favorites') return l.is_favorite;
      if (activeCategory === 'trash') return l.is_trashed;
      if (activeCategory) return l.category_id === activeCategory;
      return !l.is_trashed; // default: show all except trashed
    })
    .filter((l) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.url.toLowerCase().includes(q) ||
        l.type.toLowerCase().includes(q)
      );
    });

  return (
    <div className="dashboard-layout" data-theme={theme}>
      <Sidebar
        categories={categories}
        links={links}
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        onNewCategory={handleNewCategory}
        profile={profile}
      />

      <div className="dashboard-main">
        {/* Top Bar */}
        <header className="dashboard-topbar">
          <input
            className="dashboard-search"
            type="text"
            placeholder="🔍 Search your links..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="dashboard-topbar-actions">
            <button className="add-link-button" onClick={() => setShowAddModal(true)}>
              + Add New Link
            </button>

            <div className="theme-selector">
              <select value={theme} onChange={(e) => setTheme(e.target.value)}>
                <option value="violet">Linkie Violet</option>
                <option value="black">Black</option>
                <option value="white">White</option>
              </select>
            </div>

            <div className="dashboard-profile">
              {avatarUrl ? (
                <img src={avatarUrl} alt="" className="profile-avatar" />
              ) : (
                <div className="profile-avatar-fallback">{displayName[0]}</div>
              )}
              <span>{displayName}</span>
              <button className="logout-link" onClick={signOut}>Log out</button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="dashboard-content">
          {loading ? (
            <p className="dashboard-loading">Loading your links...</p>
          ) : visibleLinks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🔗</div>
              <h2>
                {links.length === 0
                  ? `Welcome to Linkie, ${displayName}! 👋`
                  : 'No links found.'}
              </h2>
              <p>
                {links.length === 0
                  ? "You haven't saved any links yet. Start by adding your first link."
                  : 'Try another search or category.'}
              </p>
              {links.length === 0 && (
                <button className="add-link-button" onClick={() => setShowAddModal(true)}>
                  + Add Your First Link
                </button>
              )}
            </div>
          ) : (
            <>
              <h1 className="dashboard-heading">
                {activeCategory === 'favorites'
                  ? 'Favorites'
                  : activeCategory === 'trash'
                  ? 'Trash'
                  : activeCategory
                  ? categoryNameFor(activeCategory)
                  : 'All Links'}
              </h1>
              <p className="dashboard-subheading">You have {visibleLinks.length} links saved</p>
              <div className="link-grid">
                {visibleLinks.map((link) => (
                  <LinkCard
                    key={link.id}
                    link={link}
                    categoryName={categoryNameFor(link.category_id)}
                    onLinkUpdated={handleLinkUpdated}  
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {showAddModal && (
        <AddLinkModal
          profileId={profile.id}
          categories={categories}
          onClose={() => setShowAddModal(false)}
          onLinkAdded={handleLinkAdded}
        />
      )}
    </div>
  );
}

