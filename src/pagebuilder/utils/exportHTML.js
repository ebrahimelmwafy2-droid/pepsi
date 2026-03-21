import { getStyleObject } from './helpers';

function styleToCSS(style) {
  return Object.entries(getStyleObject(style))
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');
}

function renderElementHTML(element) {
  if (!element || !element.visible) return '';

  const style = styleToCSS(element.style);

  switch (element.type) {
    case 'heading': {
      const tag = element.content.level || 'h2';
      return `<${tag} style="${style}">${element.content.text}</${tag}>`;
    }
    case 'text':
      return `<p style="${style}">${element.content.text}</p>`;
    case 'image': {
      const imgHTML = `<img src="${element.content.src}" alt="${element.content.alt || ''}" style="${style}" />`;
      if (element.content.link) {
        return `<a href="${element.content.link}" target="_blank">${imgHTML}</a>`;
      }
      return imgHTML;
    }
    case 'button':
      return `<a href="${element.content.link || '#'}" target="${element.content.target || '_self'}" style="${style}; text-decoration: none;">${element.content.text}</a>`;
    case 'video':
      return `<iframe src="${element.content.url}" style="${style}" frameborder="0" allowfullscreen></iframe>`;
    case 'spacer':
      return `<div style="height: ${element.content.height}; ${style}"></div>`;
    case 'divider':
      return `<hr style="${style}" />`;
    case 'form': {
      const fields = element.content.fields.map(field => {
        if (field.type === 'textarea') {
          return `<div style="margin-bottom: 16px;">
            <label style="display: block; margin-bottom: 6px; font-weight: 500;">${field.label}</label>
            <textarea placeholder="${field.placeholder}" ${field.required ? 'required' : ''} style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; min-height: 100px; box-sizing: border-box;"></textarea>
          </div>`;
        }
        return `<div style="margin-bottom: 16px;">
          <label style="display: block; margin-bottom: 6px; font-weight: 500;">${field.label}</label>
          <input type="${field.type}" placeholder="${field.placeholder}" ${field.required ? 'required' : ''} style="width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 6px; box-sizing: border-box;" />
        </div>`;
      }).join('\n');
      return `<form action="${element.content.action || '#'}" style="${style}">${fields}
        <button type="submit" style="background: #6c5ce7; color: white; padding: 12px 32px; border: none; border-radius: 8px; cursor: pointer; font-size: 16px; font-weight: 600;">${element.content.submitText || 'Submit'}</button>
      </form>`;
    }
    case 'map':
      return `<iframe src="${element.content.src}" style="${style}" frameborder="0" allowfullscreen loading="lazy"></iframe>`;
    case 'social': {
      const icons = element.content.links.map(link => {
        return `<a href="${link.url}" target="_blank" style="color: ${element.content.iconColor || '#333'}; font-size: ${element.content.iconSize || '24px'}; text-decoration: none;">${link.platform}</a>`;
      }).join('\n');
      return `<div style="${style}">${icons}</div>`;
    }
    case 'list': {
      const tag = element.content.ordered ? 'ol' : 'ul';
      const items = element.content.items.map(item => `<li>${item}</li>`).join('');
      return `<${tag} style="${style}; list-style: ${element.content.listStyle || 'disc'};">${items}</${tag}>`;
    }
    case 'grid': {
      const cols = element.content.children.map(col => {
        const colContent = col.map(child => renderElementHTML(child)).join('\n');
        return `<div style="flex: 1;">${colContent}</div>`;
      }).join('\n');
      return `<div style="display: flex; gap: ${element.content.gap || '20px'}; ${style}">${cols}</div>`;
    }
    case 'icon':
      return `<div style="${style}; font-size: ${element.content.size || '48px'};">&#9733;</div>`;
    case 'gallery': {
      const imgs = element.content.images.map(img =>
        `<img src="${img.src}" alt="${img.alt || ''}" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px;" />`
      ).join('\n');
      return `<div style="display: grid; grid-template-columns: repeat(${element.content.columns || 2}, 1fr); gap: ${element.content.gap || '10px'}; ${style}">${imgs}</div>`;
    }
    case 'countdown':
      return `<div style="${style}">
        <p style="font-size: 18px; margin-bottom: 10px;">${element.content.label || ''}</p>
        <div style="display: flex; gap: 20px; justify-content: center;">
          <div><span style="font-size: 36px; font-weight: 700;">00</span><br/><small>Days</small></div>
          <div><span style="font-size: 36px; font-weight: 700;">00</span><br/><small>Hours</small></div>
          <div><span style="font-size: 36px; font-weight: 700;">00</span><br/><small>Minutes</small></div>
          <div><span style="font-size: 36px; font-weight: 700;">00</span><br/><small>Seconds</small></div>
        </div>
      </div>`;
    case 'testimonial':
      return `<div style="${style}">
        ${element.content.avatar ? `<img src="${element.content.avatar}" alt="${element.content.author}" style="width: 60px; height: 60px; border-radius: 50%; object-fit: cover; margin-bottom: 16px;" />` : ''}
        <p style="font-style: italic; font-size: 16px; color: #555; margin-bottom: 16px;">"${element.content.quote}"</p>
        <p style="font-weight: 600; margin: 0;">${element.content.author}</p>
        ${element.content.role ? `<p style="color: #888; font-size: 14px; margin: 4px 0 0;">${element.content.role}</p>` : ''}
        ${element.content.rating ? `<div style="color: #f1c40f; margin-top: 8px;">${'&#9733;'.repeat(element.content.rating)}</div>` : ''}
      </div>`;
    default:
      return '';
  }
}

export function exportToHTML(pages, pageSettings) {
  const page = pages[0];
  if (!page) return '';

  const sectionsHTML = page.sections.map(section => {
    const sectionOuterStyle = styleToCSS(section.sectionStyle || {});
    const sectionInnerStyle = styleToCSS(section.style);
    const elementsHTML = section.elements.map(el => renderElementHTML(el)).join('\n');

    return `<section style="${sectionOuterStyle}">
      <div style="${sectionInnerStyle}">
        ${elementsHTML}
      </div>
    </section>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pageSettings.title || 'My Website'}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: ${pageSettings.fontFamily || "'Inter', sans-serif"}; }
    img { max-width: 100%; }
    @media (max-width: 768px) {
      [style*="display: flex"] { flex-direction: column !important; }
      [style*="display: grid"] { grid-template-columns: 1fr !important; }
    }
  </style>
</head>
<body>
  ${sectionsHTML}
</body>
</html>`;
}

export function downloadHTML(pages, pageSettings) {
  const html = exportToHTML(pages, pageSettings);
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(pageSettings.title || 'website').toLowerCase().replace(/\s+/g, '-')}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
