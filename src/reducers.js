export default (state = {}, action) => {
    switch (action.type) {
        case 'AUTH_STATE_LOAD_SUCCESS':
            return {...state, user: action.user, authStateLoaded: true};
        case 'SIGN_IN_SUCCESS':
            return {...state, user: action.user};
        case 'SIGN_IN_FAILURE':
            return {...state};
        case 'USER_CREATE_SUCCESS':
            return {...state};
        case 'BANDS_FETCH_RESPONSE':
            return {...state, bands: action.bands};
        case 'BAND_FETCH_RESPONSE':
            return {...state, band: action.band};
        case 'BAND_ADD_SUCCESS':
            return {...state, bands: [...state.bands, action.band]};
        case 'BAND_JOIN_SUCCESS':
            return {...state, bands: [...state.bands, action.band]};
        case 'ARRANGEMENT_DETAIL_FETCH_RESPONSE':
            return {...state, arrangement: {...action.arrangement, instruments: []}};
        case 'ARRANGEMENT_INSTRUMENTS_FETCH_RESPONSE':
            return {...state, arrangement: {...state.arrangement, instruments: action.instruments}};
        case 'ARRANGEMENT_ADD_SUCCESS':
            return {...state, band: {...state.band, arrangements: [...state.band.arrangements, action.arrangement]}};
        case 'SETLIST_ADD_SUCCESS':
            return {...state, band: {...state.band, setlists: [...state.band.setlists, action.setlist]}};
        case 'SETLIST_ADD_ARRANGEMENT_SUCCSESSFUL':
            break;
        case 'SETLIST_FETCH_RESPONSE':
            return {...state, setlist: action.setlist}
        case 'MESSAGE_SHOW':
            return {...state, message: action.message};
        case 'MESSAGE_HIDE':
            return {...state, message: undefined};
        case 'INSTRUMENTS_ADD_SUCCESS':
            return state;
        default:
            return state;
    }
};