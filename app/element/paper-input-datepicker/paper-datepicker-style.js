import {html, PolymerElement} from '@polymer/polymer/polymer-element';

export const PaperDatepickerCustomStyle = html`
<style>
	:host {
		position: relative;
		display: block;
		overflow: visible;
		transform-style: flat;
	}
	.calendar-container {
		position: absolute;
		box-sizing: border-box;

		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		overflow: hidden;
		
		width: 300px;
		height: 400px;
		
		border: 1px solid #e0e0e0;
		border-bottom: 2px solid #b0b0b0;
		border-radius: 3px;
		box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2);

		background-color: white;
		z-index: 10000;
		
	}
	
	.underlay {
		background-color: rgba(0,0,0,0);
		position: fixed;
		top: 0;
		left: 0;
		width: 8000px;
		height: 8000px;
		z-index: 9999;
	}
	
	[hidden] { display: none; }
</style>`;
