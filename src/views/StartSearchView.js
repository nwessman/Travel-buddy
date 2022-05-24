import { DateRangePickerComponent } from '@syncfusion/ej2-react-calendars';
import React from "react";
import { IoIosSearch } from "react-icons/io";
import "../App.css";
import { Autocomplete, TextField } from "@mui/material"
import citiesList from "../cityInfoDB.js"
import * as FaIcons from "react-icons/fa";

function StartSearchView(props){
            
    function onSearchClick(){
        props.onSearchClick();
    }

    function onFromChange(evt, val){
        props.setCurrentLocation(val);
    }

    function onToChange(evt, val){
        props.setSearchDestination(val);
    }

    function onCalenderChange(evt) {
        try{
            props.setStartDate(evt.value[0]);
            props.setEndDate(evt.value[1]);
        }
        catch(error){
        }
    }

    function navigateStartSearchACB() {
        window.location.hash = "startsearch";
    }

    let options =[...new Set(citiesList.map(x => x.city + ", " + x.country))] 

    const userName = [{
            title: props.user,
            hash
            icon:<FaIcons.FaUser></FaIcons.FaUser>,
    
            
        }];

    return (
            <div className="background_image">

                <div className='navigationbar'>
                    <h1 className='name_logo' onClick={navigateStartSearchACB}> TravelBuddy</h1>
                        <a className='loginNav'>
                        {userName[0].icon}  
                        <span>{userName[0].title}</span>
                        </a>
                </div>

            
                <div className='searchWrapper'>
                <div className='box3'>
                    <h2 className='flightHeader'> Explore a new destination!</h2>
                    <div className ="search">
                        <Autocomplete
                                onChange={onFromChange}
                                style={{ color: "white" }}
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                sx={{ input: { color: "black" }, width: 300, m: 2, backgroundColor: "white"}}
                                inputlabelprops={{style: {color: "white",}}}
                                renderInput={(params) => (<TextField {...params} label="From" />)}
                            />
                            <Autocomplete
                                onChange={onToChange}
                                style={{ color: "white" }}
                                disablePortal
                                id="combo-box-demo"
                                options={options}
                                sx={{ input: { color: "black" }, width: 300, m: 2, backgroundColor: "white"}}
                                inputlabelprops={{style: {color: "white",}}}
                                renderInput={(params) => (<TextField {...params} label="To" />)}
                            />
                    </div>
                    <div className="search">
                        <DateRangePickerComponent delayUpdate={true} placeholder="Choose Date Range" change = {onCalenderChange}/>
                    </div>
                    <div className="search">
                        <button onClick = {onSearchClick} style = {{opacity: .8}}><IoIosSearch size="50px"/></button>
                    </div>
                        
                </div>

                </div>
                <button className='checkPreviousSearchButton' onClick={props.checkPreviousSearch}> Check previous search </button>
            </div>
        );
}
export default StartSearchView;
