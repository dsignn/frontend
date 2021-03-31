import moment from 'moment'

export default class DateUtilities {

	constructor(day, month, year, format = "DD/MM/YYYY") {

		this.format = format;

		this._date = new Date();
		this._date.setFullYear(year);
		this._date.setMonth(month - 1 < 0 ? 0 : month - 1);
		this._date.setDate(day);

		this._isValid = moment.isDate(this._date);

		this._start = moment(this._date).startOf('month');
		this._moment = moment(this._date);
		this._end = moment(this._date).endOf('month');

	}

	get isValid() {
		return this._isValid;
	}

	get date() {
		return this._date;
	}

	format(format = 'DD/MM/YYYY') {
		return this._moment.format(format || this.format);
	}

	get month() {

		let month = [];
		let startOffset = this._start.day() === 0 ? 6 : this._start.day() - 1;
		let start = this._start.subtract(startOffset, 'days');

		const me = this;
		for (let ii = 0; ii < 42; ii++) {
			month.push({
				label: start.format('DD'),
				date: start.format(me.format),
				weekday: start.day() === 0 ? 7 : start.day(),
				currentMonth: start.isSame(this._date, 'month'),
				day: start.format('DD'),
				month: start.format('MM'),
				year: start.format('YYYY'),
				today: start.format('DD/MM/YYYY') === moment(new Date()).format('DD/MM/YYYY')
			});
			start.add(1, 'day');
		}

		let monthByRows = []
		for (let i = 0; i < month.length; i += 7) {
			monthByRows.push(month.slice(i, i + 7));
		}

		return monthByRows;
	}
}