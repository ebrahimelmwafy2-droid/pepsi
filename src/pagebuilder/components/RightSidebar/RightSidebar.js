import React, { useState } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { findElementInSections } from '../../utils/helpers';
import { MdClose, MdStyle, MdTune, MdFormatPaint } from 'react-icons/md';
import './RightSidebar.css';

export default function RightSidebar() {
  const { state, actions } = useBuilder();
  const [activeTab, setActiveTab] = useState('content');

  const currentPage = state.pages.find(p => p.id === state.activePage);
  const sections = currentPage ? currentPage.sections : [];

  if (state.selectedSection && !state.selectedElement) {
    const section = sections.find(s => s.id === state.selectedSection);
    if (!section) return null;
    return (
      <div className="pb-right-sidebar">
        <div className="pb-right-header">
          <h3>Section Settings</h3>
          <button className="pb-right-close" onClick={() => actions.selectSection(null)}>
            <MdClose size={18} />
          </button>
        </div>
        <div className="pb-right-content">
          <SectionEditor section={section} actions={actions} />
        </div>
      </div>
    );
  }

  if (!state.selectedElement) return null;

  const result = findElementInSections(sections, state.selectedElement);
  if (!result) return null;

  const { element, sectionId } = result;

  const handleUpdateContent = (updates) => {
    actions.updateElement(sectionId, element.id, {
      content: { ...element.content, ...updates },
    });
  };

  const handleUpdateStyle = (updates) => {
    actions.updateElement(sectionId, element.id, {
      style: { ...element.style, ...updates },
    });
  };

  return (
    <div className="pb-right-sidebar">
      <div className="pb-right-header">
        <h3>{element.type.charAt(0).toUpperCase() + element.type.slice(1)}</h3>
        <button className="pb-right-close" onClick={() => actions.selectElement(null, null)}>
          <MdClose size={18} />
        </button>
      </div>

      <div className="pb-right-tabs">
        <button className={`pb-right-tab ${activeTab === 'content' ? 'active' : ''}`} onClick={() => setActiveTab('content')}>
          <MdTune size={16} /> Content
        </button>
        <button className={`pb-right-tab ${activeTab === 'style' ? 'active' : ''}`} onClick={() => setActiveTab('style')}>
          <MdStyle size={16} /> Style
        </button>
        <button className={`pb-right-tab ${activeTab === 'advanced' ? 'active' : ''}`} onClick={() => setActiveTab('advanced')}>
          <MdFormatPaint size={16} /> Advanced
        </button>
      </div>

      <div className="pb-right-content">
        {activeTab === 'content' && (
          <ContentEditor element={element} onUpdate={handleUpdateContent} />
        )}
        {activeTab === 'style' && (
          <StyleEditor element={element} onUpdate={handleUpdateStyle} />
        )}
        {activeTab === 'advanced' && (
          <AdvancedEditor element={element} onUpdateStyle={handleUpdateStyle} />
        )}
      </div>
    </div>
  );
}

function SectionEditor({ section, actions }) {
  const handleUpdate = (updates) => {
    actions.updateSection(section.id, updates);
  };

  const handleStyleUpdate = (updates) => {
    handleUpdate({ style: { ...section.style, ...updates } });
  };

  const handleSectionStyleUpdate = (updates) => {
    handleUpdate({ sectionStyle: { ...(section.sectionStyle || {}), ...updates } });
  };

  return (
    <div className="pb-right-form">
      <div className="pb-right-group">
        <label className="pb-right-label">Section Name</label>
        <input
          type="text"
          value={section.name || ''}
          onChange={(e) => handleUpdate({ name: e.target.value })}
          className="pb-right-input"
        />
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Background Color</label>
        <div className="pb-right-color-row">
          <input
            type="color"
            value={section.sectionStyle?.backgroundColor || '#ffffff'}
            onChange={(e) => handleSectionStyleUpdate({ backgroundColor: e.target.value })}
          />
          <input
            type="text"
            value={section.sectionStyle?.backgroundColor || '#ffffff'}
            onChange={(e) => handleSectionStyleUpdate({ backgroundColor: e.target.value })}
            className="pb-right-input"
          />
        </div>
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Background Gradient</label>
        <input
          type="text"
          value={section.sectionStyle?.backgroundImage || ''}
          onChange={(e) => handleSectionStyleUpdate({ backgroundImage: e.target.value })}
          className="pb-right-input"
          placeholder="linear-gradient(135deg, #6c5ce7, #a29bfe)"
        />
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Content Max Width</label>
        <input
          type="text"
          value={section.style.maxWidth || '1200px'}
          onChange={(e) => handleStyleUpdate({ maxWidth: e.target.value })}
          className="pb-right-input"
        />
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Padding</label>
        <div className="pb-right-spacing-grid">
          <div>
            <span>Top</span>
            <input type="text" value={section.style.paddingTop || '60px'} onChange={(e) => handleStyleUpdate({ paddingTop: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Bottom</span>
            <input type="text" value={section.style.paddingBottom || '60px'} onChange={(e) => handleStyleUpdate({ paddingBottom: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Left</span>
            <input type="text" value={section.style.paddingLeft || '40px'} onChange={(e) => handleStyleUpdate({ paddingLeft: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Right</span>
            <input type="text" value={section.style.paddingRight || '40px'} onChange={(e) => handleStyleUpdate({ paddingRight: e.target.value })} className="pb-right-input-sm" />
          </div>
        </div>
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Min Height</label>
        <input
          type="text"
          value={section.style.minHeight || '100px'}
          onChange={(e) => handleStyleUpdate({ minHeight: e.target.value })}
          className="pb-right-input"
        />
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Layout</label>
        <div className="pb-right-btn-group">
          {['flex-start', 'center', 'flex-end'].map(val => (
            <button
              key={val}
              className={`pb-right-btn ${section.style.alignItems === val ? 'active' : ''}`}
              onClick={() => handleStyleUpdate({ display: 'flex', flexDirection: 'column', alignItems: val })}
            >
              {val === 'flex-start' ? 'Left' : val === 'center' ? 'Center' : 'Right'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContentEditor({ element, onUpdate }) {
  switch (element.type) {
    case 'heading':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Text</label>
            <textarea
              value={element.content.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="pb-right-textarea"
              rows={3}
            />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Level</label>
            <select value={element.content.level} onChange={(e) => onUpdate({ level: e.target.value })} className="pb-right-select">
              <option value="h1">H1</option>
              <option value="h2">H2</option>
              <option value="h3">H3</option>
              <option value="h4">H4</option>
              <option value="h5">H5</option>
              <option value="h6">H6</option>
            </select>
          </div>
        </div>
      );

    case 'text':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Text</label>
            <textarea
              value={element.content.text}
              onChange={(e) => onUpdate({ text: e.target.value })}
              className="pb-right-textarea"
              rows={5}
            />
          </div>
        </div>
      );

    case 'image':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Image URL</label>
            <input type="text" value={element.content.src} onChange={(e) => onUpdate({ src: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Alt Text</label>
            <input type="text" value={element.content.alt || ''} onChange={(e) => onUpdate({ alt: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Object Fit</label>
            <select value={element.content.objectFit || 'cover'} onChange={(e) => onUpdate({ objectFit: e.target.value })} className="pb-right-select">
              <option value="cover">Cover</option>
              <option value="contain">Contain</option>
              <option value="fill">Fill</option>
              <option value="none">None</option>
            </select>
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Link URL</label>
            <input type="text" value={element.content.link || ''} onChange={(e) => onUpdate({ link: e.target.value })} className="pb-right-input" placeholder="https://..." />
          </div>
        </div>
      );

    case 'button':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Button Text</label>
            <input type="text" value={element.content.text} onChange={(e) => onUpdate({ text: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Link URL</label>
            <input type="text" value={element.content.link || '#'} onChange={(e) => onUpdate({ link: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Target</label>
            <select value={element.content.target || '_self'} onChange={(e) => onUpdate({ target: e.target.value })} className="pb-right-select">
              <option value="_self">Same Window</option>
              <option value="_blank">New Tab</option>
            </select>
          </div>
        </div>
      );

    case 'video':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Video URL (YouTube/Vimeo embed)</label>
            <input type="text" value={element.content.url} onChange={(e) => onUpdate({ url: e.target.value })} className="pb-right-input" />
          </div>
        </div>
      );

    case 'form':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Submit Button Text</label>
            <input type="text" value={element.content.submitText || 'Submit'} onChange={(e) => onUpdate({ submitText: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Form Action URL</label>
            <input type="text" value={element.content.action || '#'} onChange={(e) => onUpdate({ action: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Form Fields</label>
            {element.content.fields.map((field, i) => (
              <div key={field.id} className="pb-right-form-field-row">
                <input type="text" value={field.label} onChange={(e) => {
                  const fields = [...element.content.fields];
                  fields[i] = { ...fields[i], label: e.target.value };
                  onUpdate({ fields });
                }} className="pb-right-input" placeholder="Label" />
                <select value={field.type} onChange={(e) => {
                  const fields = [...element.content.fields];
                  fields[i] = { ...fields[i], type: e.target.value };
                  onUpdate({ fields });
                }} className="pb-right-select-sm">
                  <option value="text">Text</option>
                  <option value="email">Email</option>
                  <option value="tel">Phone</option>
                  <option value="textarea">Textarea</option>
                </select>
                <button className="pb-right-remove-btn" onClick={() => {
                  const fields = element.content.fields.filter((_, idx) => idx !== i);
                  onUpdate({ fields });
                }}>×</button>
              </div>
            ))}
            <button className="pb-right-add-field-btn" onClick={() => {
              const fields = [...element.content.fields, {
                id: `field-${Date.now()}`, type: 'text', label: 'New Field', placeholder: '', required: false,
              }];
              onUpdate({ fields });
            }}>+ Add Field</button>
          </div>
        </div>
      );

    case 'spacer':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Height</label>
            <input type="text" value={element.content.height} onChange={(e) => onUpdate({ height: e.target.value })} className="pb-right-input" />
          </div>
        </div>
      );

    case 'divider':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Width</label>
            <input type="text" value={element.content.width || '100%'} onChange={(e) => onUpdate({ width: e.target.value })} className="pb-right-input" />
          </div>
        </div>
      );

    case 'map':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Google Maps Embed URL</label>
            <textarea value={element.content.src} onChange={(e) => onUpdate({ src: e.target.value })} className="pb-right-textarea" rows={4} />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Address (label)</label>
            <input type="text" value={element.content.address || ''} onChange={(e) => onUpdate({ address: e.target.value })} className="pb-right-input" />
          </div>
        </div>
      );

    case 'social':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Icon Size</label>
            <input type="text" value={element.content.iconSize || '24px'} onChange={(e) => onUpdate({ iconSize: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Icon Color</label>
            <div className="pb-right-color-row">
              <input type="color" value={element.content.iconColor || '#333333'} onChange={(e) => onUpdate({ iconColor: e.target.value })} />
              <input type="text" value={element.content.iconColor || '#333333'} onChange={(e) => onUpdate({ iconColor: e.target.value })} className="pb-right-input" />
            </div>
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Social Links</label>
            {element.content.links.map((link, i) => (
              <div key={i} className="pb-right-form-field-row">
                <select value={link.platform} onChange={(e) => {
                  const links = [...element.content.links];
                  links[i] = { ...links[i], platform: e.target.value };
                  onUpdate({ links });
                }} className="pb-right-select-sm">
                  <option value="facebook">Facebook</option>
                  <option value="twitter">Twitter</option>
                  <option value="instagram">Instagram</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="youtube">YouTube</option>
                  <option value="pinterest">Pinterest</option>
                  <option value="tiktok">TikTok</option>
                  <option value="github">GitHub</option>
                  <option value="discord">Discord</option>
                </select>
                <input type="text" value={link.url} onChange={(e) => {
                  const links = [...element.content.links];
                  links[i] = { ...links[i], url: e.target.value };
                  onUpdate({ links });
                }} className="pb-right-input" placeholder="URL" />
                <button className="pb-right-remove-btn" onClick={() => {
                  const links = element.content.links.filter((_, idx) => idx !== i);
                  onUpdate({ links });
                }}>×</button>
              </div>
            ))}
            <button className="pb-right-add-field-btn" onClick={() => {
              const links = [...element.content.links, { platform: 'facebook', url: '#' }];
              onUpdate({ links });
            }}>+ Add Social Link</button>
          </div>
        </div>
      );

    case 'list':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">List Type</label>
            <div className="pb-right-btn-group">
              <button className={`pb-right-btn ${!element.content.ordered ? 'active' : ''}`} onClick={() => onUpdate({ ordered: false })}>Unordered</button>
              <button className={`pb-right-btn ${element.content.ordered ? 'active' : ''}`} onClick={() => onUpdate({ ordered: true })}>Ordered</button>
            </div>
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">List Style</label>
            <select value={element.content.listStyle || 'disc'} onChange={(e) => onUpdate({ listStyle: e.target.value })} className="pb-right-select">
              <option value="disc">Disc</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="none">None</option>
              <option value="decimal">Decimal</option>
            </select>
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Items</label>
            {element.content.items.map((item, i) => (
              <div key={i} className="pb-right-form-field-row">
                <input type="text" value={item} onChange={(e) => {
                  const items = [...element.content.items];
                  items[i] = e.target.value;
                  onUpdate({ items });
                }} className="pb-right-input" />
                <button className="pb-right-remove-btn" onClick={() => {
                  const items = element.content.items.filter((_, idx) => idx !== i);
                  onUpdate({ items });
                }}>×</button>
              </div>
            ))}
            <button className="pb-right-add-field-btn" onClick={() => {
              const items = [...element.content.items, 'New item'];
              onUpdate({ items });
            }}>+ Add Item</button>
          </div>
        </div>
      );

    case 'grid':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Columns</label>
            <div className="pb-right-btn-group">
              {[2, 3, 4].map(n => (
                <button key={n} className={`pb-right-btn ${element.content.columns === n ? 'active' : ''}`} onClick={() => {
                  const children = [...element.content.children];
                  while (children.length < n) children.push([]);
                  onUpdate({ columns: n, children: children.slice(0, n) });
                }}>{n}</button>
              ))}
            </div>
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Gap</label>
            <input type="text" value={element.content.gap || '20px'} onChange={(e) => onUpdate({ gap: e.target.value })} className="pb-right-input" />
          </div>
        </div>
      );

    case 'icon':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Icon</label>
            <select value={element.content.icon || 'MdStar'} onChange={(e) => onUpdate({ icon: e.target.value })} className="pb-right-select">
              <option value="MdStar">Star</option>
              <option value="MdRocket">Rocket</option>
              <option value="MdSecurity">Security</option>
              <option value="MdDevices">Devices</option>
              <option value="MdFavorite">Heart</option>
              <option value="MdDiamond">Diamond</option>
              <option value="MdBolt">Bolt</option>
              <option value="MdEco">Eco</option>
              <option value="MdPalette">Palette</option>
              <option value="MdCode">Code</option>
            </select>
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Size</label>
            <input type="text" value={element.content.size || '48px'} onChange={(e) => onUpdate({ size: e.target.value })} className="pb-right-input" />
          </div>
        </div>
      );

    case 'gallery':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Columns</label>
            <div className="pb-right-btn-group">
              {[2, 3, 4].map(n => (
                <button key={n} className={`pb-right-btn ${element.content.columns === n ? 'active' : ''}`} onClick={() => onUpdate({ columns: n })}>{n}</button>
              ))}
            </div>
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Gap</label>
            <input type="text" value={element.content.gap || '10px'} onChange={(e) => onUpdate({ gap: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Images</label>
            {element.content.images.map((img, i) => (
              <div key={i} className="pb-right-form-field-row">
                <input type="text" value={img.src} onChange={(e) => {
                  const images = [...element.content.images];
                  images[i] = { ...images[i], src: e.target.value };
                  onUpdate({ images });
                }} className="pb-right-input" placeholder="Image URL" />
                <button className="pb-right-remove-btn" onClick={() => {
                  const images = element.content.images.filter((_, idx) => idx !== i);
                  onUpdate({ images });
                }}>×</button>
              </div>
            ))}
            <button className="pb-right-add-field-btn" onClick={() => {
              const images = [...element.content.images, { src: 'https://via.placeholder.com/400x300', alt: 'New Image' }];
              onUpdate({ images });
            }}>+ Add Image</button>
          </div>
        </div>
      );

    case 'countdown':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Target Date</label>
            <input type="datetime-local" value={element.content.targetDate || ''} onChange={(e) => onUpdate({ targetDate: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Label</label>
            <input type="text" value={element.content.label || ''} onChange={(e) => onUpdate({ label: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Show Labels</label>
            <label className="pb-right-toggle">
              <input type="checkbox" checked={element.content.showLabels !== false} onChange={(e) => onUpdate({ showLabels: e.target.checked })} />
              <span>Show unit labels</span>
            </label>
          </div>
        </div>
      );

    case 'testimonial':
      return (
        <div className="pb-right-form">
          <div className="pb-right-group">
            <label className="pb-right-label">Quote</label>
            <textarea value={element.content.quote} onChange={(e) => onUpdate({ quote: e.target.value })} className="pb-right-textarea" rows={3} />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Author</label>
            <input type="text" value={element.content.author} onChange={(e) => onUpdate({ author: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Role</label>
            <input type="text" value={element.content.role || ''} onChange={(e) => onUpdate({ role: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Avatar URL</label>
            <input type="text" value={element.content.avatar || ''} onChange={(e) => onUpdate({ avatar: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Rating</label>
            <div className="pb-right-btn-group">
              {[0, 1, 2, 3, 4, 5].map(n => (
                <button key={n} className={`pb-right-btn ${element.content.rating === n ? 'active' : ''}`} onClick={() => onUpdate({ rating: n })}>{n}</button>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return <p className="pb-right-empty">No content settings available for this element.</p>;
  }
}

function StyleEditor({ element, onUpdate }) {
  return (
    <div className="pb-right-form">
      {element.style.fontSize !== undefined && (
        <div className="pb-right-group">
          <label className="pb-right-label">Font Size</label>
          <input type="text" value={element.style.fontSize || ''} onChange={(e) => onUpdate({ fontSize: e.target.value })} className="pb-right-input" />
        </div>
      )}

      {element.style.fontWeight !== undefined && (
        <div className="pb-right-group">
          <label className="pb-right-label">Font Weight</label>
          <select value={element.style.fontWeight || '400'} onChange={(e) => onUpdate({ fontWeight: e.target.value })} className="pb-right-select">
            <option value="300">Light</option>
            <option value="400">Regular</option>
            <option value="500">Medium</option>
            <option value="600">Semi Bold</option>
            <option value="700">Bold</option>
            <option value="800">Extra Bold</option>
          </select>
        </div>
      )}

      {element.style.color !== undefined && (
        <div className="pb-right-group">
          <label className="pb-right-label">Text Color</label>
          <div className="pb-right-color-row">
            <input type="color" value={element.style.color || '#000000'} onChange={(e) => onUpdate({ color: e.target.value })} />
            <input type="text" value={element.style.color || '#000000'} onChange={(e) => onUpdate({ color: e.target.value })} className="pb-right-input" />
          </div>
        </div>
      )}

      {element.style.textAlign !== undefined && (
        <div className="pb-right-group">
          <label className="pb-right-label">Text Align</label>
          <div className="pb-right-btn-group">
            {['left', 'center', 'right'].map(val => (
              <button key={val} className={`pb-right-btn ${element.style.textAlign === val ? 'active' : ''}`} onClick={() => onUpdate({ textAlign: val })}>
                {val.charAt(0).toUpperCase() + val.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}

      {element.style.lineHeight !== undefined && (
        <div className="pb-right-group">
          <label className="pb-right-label">Line Height</label>
          <input type="text" value={element.style.lineHeight || ''} onChange={(e) => onUpdate({ lineHeight: e.target.value })} className="pb-right-input" />
        </div>
      )}

      <div className="pb-right-group">
        <label className="pb-right-label">Background Color</label>
        <div className="pb-right-color-row">
          <input type="color" value={element.style.backgroundColor === 'transparent' ? '#ffffff' : (element.style.backgroundColor || '#ffffff')} onChange={(e) => onUpdate({ backgroundColor: e.target.value })} />
          <input type="text" value={element.style.backgroundColor || 'transparent'} onChange={(e) => onUpdate({ backgroundColor: e.target.value })} className="pb-right-input" />
        </div>
      </div>

      {element.style.hoverBackgroundColor !== undefined && (
        <div className="pb-right-group">
          <label className="pb-right-label">Hover Background</label>
          <div className="pb-right-color-row">
            <input type="color" value={element.style.hoverBackgroundColor || '#000000'} onChange={(e) => onUpdate({ hoverBackgroundColor: e.target.value })} />
            <input type="text" value={element.style.hoverBackgroundColor || ''} onChange={(e) => onUpdate({ hoverBackgroundColor: e.target.value })} className="pb-right-input" />
          </div>
        </div>
      )}

      <div className="pb-right-group">
        <label className="pb-right-label">Border Radius</label>
        <input type="text" value={element.style.borderRadius || '0px'} onChange={(e) => onUpdate({ borderRadius: e.target.value })} className="pb-right-input" />
      </div>

      {(element.style.width !== undefined) && (
        <div className="pb-right-group">
          <label className="pb-right-label">Width</label>
          <input type="text" value={element.style.width || ''} onChange={(e) => onUpdate({ width: e.target.value })} className="pb-right-input" />
        </div>
      )}

      {(element.style.height !== undefined) && (
        <div className="pb-right-group">
          <label className="pb-right-label">Height</label>
          <input type="text" value={element.style.height || ''} onChange={(e) => onUpdate({ height: e.target.value })} className="pb-right-input" />
        </div>
      )}

      {(element.style.maxWidth !== undefined) && (
        <div className="pb-right-group">
          <label className="pb-right-label">Max Width</label>
          <input type="text" value={element.style.maxWidth || ''} onChange={(e) => onUpdate({ maxWidth: e.target.value })} className="pb-right-input" />
        </div>
      )}

      {element.style.borderTopWidth !== undefined && (
        <>
          <div className="pb-right-group">
            <label className="pb-right-label">Border Width</label>
            <input type="text" value={element.style.borderTopWidth || '1px'} onChange={(e) => onUpdate({ borderTopWidth: e.target.value })} className="pb-right-input" />
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Border Style</label>
            <select value={element.style.borderTopStyle || 'solid'} onChange={(e) => onUpdate({ borderTopStyle: e.target.value })} className="pb-right-select">
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
              <option value="dotted">Dotted</option>
              <option value="double">Double</option>
            </select>
          </div>
          <div className="pb-right-group">
            <label className="pb-right-label">Border Color</label>
            <div className="pb-right-color-row">
              <input type="color" value={element.style.borderTopColor || '#e0e0e0'} onChange={(e) => onUpdate({ borderTopColor: e.target.value })} />
              <input type="text" value={element.style.borderTopColor || '#e0e0e0'} onChange={(e) => onUpdate({ borderTopColor: e.target.value })} className="pb-right-input" />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function AdvancedEditor({ element, onUpdateStyle }) {
  return (
    <div className="pb-right-form">
      <div className="pb-right-group">
        <label className="pb-right-label">Margin</label>
        <div className="pb-right-spacing-grid">
          <div>
            <span>Top</span>
            <input type="text" value={element.style.marginTop || '0px'} onChange={(e) => onUpdateStyle({ marginTop: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Bottom</span>
            <input type="text" value={element.style.marginBottom || '0px'} onChange={(e) => onUpdateStyle({ marginBottom: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Left</span>
            <input type="text" value={element.style.marginLeft || '0px'} onChange={(e) => onUpdateStyle({ marginLeft: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Right</span>
            <input type="text" value={element.style.marginRight || '0px'} onChange={(e) => onUpdateStyle({ marginRight: e.target.value })} className="pb-right-input-sm" />
          </div>
        </div>
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Padding</label>
        <div className="pb-right-spacing-grid">
          <div>
            <span>Top</span>
            <input type="text" value={element.style.paddingTop || '10px'} onChange={(e) => onUpdateStyle({ paddingTop: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Bottom</span>
            <input type="text" value={element.style.paddingBottom || '10px'} onChange={(e) => onUpdateStyle({ paddingBottom: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Left</span>
            <input type="text" value={element.style.paddingLeft || '10px'} onChange={(e) => onUpdateStyle({ paddingLeft: e.target.value })} className="pb-right-input-sm" />
          </div>
          <div>
            <span>Right</span>
            <input type="text" value={element.style.paddingRight || '10px'} onChange={(e) => onUpdateStyle({ paddingRight: e.target.value })} className="pb-right-input-sm" />
          </div>
        </div>
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Opacity</label>
        <input
          type="range"
          min="0"
          max="1"
          step="0.05"
          value={element.style.opacity || '1'}
          onChange={(e) => onUpdateStyle({ opacity: e.target.value })}
          className="pb-right-range"
        />
        <span className="pb-right-range-value">{element.style.opacity || '1'}</span>
      </div>

      <div className="pb-right-group">
        <label className="pb-right-label">Border</label>
        <div className="pb-right-row">
          <input type="text" value={element.style.borderWidth || '0px'} onChange={(e) => onUpdateStyle({ borderWidth: e.target.value })} className="pb-right-input-sm" placeholder="Width" />
          <select value={element.style.borderStyle || 'none'} onChange={(e) => onUpdateStyle({ borderStyle: e.target.value })} className="pb-right-select-sm">
            <option value="none">None</option>
            <option value="solid">Solid</option>
            <option value="dashed">Dashed</option>
            <option value="dotted">Dotted</option>
          </select>
          <input type="color" value={element.style.borderColor || '#000000'} onChange={(e) => onUpdateStyle({ borderColor: e.target.value })} />
        </div>
      </div>

      {element.style.boxShadow !== undefined && (
        <div className="pb-right-group">
          <label className="pb-right-label">Box Shadow</label>
          <input type="text" value={element.style.boxShadow || ''} onChange={(e) => onUpdateStyle({ boxShadow: e.target.value })} className="pb-right-input" placeholder="0 2px 12px rgba(0,0,0,0.08)" />
        </div>
      )}
    </div>
  );
}
