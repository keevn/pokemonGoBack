import React from 'react';
import range from 'lodash.range';

const AbilityList = (props) => {
    const {pokemon} = props;

    const abilities=pokemon.getAvailableSills();

    const handleOnClick = (e, ability) => {

        console.log(ability.skill.id);
        e.preventDefault();
        e.stopPropagation();
    };

    return abilities.length ? <div className='abilityList'>
            {abilities.map((ability) => {
                return (
                    <div className='ability-container' key={ability.skill.id} onClick={(e) => handleOnClick(e, ability)}>
                        <div className="ability-content" >
                            <div className='ability-name'>{ability.skill.name} {ability.skill.id}
                            {ability.skill.damage? <span style={{float: 'right',
                                marginRight: '5px'}}>{ability.skill.damage}{ability.skill.plus? ability.skill.plus.replace('x','×'):''}</span>:null}
                                <div style={{float:'left'}}>
                            {ability.cost.map((cost) => {
                                return range(cost.value).map((i) => {
                                    const name = `energyIcon icon-${cost.cat}`;
                                    return (
                                        <div className={name} style={{
                                            transform: 'scale(0.6)',
                                            margin: '-4px',
                                            float:'right',
                                        }} key={i}/>
                                    );
                                });
                            })} </div>
                            </div>
                            <div className='ability-desc'>{ability.skill.desc}</div>
                        </div>
                    </div>
                    );
            })

            }
            </div>: null;
};

export default AbilityList;