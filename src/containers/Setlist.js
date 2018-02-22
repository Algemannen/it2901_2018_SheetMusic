import React, {Component} from 'react';
import {compose} from 'redux';
import {connect} from 'react-redux';
import {withStyles} from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';

import {
    Button, Card, CardContent, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Menu, MenuItem,
    Snackbar,
    TextField
} from "material-ui";

import {DatePicker} from 'material-ui-pickers';
import AddIcon from 'material-ui-icons/Add';
import MenuIcon from 'material-ui-icons/Menu';

import Selectable from '../components/Selectable'
import firebase from 'firebase';

// Creating Action creators.

export const updateSetListArrangements = (setlistid, arrIds, currLength) => async dispatch => {
    let doc = await firebase.firestore().doc(`setlists/${setlistid}`);

    for(let i = 0; i < arrIds.length; i++){
        await firebase.firestore().collection(`setlists/${setlistid}/arrangements`).add({order: i, ref: firebase.firestore().doc(`arrangements/${arrIds[i]}`)});
    }
}
export const getSetListDetail = setlistID => async dispatch=> {
    let doc = await firebase.firestore().doc(`setlists/${setlistID}`).get();

    let setlist = doc.data();

    let snapshot = await firebase.firestore().collection(`setlists/${setlistID}/arrangements`).get();

    setlist.arrangements = await Promise.all(snapshot.docs.map(async doc => {
        const arrDoc = await doc.data().ref.get();
        return {id: arrDoc.id, position:doc.data().order, ...arrDoc.data()};
    }));

    dispatch({type: 'SETLIST_FETCH_RESPONSE', setlist: setlist});
}


export const getBandDetail = bandId => async dispatch => {
    let doc = await firebase.firestore().doc(`bands/${bandId}`).get();

    let band = doc.data();

    let snapshot = await firebase.firestore().collection(`bands/${bandId}/arrangements`).get();

    band.arrangements = await Promise.all(snapshot.docs.map(async doc => {
        const arrDoc = await doc.data().ref.get();
        return {id: arrDoc.id, ...arrDoc.data()};
    }));

    dispatch({type: 'BAND_FETCH_RESPONSE', band: band})
};


const styles = {
    root: {
    },
    flex: {
        flex: 1
    },

    dialogContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    card: {
        width: 300,
        marginRight: 24,
        marginBottom: 24,
        cursor: 'pointer'
    },
    media: {
        height: 200,
    },
    grid: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: 24
    },
    banner: {
        background: 'url(https://4.bp.blogspot.com/-vq0wrcE-1BI/VvQ3L96sCUI/AAAAAAAAAI4/p2tb_hJnwK42cvImR4zrn_aNly7c5hUuQ/s1600/BandPeople.jpg) center center no-repeat',
        backgroundSize: 'cover',
        height: 144
    },
    selectable: {
        height: 150,
        marginBottom: 20
    },
};

class Setlist extends Component {

    state = {
        anchorEl: null,
        addArrDialogOpen: false,
        addPauseDialogOpen: false,
        arrangements: [],
        addedArrangementsIds:[]
    };

    requestBandDetails(){
        let bandId = this.props.pathname.split('/')[2];
        this.props.dispatch(getBandDetail(bandId));
    }
    
    requestSetListData(){
        let setlistID = this.props.pathname.split('/')[3];
        this.props.dispatch(getSetListDetail(setlistID))
    }

    componentWillMount() {
        this.requestBandDetails();
        this.requestSetListData();
    }
    _onDialogClose(type) {
        this.setState({[`${type}DialogOpen`]: false});
    }
    _onAddButtonClick(e) {
        this.setState({anchorEl: e.currentTarget});
    }

    _onMenuClose() {
        this.setState({anchorEl: null});
    }

    _onMenuClick(type) {
        this.setState({[`${type}DialogOpen`]: true});
        this.setState({anchorEl: null});
    }

    _onSelectableClick(index) {
        let arrangements = [...this.props.band.arrangements];
        arrangements[index].selected = !arrangements[index].selected;
        this.setState({arrangements: arrangements});
    }

    _onDialogSubmit(type){
        switch(type){
            case 'addArr':
                // Look at this glorious piece of code! I am a GOD! (I might have gone slightly mad during the night...)
                let selectedArrangementIDs = this.state.addedArrangementsIds;
                selectedArrangementIDs.push.apply(selectedArrangementIDs,  this.state.arrangements.filter(arr => arr.selected).map((arr) => arr.id));
                let setlistid = this.props.pathname.split('/')[3];
                this.setState({addedArrangementsIds:selectedArrangementIDs, addArrDialogOpen:false});
                this.props.dispatch(updateSetListArrangements(setlistid, selectedArrangementIDs, this.props.setlist.arrangements.length));
                break;
            case 'addPause':
                break;
            case 'download':
                break;
            default:
                break;
        }
    }
    render() {
        const { anchorEl, addArrDialogOpen, addPauseDialogOpen} = this.state;
        const {classes, band={arrangements:[]}, setlist={arrangements:[]}} = this.props;
        return (
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton color="inherit" onClick={() => this._onMenuButtonClick()}>
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="title" color="inherit" className={classes.flex}>
                            {setlist.title}
                        </Typography>
                        <IconButton color="inherit" aria-label="Menu" onClick={e => this._onAddButtonClick(e)}>
                            <AddIcon/>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={() => this._onMenuClose()}
                        >
                            <MenuItem onClick={() => this._onMenuClick('addArr')}>Add Arrangement</MenuItem>
                            <MenuItem onClick={() => this._onMenuClick('addPause')}>Add Pause</MenuItem>
                        </Menu>
                    </Toolbar>
                </AppBar>
                <div>
                    <div>{setlist.arrangements.map((arr, id) => 
                    <div key={id} order={arr.position}>
                        {console.log(arr)}
                        {arr.position}. {arr.title}
                    </div>)}
                    </div>
                </div>
                <Dialog open={addArrDialogOpen} onClose={() => this._onDialogClose('addArr')}>
                    <DialogTitle>Add Arrangment</DialogTitle>
                    <DialogContent>
                        {band.arrangements.map((arr, index) =>
                            <Selectable
                               classes={{root: classes.selectable}}
                               key={index}
                               imageURL={"https://previews.123rf.com/images/scanrail/scanrail1303/scanrail130300051/18765489-musical-concept-background-macro-view-of-white-score-sheet-music-with-notes-with-selective-focus-eff.jpg"}
                               selected={arr.selected}
                               onClick={(i => () => this._onSelectableClick(i))(index)}
                           />)}

                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this._onDialogClose('addArr')}>Cancel</Button>
                        <Button color="primary" onClick={() => this._onDialogSubmit('addArr')} autoFocus>Add</Button>
                    </DialogActions>
                </Dialog>
                <Dialog open={addPauseDialogOpen} onClose={() => this._onDialogClose('addPause')}>
                    <DialogTitle>Add Pause</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Time"
                            margin="normal"
                            onChange={e => this.setState({bandCode: e.target.value})}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button color="primary" onClick={() => this._onDialogClose('addPause')}>Cancel</Button>
                        <Button color="primary" onClick={() => this._onDialogSubmit('addPause')} autoFocus>Add</Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}




export default compose(connect(state => ({
    user: state.default.user,
    band:state.default.band,
    setlist:state.default.setlist,
    pathname: state.router.location.pathname
})), withStyles(styles))(Setlist);

