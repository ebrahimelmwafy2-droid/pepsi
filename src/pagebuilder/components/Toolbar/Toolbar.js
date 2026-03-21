import React, { useRef } from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { saveToLocalStorage, downloadJSON, importJSON } from '../../utils/helpers';
import { downloadHTML } from '../../utils/exportHTML';
import {
  MdUndo, MdRedo, MdVisibility, MdDesktopWindows, MdTabletMac,
  MdPhoneIphone, MdSave, MdFileDownload, MdFileUpload, MdCode,
  MdGridOn, MdZoomIn, MdZoomOut, MdClose,
} from 'react-icons/md';
import './Toolbar.css';

export default function Toolbar() {
  const { state, actions } = useBuilder();
  const fileInputRef = useRef(null);

  const handleSave = () => {
    const data = { pages: state.pages, pageSettings: state.pageSettings };
    saveToLocalStorage('pagebuilder_data', data);
    alert('Saved successfully!');
  };

  const handleExportJSON = () => {
    const data = { pages: state.pages, pageSettings: state.pageSettings };
    downloadJSON(data, 'pagebuilder-export.json');
  };

  const handleImportJSON = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await importJSON(file);
      if (data.pages) {
        actions.loadState(data);
        alert('Imported successfully!');
      } else {
        alert('Invalid file format');
      }
    } catch (err) {
      alert('Failed to import: ' + err.message);
    }
    e.target.value = '';
  };

  const handleExportHTML = () => {
    downloadHTML(state.pages, state.pageSettings);
  };

  const canUndo = state.historyIndex > 0;
  const canRedo = state.historyIndex < state.history.length - 1;

  if (state.isPreviewMode) {
    return (
      <div className="pb-toolbar pb-toolbar-preview">
        <div className="pb-toolbar-center">
          <span className="pb-toolbar-preview-label">Preview Mode</span>
          <div className="pb-toolbar-device-group">
            <button
              className={`pb-toolbar-btn ${state.devicePreview === 'desktop' ? 'active' : ''}`}
              onClick={() => actions.setDevicePreview('desktop')}
              title="Desktop"
            >
              <MdDesktopWindows size={18} />
            </button>
            <button
              className={`pb-toolbar-btn ${state.devicePreview === 'tablet' ? 'active' : ''}`}
              onClick={() => actions.setDevicePreview('tablet')}
              title="Tablet"
            >
              <MdTabletMac size={18} />
            </button>
            <button
              className={`pb-toolbar-btn ${state.devicePreview === 'mobile' ? 'active' : ''}`}
              onClick={() => actions.setDevicePreview('mobile')}
              title="Mobile"
            >
              <MdPhoneIphone size={18} />
            </button>
          </div>
        </div>
        <button className="pb-toolbar-btn pb-toolbar-exit-preview" onClick={actions.togglePreview}>
          <MdClose size={18} />
          <span>Exit Preview</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pb-toolbar">
      <div className="pb-toolbar-left">
        <div className="pb-toolbar-logo">
          <span className="pb-toolbar-logo-icon">&#9670;</span>
          <span className="pb-toolbar-logo-text">Page Builder</span>
        </div>
      </div>

      <div className="pb-toolbar-center">
        <div className="pb-toolbar-group">
          <button
            className="pb-toolbar-btn"
            onClick={actions.undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <MdUndo size={18} />
          </button>
          <button
            className="pb-toolbar-btn"
            onClick={actions.redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <MdRedo size={18} />
          </button>
        </div>

        <div className="pb-toolbar-separator" />

        <div className="pb-toolbar-device-group">
          <button
            className={`pb-toolbar-btn ${state.devicePreview === 'desktop' ? 'active' : ''}`}
            onClick={() => actions.setDevicePreview('desktop')}
            title="Desktop"
          >
            <MdDesktopWindows size={18} />
          </button>
          <button
            className={`pb-toolbar-btn ${state.devicePreview === 'tablet' ? 'active' : ''}`}
            onClick={() => actions.setDevicePreview('tablet')}
            title="Tablet"
          >
            <MdTabletMac size={18} />
          </button>
          <button
            className={`pb-toolbar-btn ${state.devicePreview === 'mobile' ? 'active' : ''}`}
            onClick={() => actions.setDevicePreview('mobile')}
            title="Mobile"
          >
            <MdPhoneIphone size={18} />
          </button>
        </div>

        <div className="pb-toolbar-separator" />

        <div className="pb-toolbar-group">
          <button
            className={`pb-toolbar-btn ${state.showGrid ? 'active' : ''}`}
            onClick={actions.toggleGrid}
            title="Toggle Grid"
          >
            <MdGridOn size={18} />
          </button>
          <button
            className="pb-toolbar-btn"
            onClick={() => actions.setZoom(Math.max(50, state.zoom - 10))}
            title="Zoom Out"
          >
            <MdZoomOut size={18} />
          </button>
          <span className="pb-toolbar-zoom-label">{state.zoom}%</span>
          <button
            className="pb-toolbar-btn"
            onClick={() => actions.setZoom(Math.min(150, state.zoom + 10))}
            title="Zoom In"
          >
            <MdZoomIn size={18} />
          </button>
        </div>
      </div>

      <div className="pb-toolbar-right">
        <button className="pb-toolbar-btn" onClick={actions.togglePreview} title="Preview">
          <MdVisibility size={18} />
          <span className="pb-toolbar-btn-label">Preview</span>
        </button>
        <button className="pb-toolbar-btn" onClick={handleSave} title="Save">
          <MdSave size={18} />
          <span className="pb-toolbar-btn-label">Save</span>
        </button>

        <div className="pb-toolbar-dropdown">
          <button className="pb-toolbar-btn pb-toolbar-more-btn" title="More Options">
            <MdFileDownload size={18} />
            <span className="pb-toolbar-btn-label">Export</span>
          </button>
          <div className="pb-toolbar-dropdown-menu">
            <button onClick={handleExportJSON}>
              <MdFileDownload size={16} /> Export JSON
            </button>
            <button onClick={() => fileInputRef.current?.click()}>
              <MdFileUpload size={16} /> Import JSON
            </button>
            <button onClick={handleExportHTML}>
              <MdCode size={16} /> Export HTML
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImportJSON}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
