/*
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview A component for displaying a "like" icon. While this previously
 * used LocalStorage and Firebase to persist voting data, that functionality
 * has since been removed, and hardcoded vote counts are passed through instead.
 */
import {BaseStateElement} from './base-state-element';
import {html} from 'lit-element';

import {unsafeHTML} from 'lit-html/directives/unsafe-html';

export class FilteredElement extends BaseStateElement {
  static get properties() {
    return {
      hidden: {type: Boolean, reflect: true},
    };
  }

  constructor() {
    super();
    this.hidden = false;
  }

  connectedCallback() {
    super.connectedCallback();
    this.content = this.innerHTML;

    this.filters = {};
    const attributes = this.getAttributeNames();
    for (const attribute of attributes) {
      if (!attribute.startsWith('data-filter-')) {
        continue;
      }
      const name = attribute.replace('data-filter-', '');
      this.filters[name] = this.getAttribute(attribute);
    }
  }

  onStateChanged(state) {
    const activeFilters = state.filters || {};
    for (const [name, value] of Object.entries(activeFilters)) {
      const values = value.map((v) => v.value);
      if (!values.includes(this.filters[name])) {
        this.hidden = true;
        return;
      }
    }

    this.hidden = false;
  }

  render() {
    return unsafeHTML(this.content);
  }
}
customElements.define('filtered-element', FilteredElement);
