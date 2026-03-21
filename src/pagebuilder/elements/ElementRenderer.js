import React, { useState, useEffect, useCallback } from 'react';
import { useBuilder } from '../context/BuilderContext';
import { getStyleObject } from '../utils/helpers';
import {
  MdStar, MdRocketLaunch, MdSecurity, MdDevices, MdFavorite,
  MdDiamond, MdBolt, MdEco, MdPalette, MdCode,
  MdFacebook, MdEmail,
} from 'react-icons/md';
import {
  FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaPinterest, FaTiktok,
  FaGithub, FaDiscord,
} from 'react-icons/fa';

const ICON_MAP = {
  MdStar: MdStar,
  MdRocket: MdRocketLaunch,
  MdRocketLaunch: MdRocketLaunch,
  MdSecurity: MdSecurity,
  MdDevices: MdDevices,
  MdFavorite: MdFavorite,
  MdDiamond: MdDiamond,
  MdBolt: MdBolt,
  MdEco: MdEco,
  MdPalette: MdPalette,
  MdCode: MdCode,
};

const SOCIAL_ICONS = {
  facebook: MdFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  pinterest: FaPinterest,
  tiktok: FaTiktok,
  github: FaGithub,
  discord: FaDiscord,
  email: MdEmail,
};

function HeadingElement({ element, isEditing, onContentChange }) {
  const Tag = element.content.level || 'h2';
  const style = getStyleObject(element.style);

  if (isEditing) {
    return (
      <Tag
        style={style}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onContentChange({ text: e.target.innerText })}
        className="pb-element-editable"
      >
        {element.content.text}
      </Tag>
    );
  }
  return <Tag style={style}>{element.content.text}</Tag>;
}

function TextElement({ element, isEditing, onContentChange }) {
  const style = getStyleObject(element.style);

  if (isEditing) {
    return (
      <p
        style={style}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onContentChange({ text: e.target.innerText })}
        className="pb-element-editable"
      >
        {element.content.text}
      </p>
    );
  }
  return <p style={style}>{element.content.text}</p>;
}

function ImageElement({ element }) {
  const style = getStyleObject(element.style);
  const img = (
    <img
      src={element.content.src}
      alt={element.content.alt || ''}
      style={{
        ...style,
        objectFit: element.content.objectFit || 'cover',
        display: 'block',
      }}
      draggable={false}
    />
  );
  return img;
}

function ButtonElement({ element, isEditing, onContentChange }) {
  const style = getStyleObject(element.style);
  const [hovered, setHovered] = useState(false);

  const buttonStyle = {
    ...style,
    backgroundColor: hovered && element.style.hoverBackgroundColor
      ? element.style.hoverBackgroundColor
      : style.backgroundColor,
    transition: 'background-color 0.2s ease',
    border: 'none',
    fontFamily: 'inherit',
  };

  if (isEditing) {
    return (
      <div style={{ textAlign: style.textAlign || 'center' }}>
        <button
          style={buttonStyle}
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => onContentChange({ text: e.target.innerText })}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={(e) => e.preventDefault()}
          className="pb-element-editable"
        >
          {element.content.text}
        </button>
      </div>
    );
  }

  return (
    <div style={{ textAlign: style.textAlign || 'center' }}>
      <button
        style={buttonStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={(e) => e.preventDefault()}
      >
        {element.content.text}
      </button>
    </div>
  );
}

function VideoElement({ element }) {
  const style = getStyleObject(element.style);
  return (
    <iframe
      src={element.content.url}
      style={{ ...style, border: 'none' }}
      title="Video"
      allowFullScreen
      loading="lazy"
    />
  );
}

function FormElement({ element }) {
  const style = getStyleObject(element.style);
  return (
    <form style={{ ...style, margin: '0 auto' }} onSubmit={(e) => e.preventDefault()}>
      {element.content.fields.map((field) => (
        <div key={field.id} style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block', marginBottom: '6px', fontWeight: '500',
            fontSize: '14px', color: '#333',
          }}>
            {field.label} {field.required && <span style={{ color: '#e74c3c' }}>*</span>}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              placeholder={field.placeholder}
              style={{
                width: '100%', padding: '10px 14px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '14px', minHeight: '100px',
                resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit',
              }}
              readOnly
            />
          ) : (
            <input
              type={field.type}
              placeholder={field.placeholder}
              style={{
                width: '100%', padding: '10px 14px', border: '1px solid #ddd',
                borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box',
              }}
              readOnly
            />
          )}
        </div>
      ))}
      <button
        type="submit"
        style={{
          background: '#6c5ce7', color: 'white', padding: '12px 32px',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontSize: '16px', fontWeight: '600', width: '100%',
        }}
      >
        {element.content.submitText || 'Submit'}
      </button>
    </form>
  );
}

function SpacerElement({ element }) {
  return <div style={{ height: element.content.height, ...getStyleObject(element.style) }} />;
}

function DividerElement({ element }) {
  const style = getStyleObject(element.style);
  return <hr style={{ ...style, border: 'none', width: element.content.width || '100%' }} />;
}

function MapElement({ element }) {
  const style = getStyleObject(element.style);
  return (
    <iframe
      src={element.content.src}
      style={{ ...style, border: 'none' }}
      title="Map"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    />
  );
}

function SocialElement({ element }) {
  const style = getStyleObject(element.style);
  return (
    <div style={style}>
      {element.content.links.map((link, i) => {
        const IconComp = SOCIAL_ICONS[link.platform];
        return (
          <a
            key={i}
            href={link.url || '#'}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: element.content.iconColor || '#333',
              fontSize: element.content.iconSize || '24px',
              transition: 'opacity 0.2s',
            }}
            onClick={(e) => e.preventDefault()}
          >
            {IconComp ? <IconComp size={parseInt(element.content.iconSize) || 24} /> : link.platform}
          </a>
        );
      })}
    </div>
  );
}

function ListElement({ element }) {
  const style = getStyleObject(element.style);
  const Tag = element.content.ordered ? 'ol' : 'ul';
  return (
    <Tag style={{
      ...style,
      listStyle: element.content.listStyle || 'disc',
      paddingLeft: '24px',
    }}>
      {element.content.items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}

function IconElement({ element }) {
  const style = getStyleObject(element.style);
  const IconComp = ICON_MAP[element.content.icon] || MdStar;
  return (
    <div style={style}>
      <IconComp size={parseInt(element.content.size) || 48} />
    </div>
  );
}

function GalleryElement({ element }) {
  const style = getStyleObject(element.style);
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: `repeat(${element.content.columns || 2}, 1fr)`,
      gap: element.content.gap || '10px',
      ...style,
    }}>
      {element.content.images.map((img, i) => (
        <img
          key={i}
          src={img.src}
          alt={img.alt || ''}
          style={{
            width: '100%', height: '200px', objectFit: 'cover',
            borderRadius: '8px', display: 'block',
          }}
          draggable={false}
        />
      ))}
    </div>
  );
}

function CountdownElement({ element }) {
  const style = getStyleObject(element.style);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const calculateTimeLeft = useCallback(() => {
    const target = new Date(element.content.targetDate).getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
      minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
      seconds: Math.floor((diff % (1000 * 60)) / 1000),
    };
  }, [element.content.targetDate]);

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());
    const timer = setInterval(() => setTimeLeft(calculateTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [calculateTimeLeft]);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div style={style}>
      {element.content.label && (
        <p style={{ fontSize: '18px', marginBottom: '16px', fontWeight: '500' }}>{element.content.label}</p>
      )}
      <div style={{ display: 'flex', gap: '24px', justifyContent: 'center' }}>
        {['days', 'hours', 'minutes', 'seconds'].map(unit => (
          <div key={unit} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: style.fontSize || '36px', fontWeight: '700' }}>
              {pad(timeLeft[unit])}
            </div>
            {element.content.showLabels && (
              <div style={{ fontSize: '13px', color: '#888', marginTop: '4px', textTransform: 'capitalize' }}>
                {unit}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function TestimonialElement({ element }) {
  const style = getStyleObject(element.style);
  return (
    <div style={style}>
      {element.content.avatar && (
        <img
          src={element.content.avatar}
          alt={element.content.author}
          style={{
            width: '64px', height: '64px', borderRadius: '50%',
            objectFit: 'cover', margin: '0 auto 16px', display: 'block',
          }}
          draggable={false}
        />
      )}
      {element.content.rating > 0 && (
        <div style={{ color: '#f1c40f', marginBottom: '12px', fontSize: '20px' }}>
          {'★'.repeat(element.content.rating)}{'☆'.repeat(5 - element.content.rating)}
        </div>
      )}
      <p style={{
        fontStyle: 'italic', fontSize: '16px', color: '#555',
        marginBottom: '16px', lineHeight: '1.6',
      }}>
        "{element.content.quote}"
      </p>
      <p style={{ fontWeight: '600', margin: '0', fontSize: '16px' }}>{element.content.author}</p>
      {element.content.role && (
        <p style={{ color: '#888', fontSize: '14px', margin: '4px 0 0' }}>{element.content.role}</p>
      )}
    </div>
  );
}

function GridElement({ element, sectionId, isPreview }) {
  const style = getStyleObject(element.style);

  return (
    <div style={{
      display: 'flex',
      gap: element.content.gap || '20px',
      ...style,
    }}>
      {element.content.children.map((col, colIndex) => (
        <div key={colIndex} style={{ flex: 1, minWidth: 0 }}>
          {col.map((child) => (
            <ElementWrapper
              key={child.id}
              element={child}
              sectionId={sectionId}
              isPreview={isPreview}
            />
          ))}
          {!isPreview && col.length === 0 && (
            <div style={{
              padding: '30px', textAlign: 'center', color: '#aaa',
              border: '2px dashed #ddd', borderRadius: '8px', fontSize: '13px',
            }}>
              Column {colIndex + 1}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const ELEMENT_COMPONENTS = {
  heading: HeadingElement,
  text: TextElement,
  image: ImageElement,
  button: ButtonElement,
  video: VideoElement,
  form: FormElement,
  spacer: SpacerElement,
  divider: DividerElement,
  map: MapElement,
  social: SocialElement,
  list: ListElement,
  icon: IconElement,
  gallery: GalleryElement,
  countdown: CountdownElement,
  testimonial: TestimonialElement,
  grid: GridElement,
};

export function ElementWrapper({ element, sectionId, isPreview }) {
  const { state, actions } = useBuilder();
  const isSelected = state.selectedElement === element.id;
  const [isEditing, setIsEditing] = useState(false);

  if (!element.visible && !isPreview) {
    return null;
  }
  if (!element.visible && isPreview) {
    return null;
  }

  const Component = ELEMENT_COMPONENTS[element.type];
  if (!Component) return null;

  const handleClick = (e) => {
    if (isPreview) return;
    e.stopPropagation();
    actions.selectElement(element.id, sectionId);
  };

  const handleDoubleClick = (e) => {
    if (isPreview) return;
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleContentChange = (contentUpdates) => {
    actions.updateElement(sectionId, element.id, {
      content: { ...element.content, ...contentUpdates },
    });
    setIsEditing(false);
  };

  if (isPreview) {
    return (
      <div className="pb-element-wrapper">
        <Component
          element={element}
          sectionId={sectionId}
          isPreview={true}
        />
      </div>
    );
  }

  return (
    <div
      className={`pb-element-wrapper ${isSelected ? 'pb-element-selected' : ''} ${element.locked ? 'pb-element-locked' : ''}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      data-element-id={element.id}
      data-element-type={element.type}
    >
      <Component
        element={element}
        sectionId={sectionId}
        isEditing={isEditing}
        onContentChange={handleContentChange}
        isPreview={false}
      />
      {isSelected && !element.locked && (
        <div className="pb-element-actions">
          <button
            className="pb-element-action-btn"
            onClick={(e) => { e.stopPropagation(); actions.duplicateElement(sectionId, element.id); }}
            title="Duplicate"
          >
            &#9851;
          </button>
          <button
            className="pb-element-action-btn pb-element-action-delete"
            onClick={(e) => { e.stopPropagation(); actions.deleteElement(sectionId, element.id); }}
            title="Delete"
          >
            &#10005;
          </button>
        </div>
      )}
    </div>
  );
}

export default ElementWrapper;
