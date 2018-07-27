import React from 'react';

const EnergyBar = (props) => {
    const energies = props.energies;

    return energies.size ? <div className='energyBar'>
        {[...energies.values()].map((v,i) => {
            const name = "energyIcon icon-"+v.category;
            return (
                <div className={name} key={i}/>
            );
        })}
    </div>:null;
};

export default EnergyBar;