import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { ELEMENT_CATALOG, ELEMENT_CATEGORIES, getElementDefaults } from '../../data/elementDefaults';
import { SECTION_TEMPLATES, SECTION_CATEGORIES } from '../../data/sectionTemplates';
import {
  MdTitle, MdTextFields, MdImage, MdSmartButton, MdOndemandVideo,
  MdDynamicForm, MdSpaceBar, MdHorizontalRule, MdMap, MdShare,
  MdFormatListBulleted, MdViewColumn, MdStarBorder, MdCollections,
  MdTimer, MdFormatQuote, MdWidgets, MdDashboard, MdSettings,
  MdAdd, MdSearch, MdPages,
} from 'react-icons/md';
import './LeftSidebar.css';

const ICON_MAP = {
  MdTitle, MdTextFields, MdImage, MdSmartButton, MdOndemandVideo,
  MdDynamicForm, MdSpaceBar, MdHorizontalRule, MdMap, MdShare,
  MdFormatListBulleted, MdViewColumn, MdStarBorder, MdCollections,
  MdTimer, MdFormatQuote,
};

const SECTION_ICON_MAP = {
  Hero: '🎯',
  Features: '⚡',
  About: '👋',
  Contact: '✉️',
  Gallery: '🖼️',
  Testimonials: '💬',
  CTA: '🚀',
  Footer: '📋',
};

export default function LeftSidebar() {
  const { state, actions } = useBuilder();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSectionCat, setActiveSectionCat] = useState('all');

  const panels = [
    { id: 'elements', icon: MdWidgets, label: 'Elements' },
    { id: 'sections', icon: MdDashboard, label: 'Sections' },
    { id: 'pages', icon: MdPages, label: 'Pages' },
    { id: 'settings', icon: MdSettings, label: 'Settings' },
  ];

  const filteredElements = ELEMENT_CATALOG.filter(el => {
    const matchesSearch = el.label.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || el.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const filteredSections = SECTION_TEMPLATES.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = activeSectionCat === 'all' || t.category === activeSectionCat;
    return matchesSearch && matchesCat;
  });

  const handleAddElement = (type) => {
    const sections = state.pages.find(p => p.id === state.activePage)?.sections || [];
    if (sections.length === 0) return;
    const targetSection = state.selectedSection || sections[sections.length - 1].id;
    const element = getElementDefaults(type);
    actions.addElement(targetSection, element);
  };

  const handleAddSection = (template) => {
    const section = template.create();
    actions.addSection(section);
  };

  const renderElementsPanel = () => (
    <div className="pb-left-panel-content">
      <div className="pb-left-search">
        <MdSearch size={18} />
        <input
          type="text"
          placeholder="Search elements..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="pb-left-categories">
        <button
          className={`pb-left-cat-btn ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All
        </button>
        {Object.values(ELEMENT_CATEGORIES).map(cat => (
          <button
            key={cat}
            className={`pb-left-cat-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="pb-left-elements-grid">
        {filteredElements.map(el => {
          const IconComp = ICON_MAP[el.icon];
          return (
            <button
              key={el.type}
              className="pb-left-element-item"
              onClick={() => handleAddElement(el.type)}
              title={`Add ${el.label}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('element-type', el.type);
                e.dataTransfer.effectAllowed = 'copy';
              }}
            >
              <div className="pb-left-element-icon">
                {IconComp ? <IconComp size={22} /> : <MdWidgets size={22} />}
              </div>
              <span className="pb-left-element-label">{el.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSectionsPanel = () => (
    <div className="pb-left-panel-content">
      <div className="pb-left-search">
        <MdSearch size={18} />
        <input
          type="text"
          placeholder="Search sections..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="pb-left-categories">
        <button
          className={`pb-left-cat-btn ${activeSectionCat === 'all' ? 'active' : ''}`}
          onClick={() => setActiveSectionCat('all')}
        >
          All
        </button>
        {SECTION_CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`pb-left-cat-btn ${activeSectionCat === cat ? 'active' : ''}`}
            onClick={() => setActiveSectionCat(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="pb-left-sections-list">
        {filteredSections.map(template => (
          <button
            key={template.id}
            className="pb-left-section-item"
            onClick={() => handleAddSection(template)}
          >
            <div className="pb-left-section-thumbnail">
              <span className="pb-left-section-emoji">
                {SECTION_ICON_MAP[template.category] || '📦'}
              </span>
            </div>
            <div className="pb-left-section-info">
              <span className="pb-left-section-name">{template.name}</span>
              <span className="pb-left-section-category">{template.category}</span>
            </div>
            <MdAdd size={18} className="pb-left-section-add" />
          </button>
        ))}
      </div>
    </div>
  );

  const renderPagesPanel = () => {
    const currentPage = state.pages.find(p => p.id === state.activePage);
    return (
      <div className="pb-left-panel-content">
        <div className="pb-left-pages-header">
          <h3>Pages</h3>
          <button className="pb-left-add-page-btn" onClick={() => actions.addPage()}>
            <MdAdd size={18} /> Add Page
          </button>
        </div>
        <div className="pb-left-pages-list">
          {state.pages.map(page => (
            <div
              key={page.id}
              className={`pb-left-page-item ${state.activePage === page.id ? 'active' : ''}`}
              onClick={() => actions.setActivePage(page.id)}
            >
              <MdPages size={18} />
              <span>{page.name}</span>
              <span className="pb-left-page-sections-count">
                {page.sections.length} sections
              </span>
              {state.pages.length > 1 && (
                <button
                  className="pb-left-page-delete"
                  onClick={(e) => { e.stopPropagation(); actions.deletePage(page.id); }}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>

        {currentPage && (
          <>
            <div className="pb-left-layers-header">
              <h4>Layers</h4>
            </div>
            <div className="pb-left-layers-list">
              {currentPage.sections.map((section, idx) => (
                <div key={section.id} className="pb-left-layer-section">
                  <div
                    className={`pb-left-layer-item pb-left-layer-section-item ${state.selectedSection === section.id ? 'active' : ''}`}
                    onClick={() => actions.selectSection(section.id)}
                  >
                    <span className="pb-left-layer-idx">{idx + 1}</span>
                    <span>{section.name || 'Section'}</span>
                  </div>
                  {section.elements.map(el => (
                    <div
                      key={el.id}
                      className={`pb-left-layer-item pb-left-layer-element-item ${state.selectedElement === el.id ? 'active' : ''}`}
                      onClick={() => actions.selectElement(el.id, section.id)}
                    >
                      <span className="pb-left-layer-type">{el.type}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  const renderSettingsPanel = () => (
    <div className="pb-left-panel-content">
      <h3 className="pb-left-settings-title">Page Settings</h3>
      <div className="pb-left-settings-form">
        <label>
          <span>Page Title</span>
          <input
            type="text"
            value={state.pageSettings.title}
            onChange={(e) => actions.updatePageSettings({ title: e.target.value })}
          />
        </label>
        <label>
          <span>Font Family</span>
          <select
            value={state.pageSettings.fontFamily}
            onChange={(e) => actions.updatePageSettings({ fontFamily: e.target.value })}
          >
            <option value="'Inter', sans-serif">Inter</option>
            <option value="'Roboto', sans-serif">Roboto</option>
            <option value="'Open Sans', sans-serif">Open Sans</option>
            <option value="'Poppins', sans-serif">Poppins</option>
            <option value="'Montserrat', sans-serif">Montserrat</option>
            <option value="'Playfair Display', serif">Playfair Display</option>
            <option value="'Lato', sans-serif">Lato</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Arial, sans-serif">Arial</option>
          </select>
        </label>
        <label>
          <span>Primary Color</span>
          <div className="pb-left-color-input">
            <input
              type="color"
              value={state.pageSettings.primaryColor}
              onChange={(e) => actions.updatePageSettings({ primaryColor: e.target.value })}
            />
            <input
              type="text"
              value={state.pageSettings.primaryColor}
              onChange={(e) => actions.updatePageSettings({ primaryColor: e.target.value })}
            />
          </div>
        </label>
        <label>
          <span>Body Background</span>
          <div className="pb-left-color-input">
            <input
              type="color"
              value={state.pageSettings.bodyBackground}
              onChange={(e) => actions.updatePageSettings({ bodyBackground: e.target.value })}
            />
            <input
              type="text"
              value={state.pageSettings.bodyBackground}
              onChange={(e) => actions.updatePageSettings({ bodyBackground: e.target.value })}
            />
          </div>
        </label>
      </div>
    </div>
  );

  return (
    <div className="pb-left-sidebar">
      <div className="pb-left-tabs">
        {panels.map(panel => {
          const Icon = panel.icon;
          return (
            <button
              key={panel.id}
              className={`pb-left-tab ${state.leftPanel === panel.id ? 'active' : ''}`}
              onClick={() => actions.setLeftPanel(panel.id)}
              title={panel.label}
            >
              <Icon size={20} />
              <span>{panel.label}</span>
            </button>
          );
        })}
      </div>

      <div className="pb-left-panel">
        <h2 className="pb-left-panel-title">
          {panels.find(p => p.id === state.leftPanel)?.label}
        </h2>
        {state.leftPanel === 'elements' && renderElementsPanel()}
        {state.leftPanel === 'sections' && renderSectionsPanel()}
        {state.leftPanel === 'pages' && renderPagesPanel()}
        {state.leftPanel === 'settings' && renderSettingsPanel()}
      </div>
    </div>
  );
}
