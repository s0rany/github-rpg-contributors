/**
 * Copyright 2025 s0rany
 * @license Apache-2.0, see LICENSE for full text.
 */
import { LitElement, html, css } from "lit";
import { DDDSuper } from "@haxtheweb/d-d-d/d-d-d.js";
import { I18NMixin } from "@haxtheweb/i18n-manager/lib/I18NMixin.js";
import '@haxtheweb/rpg-character/rpg-character.js';

/**
 * `github-rpg-contributors`
 * 
 * @demo index.html
 * @element github-rpg-contributors
 */
export class GithubRpgContributors extends DDDSuper(I18NMixin(LitElement)) {

  static get tag() {
    return "github-rpg-contributors";
  }

  constructor() {
    super();
    this.organization = "";
    this.repo = "";
    this.contributors = [];
    this.limit = 10;
    this.title = "";
    this.t = this.t || {};
    this.t = {
      ...this.t,
      title: "Title",
    };
    this.registerLocalization({
      context: this,
      localesPath:
        new URL("./locales/github-rpg-contributors.ar.json", import.meta.url).href +
        "/../",
      locales: ["ar", "es", "hi", "zh"],
    });
  }

  // Lit reactive properties
  static get properties() {
    return {
      ...super.properties,
      title: { type: String },
      organization: { type: String },
      repo: { type: String },
      contributors: { type: Array },
      limit: { type: Number },
    };
  }

  // Lit scoped styles
  static get styles() {
    return [super.styles,
    css`
      :host {
        display: block;
        color: var(--ddd-theme-primary);
        background-color: var(--ddd-theme-accent);
        font-family: var(--ddd-font-navigation);
      }
      .wrapper {
        margin: var(--ddd-spacing-2);
        padding: var(--ddd-spacing-4);
      }
      h3 span {
        font-size: var(--github-rpg-contributors-label-font-size, var(--ddd-font-size-s));
      }
    `];
  }
  
  async fetchContributors() {
    const url = `https://api.github.com/repos/${this.organization}/${this.repo}/contributors`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
    
    const data = await response.json();
    this.contributors = data.slice(0, this.limit);
    } catch (error) {
      console.error(`Error fetching contributors: ${error.message}`);
      this.contributors = [];
    }
  }

  updated(changedProperties) {
    if (changedProperties.has("organization") || changedProperties.has("repo")) {
      this.fetchContributors();
    }
  }

  // Lit render the HTML
  render() {
    return html`
<div class="wrapper">
  <h3>${this.title} - ${this.organization}/${this.repo}</h3>
  <ul class ="contributors">
    ${this.contributors.map(contributor => html`
      <li>
        <img src="${contributor.avatar_url}" alt="${contributor.login}" />
        <a href="${contributor.html_url}" target="_blank">${contributor.login}</a>
      </li>
      `)}
  </ul>
  <slot></slot>
</div>`;
  }

  /**
   * haxProperties integration via file reference
   */
  static get haxProperties() {
    return new URL(`./lib/${this.tag}.haxProperties.json`, import.meta.url)
      .href;
  }

}

globalThis.customElements.define(GithubRpgContributors.tag, GithubRpgContributors);