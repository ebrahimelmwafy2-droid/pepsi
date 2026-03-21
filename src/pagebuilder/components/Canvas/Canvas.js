import React from 'react';
import { useBuilder } from '../../context/BuilderContext';
import { createSection, getElementDefaults } from '../../data/elementDefaults';
import { ElementWrapper } from '../../elements/ElementRenderer';
import { MdAdd, MdDelete, MdContentCopy, MdArrowUpward, MdArrowDownward, MdDragIndicator } from 'react-icons/md';
import './Canvas.css';

export default function Canvas() {
  const { state, actions } = useBuilder();
  const currentPage = state.pages.find(p => p.id === state.activePage);
  const sections = currentPage ? currentPage.sections : [];

  const deviceWidths = {
    desktop: '100%',
    tablet: '768px',
    mobile: '375px',
  };

  const handleCanvasClick = (e) => {
    if (e.target === e.currentTarget || e.target.classList.contains('pb-canvas-inner')) {
      actions.selectElement(null, null);
      actions.setRightPanel(false);
    }
  };

  const handleSectionClick = (e, sectionId) => {
    e.stopPropagation();
    if (e.target.classList.contains('pb-section-inner') || e.target.classList.contains('pb-section-drop-zone')) {
      actions.selectSection(sectionId);
    }
  };

  const handleDrop = (e, sectionId) => {
    e.preventDefault();
    e.stopPropagation();
    const elementType = e.dataTransfer.getData('element-type');
    if (elementType && sectionId) {
      const element = getElementDefaults(elementType);
      actions.addElement(sectionId, element);
    }
    e.currentTarget.classList.remove('pb-section-dragover');
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('pb-section-dragover');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('pb-section-dragover');
  };

  const handleAddSectionBetween = (index) => {
    const section = createSection({ name: `Section ${sections.length + 1}` });
    actions.addSection(section, index);
  };

  const canvasStyle = {
    width: deviceWidths[state.devicePreview],
    maxWidth: deviceWidths[state.devicePreview],
    transform: `scale(${state.zoom / 100})`,
    transformOrigin: 'top center',
  };

  return (
    <div
      className={`pb-canvas ${state.isPreviewMode ? 'pb-canvas-preview' : ''}`}
      onClick={handleCanvasClick}
      style={{ background: state.pageSettings.bodyBackground || '#f0f2f5' }}
    >
      <div className="pb-canvas-inner" style={canvasStyle}>
        {sections.length === 0 && !state.isPreviewMode && (
          <div className="pb-canvas-empty">
            <div className="pb-canvas-empty-icon">&#9670;</div>
            <h3>Start Building Your Page</h3>
            <p>Add a section from the left panel or click the button below</p>
            <button
              className="pb-canvas-empty-btn"
              onClick={() => handleAddSectionBetween(0)}
            >
              <MdAdd size={20} /> Add Section
            </button>
          </div>
        )}

        {sections.map((section, sectionIndex) => (
          <React.Fragment key={section.id}>
            {!state.isPreviewMode && sectionIndex === 0 && (
              <div className="pb-section-add-between">
                <button
                  className="pb-section-add-btn"
                  onClick={() => handleAddSectionBetween(0)}
                  title="Add section here"
                >
                  <MdAdd size={16} />
                </button>
              </div>
            )}

            <div
              className={`pb-section ${state.selectedSection === section.id && !state.isPreviewMode ? 'pb-section-selected' : ''}`}
              style={section.sectionStyle ? {
                backgroundColor: section.sectionStyle.backgroundColor,
                backgroundImage: section.sectionStyle.backgroundImage,
                backgroundSize: section.sectionStyle.backgroundSize || 'cover',
                backgroundPosition: section.sectionStyle.backgroundPosition || 'center',
              } : {}}
              onClick={(e) => !state.isPreviewMode && handleSectionClick(e, section.id)}
            >
              {!state.isPreviewMode && state.selectedSection === section.id && (
                <div className="pb-section-toolbar">
                  <span className="pb-section-toolbar-name">
                    <MdDragIndicator size={16} />
                    {section.name || 'Section'}
                  </span>
                  <div className="pb-section-toolbar-actions">
                    {sectionIndex > 0 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); actions.moveSection(sectionIndex, sectionIndex - 1); }}
                        title="Move Up"
                      >
                        <MdArrowUpward size={16} />
                      </button>
                    )}
                    {sectionIndex < sections.length - 1 && (
                      <button
                        onClick={(e) => { e.stopPropagation(); actions.moveSection(sectionIndex, sectionIndex + 1); }}
                        title="Move Down"
                      >
                        <MdArrowDownward size={16} />
                      </button>
                    )}
                    <button
                      onClick={(e) => { e.stopPropagation(); actions.duplicateSection(section.id); }}
                      title="Duplicate Section"
                    >
                      <MdContentCopy size={16} />
                    </button>
                    <button
                      className="pb-section-toolbar-delete"
                      onClick={(e) => { e.stopPropagation(); actions.deleteSection(section.id); }}
                      title="Delete Section"
                    >
                      <MdDelete size={16} />
                    </button>
                  </div>
                </div>
              )}

              <div
                className="pb-section-inner"
                style={{
                  ...section.style,
                  fontFamily: state.pageSettings.fontFamily || "'Inter', sans-serif",
                }}
                onDrop={(e) => !state.isPreviewMode && handleDrop(e, section.id)}
                onDragOver={(e) => !state.isPreviewMode && handleDragOver(e)}
                onDragLeave={(e) => !state.isPreviewMode && handleDragLeave(e)}
              >
                {section.elements.map((element) => (
                  <ElementWrapper
                    key={element.id}
                    element={element}
                    sectionId={section.id}
                    isPreview={state.isPreviewMode}
                  />
                ))}

                {section.elements.length === 0 && !state.isPreviewMode && (
                  <div className="pb-section-drop-zone">
                    <MdAdd size={24} />
                    <p>Drag & drop elements here or click an element from the left panel</p>
                  </div>
                )}
              </div>
            </div>

            {!state.isPreviewMode && (
              <div className="pb-section-add-between">
                <button
                  className="pb-section-add-btn"
                  onClick={() => handleAddSectionBetween(sectionIndex + 1)}
                  title="Add section here"
                >
                  <MdAdd size={16} />
                </button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
