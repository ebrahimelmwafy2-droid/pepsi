import React, { useEffect, useCallback } from 'react';
import { BuilderProvider, useBuilder } from './context/BuilderContext';
import Toolbar from './components/Toolbar/Toolbar';
import LeftSidebar from './components/LeftSidebar/LeftSidebar';
import Canvas from './components/Canvas/Canvas';
import RightSidebar from './components/RightSidebar/RightSidebar';
import { loadFromLocalStorage } from './utils/helpers';
import './PageBuilder.css';

function PageBuilderInner() {
  const { state, actions } = useBuilder();

  useEffect(() => {
    const saved = loadFromLocalStorage('pagebuilder_data');
    if (saved && saved.pages) {
      actions.loadState(saved);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleKeyDown = useCallback((e) => {
    if (state.isPreviewMode) return;

    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      actions.undo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      actions.redo();
    }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.isContentEditable) return;

      if (state.selectedElement && state.selectedSection) {
        e.preventDefault();
        actions.deleteElement(state.selectedSection, state.selectedElement);
      }
    }
    if (e.key === 'Escape') {
      actions.selectElement(null, null);
      actions.setRightPanel(false);
      if (state.isPreviewMode) {
        actions.togglePreview();
      }
    }
  }, [state.isPreviewMode, state.selectedElement, state.selectedSection, actions]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="pb-app">
      <Toolbar />
      <div className="pb-main">
        {!state.isPreviewMode && <LeftSidebar />}
        <Canvas />
        {!state.isPreviewMode && state.rightPanelOpen && <RightSidebar />}
      </div>
    </div>
  );
}

export default function PageBuilder() {
  return (
    <BuilderProvider>
      <PageBuilderInner />
    </BuilderProvider>
  );
}
