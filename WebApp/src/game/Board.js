import React from 'react';
import './Welcome.css';
import Bench from './containers/Bench';

const Board = ()=> (
    <div className="welcome-content">
        
        <div >
            <Bench BenchSize='5' itemSize='3'/>
            <p/>

            
        </div>

    </div>
);


export default Board ;