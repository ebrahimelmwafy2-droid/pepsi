import { v4 as uuidv4 } from 'uuid';

export const ELEMENT_TYPES = {
  TEXT: 'text',
  HEADING: 'heading',
  IMAGE: 'image',
  BUTTON: 'button',
  VIDEO: 'video',
  FORM: 'form',
  SPACER: 'spacer',
  DIVIDER: 'divider',
  MAP: 'map',
  SOCIAL: 'social',
  LIST: 'list',
  GRID: 'grid',
  ICON: 'icon',
  GALLERY: 'gallery',
  COUNTDOWN: 'countdown',
  TESTIMONIAL: 'testimonial',
};

export const ELEMENT_CATEGORIES = {
  BASIC: 'Basic',
  MEDIA: 'Media',
  LAYOUT: 'Layout',
  INTERACTIVE: 'Interactive',
  ADVANCED: 'Advanced',
};

export const ELEMENT_CATALOG = [
  { type: ELEMENT_TYPES.HEADING, label: 'Heading', icon: 'MdTitle', category: ELEMENT_CATEGORIES.BASIC },
  { type: ELEMENT_TYPES.TEXT, label: 'Text', icon: 'MdTextFields', category: ELEMENT_CATEGORIES.BASIC },
  { type: ELEMENT_TYPES.IMAGE, label: 'Image', icon: 'MdImage', category: ELEMENT_CATEGORIES.MEDIA },
  { type: ELEMENT_TYPES.BUTTON, label: 'Button', icon: 'MdSmartButton', category: ELEMENT_CATEGORIES.BASIC },
  { type: ELEMENT_TYPES.VIDEO, label: 'Video', icon: 'MdOndemandVideo', category: ELEMENT_CATEGORIES.MEDIA },
  { type: ELEMENT_TYPES.GALLERY, label: 'Gallery', icon: 'MdCollections', category: ELEMENT_CATEGORIES.MEDIA },
  { type: ELEMENT_TYPES.FORM, label: 'Form', icon: 'MdDynamicForm', category: ELEMENT_CATEGORIES.INTERACTIVE },
  { type: ELEMENT_TYPES.MAP, label: 'Map', icon: 'MdMap', category: ELEMENT_CATEGORIES.INTERACTIVE },
  { type: ELEMENT_TYPES.SPACER, label: 'Spacer', icon: 'MdSpaceBar', category: ELEMENT_CATEGORIES.LAYOUT },
  { type: ELEMENT_TYPES.DIVIDER, label: 'Divider', icon: 'MdHorizontalRule', category: ELEMENT_CATEGORIES.LAYOUT },
  { type: ELEMENT_TYPES.GRID, label: 'Columns', icon: 'MdViewColumn', category: ELEMENT_CATEGORIES.LAYOUT },
  { type: ELEMENT_TYPES.SOCIAL, label: 'Social Icons', icon: 'MdShare', category: ELEMENT_CATEGORIES.INTERACTIVE },
  { type: ELEMENT_TYPES.LIST, label: 'List', icon: 'MdFormatListBulleted', category: ELEMENT_CATEGORIES.BASIC },
  { type: ELEMENT_TYPES.ICON, label: 'Icon', icon: 'MdStarBorder', category: ELEMENT_CATEGORIES.BASIC },
  { type: ELEMENT_TYPES.COUNTDOWN, label: 'Countdown', icon: 'MdTimer', category: ELEMENT_CATEGORIES.ADVANCED },
  { type: ELEMENT_TYPES.TESTIMONIAL, label: 'Testimonial', icon: 'MdFormatQuote', category: ELEMENT_CATEGORIES.ADVANCED },
];

const createDefaultStyle = (overrides = {}) => ({
  marginTop: '0px',
  marginBottom: '0px',
  marginLeft: '0px',
  marginRight: '0px',
  paddingTop: '10px',
  paddingBottom: '10px',
  paddingLeft: '10px',
  paddingRight: '10px',
  backgroundColor: 'transparent',
  borderRadius: '0px',
  borderWidth: '0px',
  borderStyle: 'none',
  borderColor: '#000000',
  opacity: '1',
  ...overrides,
});

export const getElementDefaults = (type) => {
  const base = {
    id: uuidv4(),
    type,
    style: createDefaultStyle(),
    visible: true,
    locked: false,
  };

  switch (type) {
    case ELEMENT_TYPES.HEADING:
      return {
        ...base,
        content: {
          text: 'Your Heading Here',
          level: 'h2',
        },
        style: createDefaultStyle({
          fontSize: '32px',
          fontWeight: '700',
          color: '#1a1a2e',
          textAlign: 'left',
          lineHeight: '1.3',
          fontFamily: 'inherit',
        }),
      };
    case ELEMENT_TYPES.TEXT:
      return {
        ...base,
        content: {
          text: 'Add your text here. Click to edit and customize this text element with your own content.',
        },
        style: createDefaultStyle({
          fontSize: '16px',
          fontWeight: '400',
          color: '#4a4a4a',
          textAlign: 'left',
          lineHeight: '1.6',
          fontFamily: 'inherit',
        }),
      };
    case ELEMENT_TYPES.IMAGE:
      return {
        ...base,
        content: {
          src: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=800&h=400&fit=crop',
          alt: 'Image',
          objectFit: 'cover',
          link: '',
        },
        style: createDefaultStyle({
          width: '100%',
          height: 'auto',
          maxWidth: '100%',
          borderRadius: '8px',
        }),
      };
    case ELEMENT_TYPES.BUTTON:
      return {
        ...base,
        content: {
          text: 'Click Me',
          link: '#',
          target: '_self',
          variant: 'filled',
        },
        style: createDefaultStyle({
          backgroundColor: '#6c5ce7',
          color: '#ffffff',
          fontSize: '16px',
          fontWeight: '600',
          paddingTop: '14px',
          paddingBottom: '14px',
          paddingLeft: '32px',
          paddingRight: '32px',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
          display: 'inline-block',
          textDecoration: 'none',
          hoverBackgroundColor: '#5a4bd1',
        }),
      };
    case ELEMENT_TYPES.VIDEO:
      return {
        ...base,
        content: {
          url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          provider: 'youtube',
        },
        style: createDefaultStyle({
          width: '100%',
          height: '400px',
          borderRadius: '8px',
        }),
      };
    case ELEMENT_TYPES.FORM:
      return {
        ...base,
        content: {
          fields: [
            { id: uuidv4(), type: 'text', label: 'Name', placeholder: 'Enter your name', required: true },
            { id: uuidv4(), type: 'email', label: 'Email', placeholder: 'Enter your email', required: true },
            { id: uuidv4(), type: 'textarea', label: 'Message', placeholder: 'Your message...', required: false },
          ],
          submitText: 'Submit',
          action: '#',
        },
        style: createDefaultStyle({
          maxWidth: '500px',
        }),
      };
    case ELEMENT_TYPES.SPACER:
      return {
        ...base,
        content: {
          height: '60px',
        },
        style: createDefaultStyle({
          paddingTop: '0px',
          paddingBottom: '0px',
          paddingLeft: '0px',
          paddingRight: '0px',
        }),
      };
    case ELEMENT_TYPES.DIVIDER:
      return {
        ...base,
        content: {
          width: '100%',
        },
        style: createDefaultStyle({
          borderTopWidth: '2px',
          borderTopStyle: 'solid',
          borderTopColor: '#e0e0e0',
          marginTop: '10px',
          marginBottom: '10px',
        }),
      };
    case ELEMENT_TYPES.MAP:
      return {
        ...base,
        content: {
          address: 'New York, NY',
          zoom: 14,
          src: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30596698663!2d-74.25986652089301!3d40.69714941680757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1',
        },
        style: createDefaultStyle({
          width: '100%',
          height: '350px',
          borderRadius: '8px',
        }),
      };
    case ELEMENT_TYPES.SOCIAL:
      return {
        ...base,
        content: {
          links: [
            { platform: 'facebook', url: '#' },
            { platform: 'twitter', url: '#' },
            { platform: 'instagram', url: '#' },
            { platform: 'linkedin', url: '#' },
            { platform: 'youtube', url: '#' },
          ],
          iconSize: '24px',
          iconColor: '#333333',
        },
        style: createDefaultStyle({
          display: 'flex',
          gap: '16px',
          justifyContent: 'center',
        }),
      };
    case ELEMENT_TYPES.LIST:
      return {
        ...base,
        content: {
          items: ['First item in the list', 'Second item in the list', 'Third item in the list'],
          listStyle: 'disc',
          ordered: false,
        },
        style: createDefaultStyle({
          fontSize: '16px',
          color: '#4a4a4a',
          lineHeight: '1.8',
        }),
      };
    case ELEMENT_TYPES.GRID:
      return {
        ...base,
        content: {
          columns: 2,
          gap: '20px',
          children: [[], []],
        },
        style: createDefaultStyle({
          width: '100%',
        }),
      };
    case ELEMENT_TYPES.ICON:
      return {
        ...base,
        content: {
          icon: 'MdStar',
          size: '48px',
          link: '',
        },
        style: createDefaultStyle({
          color: '#6c5ce7',
          textAlign: 'center',
        }),
      };
    case ELEMENT_TYPES.GALLERY:
      return {
        ...base,
        content: {
          images: [
            { src: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=400&h=300&fit=crop', alt: 'Gallery 1' },
            { src: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop', alt: 'Gallery 2' },
            { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', alt: 'Gallery 3' },
            { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop', alt: 'Gallery 4' },
          ],
          columns: 2,
          gap: '10px',
        },
        style: createDefaultStyle({
          width: '100%',
          borderRadius: '8px',
        }),
      };
    case ELEMENT_TYPES.COUNTDOWN:
      return {
        ...base,
        content: {
          targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
          label: 'Offer Ends In',
          showLabels: true,
        },
        style: createDefaultStyle({
          textAlign: 'center',
          fontSize: '36px',
          fontWeight: '700',
          color: '#1a1a2e',
        }),
      };
    case ELEMENT_TYPES.TESTIMONIAL:
      return {
        ...base,
        content: {
          quote: 'This is an amazing product! I highly recommend it to everyone.',
          author: 'John Doe',
          role: 'CEO, Company',
          avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
          rating: 5,
        },
        style: createDefaultStyle({
          backgroundColor: '#f8f9fa',
          borderRadius: '12px',
          paddingTop: '30px',
          paddingBottom: '30px',
          paddingLeft: '30px',
          paddingRight: '30px',
          textAlign: 'center',
        }),
      };
    default:
      return base;
  }
};

export const createSection = (overrides = {}) => ({
  id: uuidv4(),
  type: 'section',
  elements: [],
  style: {
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    paddingTop: '60px',
    paddingBottom: '60px',
    paddingLeft: '40px',
    paddingRight: '40px',
    minHeight: '100px',
    maxWidth: '1200px',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sectionStyle: {
    backgroundColor: '#ffffff',
    backgroundImage: '',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  },
  name: 'Section',
  ...overrides,
});
