import {  RECEIVE_MESSAGE } from "../actions/chatActions/types";
const initialState = {
	messages: []
}
export default function (state = initialState, action) {
	const {type, payload} = action
	switch(type) {
		case RECEIVE_MESSAGE:
			return {
				...state,
				messages: state.messages.concat(payload)
			}
		default:
			return state;
	}

}