import './Sidebar.css';

export default function Sidebar({
  categories,
  links,
  activeCategory,
  onSelectCategory,
  onNewCategory,
  profile,
  isOpen,
  onClose,
}) {
  const countFor = (categoryId) =>
    links.filter((l) => l.category_id === categoryId).length;

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      {/* Brand Header */}
      <div className="sidebar-brand">
        <span className="sidebar-logo">🔗</span>
        <div className="sidebar-title-group">
          <span className="sidebar-title">Linkie</span>
          <small className="sidebar-subtitle">Save it. Organize it. Find it.</small>
        </div>
        <button className="sidebar-close-btn" onClick={onClose} aria-label="Close menu">
          ✕
        </button>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        <button
          className={`sidebar-nav-item ${activeCategory === null ? 'active' : ''}`}
          onClick={() => onSelectCategory(null)}
        >
          🏠 All Links
        </button>
        <button
          className={`sidebar-nav-item ${activeCategory === 'favorites' ? 'active' : ''}`}
          onClick={() => onSelectCategory('favorites')}
        >
          ⭐ Favorites
        </button>
        <button
          className={`sidebar-nav-item ${activeCategory === 'trash' ? 'active' : ''}`}
          onClick={() => onSelectCategory('trash')}
        >
          🗑️ Trash
        </button>
      </nav>

      {/* Categories */}
      <div className="sidebar-categories">
        <p className="sidebar-section-label">Categories</p>
        {categories.map((cat) => (
          <button
            key={cat.id}
            className={`sidebar-category-item ${activeCategory === cat.id ? 'active' : ''}`}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span>📁 {cat.name}</span>
            <span className="category-count">{countFor(cat.id)}</span>
          </button>
        ))}
        <button className="sidebar-new-category" onClick={onNewCategory}>
          + New Category
        </button>
      </div>

      {/* Upgrade Section */}
      <div className="sidebar-upgrade">
        <p className="upgrade-title">Upgrade to Pro</p>
        <p className="upgrade-desc">Unlock more features and increase your storage.</p>
        <button className="upgrade-btn">Upgrade Now</button>
      </div>

      {/* Profile Section */}
      <div className="sidebar-profile">
        <img
          src={profile?.avatar_url}
          alt={profile?.display_name}
          className="sidebar-avatar"
        />
        <div className="sidebar-user-info">
          <span className="sidebar-username">{profile?.display_name}</span>
          <button className="signout-btn">Log out</button>
        </div>
      </div>
    </aside>
  );
}
