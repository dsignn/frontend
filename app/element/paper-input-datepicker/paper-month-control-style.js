import {html, PolymerElement} from '@polymer/polymer/polymer-element';

export const PaperMonthControlCustomStyle = html`
<style>
	:host {
		position: relative;
		display: block;
		min-width: 300px;
		max-width: 300px;
		width: 100%;
		height: 100%;
		box-sizing: border-box;
		overflow: visible;
		transform-style:flat;
	}
	
	.week-labels-row { width: 90%; height: 14.28%; display: flex; flex-direction: row; justify-content: center; box-sizing: border-box; margin: 0 5px 0 5%; }
	.week-labels-row { border-bottom: 1px solid #e0e0e0; }
	
	.week-row { width: 90%; height: 14.28%; display: flex; flex-direction: row; justify-content: center; box-sizing: border-box; margin: 0 5% 0 5%; }
	
	.day-label-container { box-sizing: border-box; width: 14.28%; height: 100%; text-align: center; line-height: 45px; font-size: 120%; }
	
	.day-container { box-sizing: border-box; width: 14.28%; height: 100%; text-align: center; line-height: 254%; font-size: 110%;}
	
	.hovered { transition: all .2s ease-in-out; }
	.hovered:hover { width: 100%; height: 90%; box-sizing: border-box; background-color: #56f; color: white; margin-top: 2%; margin-bottom: 2%; line-height: 240%; border-radius: 10%; }
	.day-container.holyday { color: red; font-weight: bold; }
	
	.selected .hovered { width: 100%; height: 90%; box-sizing: border-box; background-color: #56f; color: white; margin-top: 2%; margin-bottom: 2%; line-height: 240%; border-radius: 50%;  }
	.today .hovered { width: 100%; height: 90%; box-sizing: border-box; background-color: #cfdfef; color: black; margin-top: 5%; margin-bottom: 5%; line-height: 254%; border-radius: 50%;  }
	
	.selected.today .hovered { background-color: rgba(85, 102, 255, .5); }

	.out-of-current-month { color: #d0d0d0;	}
	.out-of-current-month.today .hovered { background-color: rgba(207,223,239, .6); }
	.out-of-current-month.holyday { color: lightcoral; }
	.out-of-current-month:hover { color: #d0d0d0; background-color: white; }
	
	[hidden] { display: none; }
</style>`;
