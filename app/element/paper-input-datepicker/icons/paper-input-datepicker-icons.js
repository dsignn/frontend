import '@polymer/iron-iconset-svg/iron-iconset-svg.js';

import {html} from '@polymer/polymer/lib/utils/html-tag.js';

const template = html`
    <iron-iconset-svg name="paper-input-datepicker" size="24">
        <svg><defs>
          <g id="keyboard-arrow-left"><path d="M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"></path></g>
          <g id="keyboard-arrow-right"><path d="M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"></path></g>
        </defs></svg>
    </iron-iconset-svg>
`;

document.head.appendChild(template.content);
