import {html, PolymerElement} from '@polymer/polymer/polymer-element';
import {mixinBehaviors} from '@polymer/polymer/lib/legacy/class';

import {PaperCalendarDefaultLocale} from './paper-calendar-default-locale.js';
import {PaperCalendarCustomStyle} from './paper-calendar-style.js';

import '@polymer/iron-icon/iron-icon';
import './paper-month-control.js';

class PaperCalendar extends mixinBehaviors([], PolymerElement) {

	static get template() {
		return html`
			${PaperCalendarCustomStyle}
			<div class="toolbar">
				<div class="row">
					<div class="date">[[year]]</div>
				</div>
				<div class="row">
					<div class="month-selector" on-click="_previousMonth">
						<iron-icon icon="paper-input-datepicker:keyboard-arrow-left">
					</div>
					<div class="date">[[monthLabel]]</div>
					<div class="month-selector" on-click="_nextMonth">
						<iron-icon icon="paper-input-datepicker:keyboard-arrow-right">
					</div>
				</div>
				<div class="row">[[value]]</div>
			</div>
			<div class="calendars" id="holder">
				<paper-month-control id="current" class="on-screen" month="[[month]]" year="[[year]]" value="{{value}}"></paper-month-control>
			</div>
		`;
	}

	constructor() {
		super();
		this._locale = PaperCalendarDefaultLocale;
	}

	ready() {
		super.ready();
		this.enabled = true;
		this.monthShown = this.month;
		this.monthLabels = this._locale.labels.months;
		this.monthLabel = this.monthLabels[this.month - 1];
		this.year = (new Date()).getFullYear();

		this.$.current.addEventListener('value-changed', e => {
			this.value = e.detail.value;
		});
	}

	static get properties() {
		return {
			month: {
				type: Number,
				value: (new Date()).getMonth() + 1
			},
			value: {
				type: String,
				notify: true,
				reflectToAttribute: true
			}
		};
	}

	_previousMonth() {
		if (!this.enabled) {
			return;
		}
		this.enabled = false;
		this.monthShown--;
		if (this.monthShown < 1) {
			this.monthShown = 12;
			this.year--;
		}
		this.monthLabel = this.monthLabels[this.monthShown - 1];

		let previous = document.createElement('paper-month-control');
		previous.month = this.monthShown;
		previous.classList.add('move-left');
		previous.addEventListener('value-changed', e => {
			let eventDate = e.detail.value.split('/');
			eventDate[2] = this.year;
			this.value = eventDate.join('/');
		});

		this.$.holder.appendChild(previous);

		let current = this.$.holder.querySelector('paper-month-control#current');
		current.classList.remove('on-screen');
		current.classList.add('move-right');

		requestAnimationFrame(() => {
			previous.classList.remove('move-left');
			previous.classList.add('on-screen');
		});

		setTimeout(() => {
			current.remove();
			previous.id = 'current';
			this.enabled = true;
			// this.$.current.addEventListener('value-changed', e => {
			// 	let eventDate = e.detail.value.split('/');
			// 	eventDate[2] = this.year;
			// 	this.value = eventDate.join('/');
			// });
		}, 500);
	}

	_nextMonth() {
		if (!this.enabled) {
			return;
		}
		this.enabled = false;
		this.monthShown++;
		if (this.monthShown > 12) {
			this.monthShown = 1;
			this.year++;
		}
		this.monthLabel = this.monthLabels[this.monthShown - 1];

		let next = document.createElement('paper-month-control');
		next.month = this.monthShown;
		next.classList.add('move-right');
		next.addEventListener('value-changed', e => {
			let eventDate = e.detail.value.split('/');
			eventDate[2] = this.year;
			this.value = eventDate.join('/');
		});

		this.$.holder.appendChild(next);

		let current = this.$.holder.querySelector('paper-month-control#current')
		current.classList.remove('on-screen');
		current.classList.add('move-left');

		// setTimeout(() => {
		// 	next.classList.remove('move-right');
		// 	next.classList.add('on-screen');
		// });
		requestAnimationFrame(() => {
			next.classList.remove('move-right');
			next.classList.add('on-screen');
		});

		setTimeout(() => {
			current.remove();
			next.id = 'current';
			this.enabled = true;
		}, 500);
	}
}

window.customElements.define('paper-calendar', PaperCalendar);