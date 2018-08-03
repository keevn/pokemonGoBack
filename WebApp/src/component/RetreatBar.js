import React from 'react';
import range from 'lodash.range';

const RetreatBar = (props) => {
    const {pokemon,onRetreat} = props;

    const handleOnClick=(e,pokemon)=>{
         e.preventDefault();
         e.stopPropagation();
        onRetreat(pokemon);
    }

    return pokemon.isRetreatable() ? <div className='retreat-bar'>
        <div className="ability-container" onClick={(e) =>handleOnClick(e,pokemon)}>
            <div className="ability-content">Retreat
                {pokemon.retreatCost.map((cost) => {
                    return range(cost.value).map((i) => {
                        const name = `energyIcon icon-${cost.cat}`;
                        return (
                            <div className={name} style={{
                                float: 'right', transform: 'scale(0.6)',
                                margin: '-4px',
                            }} key={i}/>
                        );
                    });
                })}
            </div>
        </div>
    </div> : null;
};

export default RetreatBar;