export function findElementInSections(sections, elementId) {
  for (const section of sections) {
    for (const element of section.elements) {
      if (element.id === elementId) {
        return { element, sectionId: section.id };
      }
      if (element.type === 'grid' && element.content && element.content.children) {
        for (const col of element.content.children) {
          for (const child of col) {
            if (child.id === elementId) {
              return { element: child, sectionId: section.id, parentGridId: element.id };
            }
          }
        }
      }
    }
  }
  return null;
}

export function saveToLocalStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.error('Failed to save:', e);
    return false;
  }
}

export function loadFromLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load:', e);
    return null;
  }
}

export function downloadJSON(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function importJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (err) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function getStyleObject(style) {
  if (!style) return {};
  const cssStyle = {};
  Object.entries(style).forEach(([key, value]) => {
    if (key === 'hoverBackgroundColor') return;
    if (value !== undefined && value !== '' && value !== null) {
      cssStyle[key] = value;
    }
  });
  return cssStyle;
}

export function rgbToHex(rgb) {
  if (!rgb || rgb.startsWith('#')) return rgb;
  const match = rgb.match(/\d+/g);
  if (!match || match.length < 3) return rgb;
  return '#' + match.slice(0, 3).map(x => {
    const hex = parseInt(x).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}
