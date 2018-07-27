import React from 'react';
import './CardView.css';
import Pokemon from './model/Pokemon';
import CardView from './CardView';
import EnergyBar from './EnergyBar';
import DamageCycle from './DamageCycle';
import AttachedItem from './AttachedItem';
import RetreatBar from './RetreatBar';
import AbilityList from './AbilityList';
import {EFFECT_POSITIVE, EFFECT_NEGITIVE} from "./constants";

const PokemonView = (props) =>  {
        const {pokemon, attack , ...rest} = props;

        return (
            pokemon instanceof Pokemon ?
                <div className={pokemon.energyCategory}>
                    <CardView {...rest} pic_id={pokemon.pic_id}>
                        {pokemon.status}
                        <EnergyBar energies={pokemon.attachedEnergy}/>
                        <DamageCycle damage={pokemon.damage} critical={pokemon.hp - pokemon.damage <= 20}/>
                        <AttachedItem item={pokemon.attachedItem}/>
                        {pokemon.effect === EFFECT_POSITIVE ? <div className='posAffect'/> : null}
                        {pokemon.effect === EFFECT_NEGITIVE ? <div className='negAffect'/> : null}

                        {attack ? <AbilityList pokemon={pokemon}/> : null}
                        {attack ? <RetreatBar pokemon={pokemon}/> : null}

                    </CardView>
                </div>
                :
                <CardView {...rest} card={pokemon}/>

        );
    } ;


export default PokemonView;