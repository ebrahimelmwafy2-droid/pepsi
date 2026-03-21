import React, { createContext, useContext, useReducer, useCallback } from 'react';
import { createSection } from '../data/elementDefaults';

const BuilderContext = createContext(null);

const MAX_HISTORY = 50;

const initialState = {
  pages: [
    {
      id: 'page-1',
      name: 'Home',
      sections: [createSection({ name: 'Welcome Section' })],
    },
  ],
  activePage: 'page-1',
  selectedElement: null,
  selectedSection: null,
  devicePreview: 'desktop',
  isPreviewMode: false,
  leftPanel: 'elements',
  rightPanelOpen: false,
  history: [],
  historyIndex: -1,
  isDragging: false,
  zoom: 100,
  showGrid: false,
  pageSettings: {
    title: 'My Website',
    favicon: '',
    fontFamily: "'Inter', sans-serif",
    primaryColor: '#6c5ce7',
    bodyBackground: '#f0f2f5',
  },
};

const ACTION_TYPES = {
  SET_PAGES: 'SET_PAGES',
  ADD_SECTION: 'ADD_SECTION',
  DELETE_SECTION: 'DELETE_SECTION',
  MOVE_SECTION: 'MOVE_SECTION',
  UPDATE_SECTION: 'UPDATE_SECTION',
  DUPLICATE_SECTION: 'DUPLICATE_SECTION',
  ADD_ELEMENT: 'ADD_ELEMENT',
  DELETE_ELEMENT: 'DELETE_ELEMENT',
  UPDATE_ELEMENT: 'UPDATE_ELEMENT',
  MOVE_ELEMENT: 'MOVE_ELEMENT',
  DUPLICATE_ELEMENT: 'DUPLICATE_ELEMENT',
  SELECT_ELEMENT: 'SELECT_ELEMENT',
  SELECT_SECTION: 'SELECT_SECTION',
  SET_DEVICE_PREVIEW: 'SET_DEVICE_PREVIEW',
  TOGGLE_PREVIEW: 'TOGGLE_PREVIEW',
  SET_LEFT_PANEL: 'SET_LEFT_PANEL',
  SET_RIGHT_PANEL: 'SET_RIGHT_PANEL',
  UNDO: 'UNDO',
  REDO: 'REDO',
  SET_DRAGGING: 'SET_DRAGGING',
  SET_ZOOM: 'SET_ZOOM',
  TOGGLE_GRID: 'TOGGLE_GRID',
  UPDATE_PAGE_SETTINGS: 'UPDATE_PAGE_SETTINGS',
  LOAD_STATE: 'LOAD_STATE',
  ADD_PAGE: 'ADD_PAGE',
  DELETE_PAGE: 'DELETE_PAGE',
  SET_ACTIVE_PAGE: 'SET_ACTIVE_PAGE',
  RENAME_PAGE: 'RENAME_PAGE',
};

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function pushHistory(state) {
  const snapshot = deepClone({
    pages: state.pages,
    pageSettings: state.pageSettings,
  });
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(snapshot);
  if (newHistory.length > MAX_HISTORY) {
    newHistory.shift();
  }
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
}

function getActivePageSections(state) {
  const page = state.pages.find(p => p.id === state.activePage);
  return page ? page.sections : [];
}

function updateActivePageSections(state, newSections) {
  return state.pages.map(p =>
    p.id === state.activePage ? { ...p, sections: newSections } : p
  );
}

function builderReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.ADD_SECTION: {
      const historyUpdate = pushHistory(state);
      const sections = getActivePageSections(state);
      const index = action.payload.index !== undefined ? action.payload.index : sections.length;
      const newSections = [...sections];
      newSections.splice(index, 0, action.payload.section);
      return {
        ...state,
        pages: updateActivePageSections(state, newSections),
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.DELETE_SECTION: {
      const historyUpdate = pushHistory(state);
      const sections = getActivePageSections(state);
      return {
        ...state,
        pages: updateActivePageSections(state, sections.filter(s => s.id !== action.payload)),
        selectedSection: state.selectedSection === action.payload ? null : state.selectedSection,
        selectedElement: null,
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.MOVE_SECTION: {
      const historyUpdate = pushHistory(state);
      const sections = [...getActivePageSections(state)];
      const { fromIndex, toIndex } = action.payload;
      const [moved] = sections.splice(fromIndex, 1);
      sections.splice(toIndex, 0, moved);
      return {
        ...state,
        pages: updateActivePageSections(state, sections),
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.UPDATE_SECTION: {
      const historyUpdate = pushHistory(state);
      const sections = getActivePageSections(state);
      return {
        ...state,
        pages: updateActivePageSections(
          state,
          sections.map(s => s.id === action.payload.id ? { ...s, ...action.payload.updates } : s)
        ),
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.DUPLICATE_SECTION: {
      const historyUpdate = pushHistory(state);
      const sections = getActivePageSections(state);
      const sectionIndex = sections.findIndex(s => s.id === action.payload);
      if (sectionIndex === -1) return state;
      const cloned = deepClone(sections[sectionIndex]);
      const reassignIds = (obj) => {
        if (obj && typeof obj === 'object') {
          if (obj.id) obj.id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
          Object.values(obj).forEach(v => {
            if (Array.isArray(v)) v.forEach(reassignIds);
            else if (typeof v === 'object') reassignIds(v);
          });
        }
      };
      reassignIds(cloned);
      cloned.name = `${cloned.name} (Copy)`;
      const newSections = [...sections];
      newSections.splice(sectionIndex + 1, 0, cloned);
      return {
        ...state,
        pages: updateActivePageSections(state, newSections),
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.ADD_ELEMENT: {
      const historyUpdate = pushHistory(state);
      const { sectionId, element, index } = action.payload;
      const sections = getActivePageSections(state);
      return {
        ...state,
        pages: updateActivePageSections(
          state,
          sections.map(s => {
            if (s.id !== sectionId) return s;
            const elems = [...s.elements];
            const insertIdx = index !== undefined ? index : elems.length;
            elems.splice(insertIdx, 0, element);
            return { ...s, elements: elems };
          })
        ),
        selectedElement: element.id,
        selectedSection: sectionId,
        rightPanelOpen: true,
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.DELETE_ELEMENT: {
      const historyUpdate = pushHistory(state);
      const { sectionId, elementId } = action.payload;
      const sections = getActivePageSections(state);
      const deleteFromElements = (elements) =>
        elements.filter(el => {
          if (el.id === elementId) return false;
          if (el.type === 'grid' && el.content && el.content.children) {
            el.content.children = el.content.children.map(col => deleteFromElements(col));
          }
          return true;
        });
      return {
        ...state,
        pages: updateActivePageSections(
          state,
          sections.map(s => {
            if (s.id !== sectionId) return s;
            return { ...s, elements: deleteFromElements(s.elements) };
          })
        ),
        selectedElement: state.selectedElement === elementId ? null : state.selectedElement,
        rightPanelOpen: state.selectedElement === elementId ? false : state.rightPanelOpen,
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.UPDATE_ELEMENT: {
      const historyUpdate = pushHistory(state);
      const { sectionId, elementId, updates } = action.payload;
      const sections = getActivePageSections(state);
      const updateInElements = (elements) =>
        elements.map(el => {
          if (el.id === elementId) return { ...el, ...updates };
          if (el.type === 'grid' && el.content && el.content.children) {
            return {
              ...el,
              content: {
                ...el.content,
                children: el.content.children.map(col => updateInElements(col)),
              },
            };
          }
          return el;
        });
      return {
        ...state,
        pages: updateActivePageSections(
          state,
          sections.map(s => {
            if (s.id !== sectionId) return s;
            return { ...s, elements: updateInElements(s.elements) };
          })
        ),
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.MOVE_ELEMENT: {
      const historyUpdate = pushHistory(state);
      const { sectionId, fromIndex, toIndex } = action.payload;
      const sections = getActivePageSections(state);
      return {
        ...state,
        pages: updateActivePageSections(
          state,
          sections.map(s => {
            if (s.id !== sectionId) return s;
            const elems = [...s.elements];
            const [moved] = elems.splice(fromIndex, 1);
            elems.splice(toIndex, 0, moved);
            return { ...s, elements: elems };
          })
        ),
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.DUPLICATE_ELEMENT: {
      const historyUpdate = pushHistory(state);
      const { sectionId, elementId } = action.payload;
      const sections = getActivePageSections(state);
      return {
        ...state,
        pages: updateActivePageSections(
          state,
          sections.map(s => {
            if (s.id !== sectionId) return s;
            const idx = s.elements.findIndex(el => el.id === elementId);
            if (idx === -1) return s;
            const cloned = deepClone(s.elements[idx]);
            cloned.id = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            const elems = [...s.elements];
            elems.splice(idx + 1, 0, cloned);
            return { ...s, elements: elems };
          })
        ),
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.SELECT_ELEMENT:
      return {
        ...state,
        selectedElement: action.payload.elementId,
        selectedSection: action.payload.sectionId || state.selectedSection,
        rightPanelOpen: action.payload.elementId !== null,
      };
    case ACTION_TYPES.SELECT_SECTION:
      return {
        ...state,
        selectedSection: action.payload,
        selectedElement: null,
        rightPanelOpen: action.payload !== null,
      };
    case ACTION_TYPES.SET_DEVICE_PREVIEW:
      return { ...state, devicePreview: action.payload };
    case ACTION_TYPES.TOGGLE_PREVIEW:
      return {
        ...state,
        isPreviewMode: !state.isPreviewMode,
        selectedElement: null,
        selectedSection: null,
        rightPanelOpen: false,
      };
    case ACTION_TYPES.SET_LEFT_PANEL:
      return { ...state, leftPanel: action.payload };
    case ACTION_TYPES.SET_RIGHT_PANEL:
      return { ...state, rightPanelOpen: action.payload };
    case ACTION_TYPES.UNDO: {
      if (state.historyIndex <= 0) return state;
      const newIndex = state.historyIndex - 1;
      const snapshot = state.history[newIndex];
      return {
        ...state,
        pages: deepClone(snapshot.pages),
        pageSettings: deepClone(snapshot.pageSettings),
        historyIndex: newIndex,
        selectedElement: null,
        selectedSection: null,
      };
    }
    case ACTION_TYPES.REDO: {
      if (state.historyIndex >= state.history.length - 1) return state;
      const newIndex = state.historyIndex + 1;
      const snapshot = state.history[newIndex];
      return {
        ...state,
        pages: deepClone(snapshot.pages),
        pageSettings: deepClone(snapshot.pageSettings),
        historyIndex: newIndex,
        selectedElement: null,
        selectedSection: null,
      };
    }
    case ACTION_TYPES.SET_DRAGGING:
      return { ...state, isDragging: action.payload };
    case ACTION_TYPES.SET_ZOOM:
      return { ...state, zoom: action.payload };
    case ACTION_TYPES.TOGGLE_GRID:
      return { ...state, showGrid: !state.showGrid };
    case ACTION_TYPES.UPDATE_PAGE_SETTINGS:
      return {
        ...state,
        pageSettings: { ...state.pageSettings, ...action.payload },
        ...pushHistory(state),
      };
    case ACTION_TYPES.LOAD_STATE:
      return {
        ...state,
        pages: action.payload.pages || state.pages,
        pageSettings: action.payload.pageSettings || state.pageSettings,
        history: [],
        historyIndex: -1,
        selectedElement: null,
        selectedSection: null,
      };
    case ACTION_TYPES.ADD_PAGE: {
      const historyUpdate = pushHistory(state);
      const newPage = {
        id: `page-${Date.now()}`,
        name: action.payload || `Page ${state.pages.length + 1}`,
        sections: [createSection({ name: 'New Section' })],
      };
      return {
        ...state,
        pages: [...state.pages, newPage],
        activePage: newPage.id,
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.DELETE_PAGE: {
      if (state.pages.length <= 1) return state;
      const historyUpdate = pushHistory(state);
      const remaining = state.pages.filter(p => p.id !== action.payload);
      return {
        ...state,
        pages: remaining,
        activePage: state.activePage === action.payload ? remaining[0].id : state.activePage,
        ...historyUpdate,
      };
    }
    case ACTION_TYPES.SET_ACTIVE_PAGE:
      return {
        ...state,
        activePage: action.payload,
        selectedElement: null,
        selectedSection: null,
        rightPanelOpen: false,
      };
    case ACTION_TYPES.RENAME_PAGE: {
      return {
        ...state,
        pages: state.pages.map(p =>
          p.id === action.payload.id ? { ...p, name: action.payload.name } : p
        ),
      };
    }
    default:
      return state;
  }
}

export function BuilderProvider({ children }) {
  const [state, dispatch] = useReducer(builderReducer, {
    ...initialState,
    ...(() => {
      const historyEntry = {
        pages: deepClone(initialState.pages),
        pageSettings: deepClone(initialState.pageSettings),
      };
      return { history: [historyEntry], historyIndex: 0 };
    })(),
  });

  const actions = {
    addSection: useCallback((section, index) => {
      dispatch({ type: ACTION_TYPES.ADD_SECTION, payload: { section, index } });
    }, []),
    deleteSection: useCallback((sectionId) => {
      dispatch({ type: ACTION_TYPES.DELETE_SECTION, payload: sectionId });
    }, []),
    moveSection: useCallback((fromIndex, toIndex) => {
      dispatch({ type: ACTION_TYPES.MOVE_SECTION, payload: { fromIndex, toIndex } });
    }, []),
    updateSection: useCallback((id, updates) => {
      dispatch({ type: ACTION_TYPES.UPDATE_SECTION, payload: { id, updates } });
    }, []),
    duplicateSection: useCallback((sectionId) => {
      dispatch({ type: ACTION_TYPES.DUPLICATE_SECTION, payload: sectionId });
    }, []),
    addElement: useCallback((sectionId, element, index) => {
      dispatch({ type: ACTION_TYPES.ADD_ELEMENT, payload: { sectionId, element, index } });
    }, []),
    deleteElement: useCallback((sectionId, elementId) => {
      dispatch({ type: ACTION_TYPES.DELETE_ELEMENT, payload: { sectionId, elementId } });
    }, []),
    updateElement: useCallback((sectionId, elementId, updates) => {
      dispatch({ type: ACTION_TYPES.UPDATE_ELEMENT, payload: { sectionId, elementId, updates } });
    }, []),
    moveElement: useCallback((sectionId, fromIndex, toIndex) => {
      dispatch({ type: ACTION_TYPES.MOVE_ELEMENT, payload: { sectionId, fromIndex, toIndex } });
    }, []),
    duplicateElement: useCallback((sectionId, elementId) => {
      dispatch({ type: ACTION_TYPES.DUPLICATE_ELEMENT, payload: { sectionId, elementId } });
    }, []),
    selectElement: useCallback((elementId, sectionId) => {
      dispatch({ type: ACTION_TYPES.SELECT_ELEMENT, payload: { elementId, sectionId } });
    }, []),
    selectSection: useCallback((sectionId) => {
      dispatch({ type: ACTION_TYPES.SELECT_SECTION, payload: sectionId });
    }, []),
    setDevicePreview: useCallback((device) => {
      dispatch({ type: ACTION_TYPES.SET_DEVICE_PREVIEW, payload: device });
    }, []),
    togglePreview: useCallback(() => {
      dispatch({ type: ACTION_TYPES.TOGGLE_PREVIEW });
    }, []),
    setLeftPanel: useCallback((panel) => {
      dispatch({ type: ACTION_TYPES.SET_LEFT_PANEL, payload: panel });
    }, []),
    setRightPanel: useCallback((open) => {
      dispatch({ type: ACTION_TYPES.SET_RIGHT_PANEL, payload: open });
    }, []),
    undo: useCallback(() => {
      dispatch({ type: ACTION_TYPES.UNDO });
    }, []),
    redo: useCallback(() => {
      dispatch({ type: ACTION_TYPES.REDO });
    }, []),
    setDragging: useCallback((isDragging) => {
      dispatch({ type: ACTION_TYPES.SET_DRAGGING, payload: isDragging });
    }, []),
    setZoom: useCallback((zoom) => {
      dispatch({ type: ACTION_TYPES.SET_ZOOM, payload: zoom });
    }, []),
    toggleGrid: useCallback(() => {
      dispatch({ type: ACTION_TYPES.TOGGLE_GRID });
    }, []),
    updatePageSettings: useCallback((settings) => {
      dispatch({ type: ACTION_TYPES.UPDATE_PAGE_SETTINGS, payload: settings });
    }, []),
    loadState: useCallback((data) => {
      dispatch({ type: ACTION_TYPES.LOAD_STATE, payload: data });
    }, []),
    addPage: useCallback((name) => {
      dispatch({ type: ACTION_TYPES.ADD_PAGE, payload: name });
    }, []),
    deletePage: useCallback((pageId) => {
      dispatch({ type: ACTION_TYPES.DELETE_PAGE, payload: pageId });
    }, []),
    setActivePage: useCallback((pageId) => {
      dispatch({ type: ACTION_TYPES.SET_ACTIVE_PAGE, payload: pageId });
    }, []),
    renamePage: useCallback((id, name) => {
      dispatch({ type: ACTION_TYPES.RENAME_PAGE, payload: { id, name } });
    }, []),
  };

  return (
    <BuilderContext.Provider value={{ state, actions }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within a BuilderProvider');
  }
  return context;
}

export { ACTION_TYPES };
