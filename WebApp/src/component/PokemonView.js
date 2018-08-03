import React from 'react';
import './CardView.css';
import Pokemon from './model/Pokemon';
import CardView from './CardView';
import EnergyBar from './EnergyBar';
import DamageCycle from './DamageCycle';
import AttachedItem from './AttachedItem';
import RetreatBar from './RetreatBar';
import AbilityList from './AbilityList';
import {EFFECT_POSITIVE, EFFECT_NEGITIVE, POKEMON_POISONED} from "./constants";

const PokemonView = ({pokemon, attack,onAttack,onRetreat,retreatalbe=true, ...rest}) =>  {

        return (
            pokemon instanceof Pokemon ?
                    <CardView {...rest} pic_id={pokemon.pic_id} instantKey={pokemon.instantKey} >
                        {pokemon.status}
                        <EnergyBar energies={pokemon.attachedEnergy}/>
                        <DamageCycle damage={pokemon.damage} critical={pokemon.hp - pokemon.damage <= 20}/>
                        <AttachedItem item={pokemon.attachedItem}/>
                        {pokemon.effect === EFFECT_POSITIVE ? <div className='posAffect'/> : null}
                        {pokemon.status === POKEMON_POISONED ? <div className='poisonedAffect'/> : null}
                        {pokemon.effect === EFFECT_NEGITIVE ? <div className='negAffect'/> : null}
                        <div className={pokemon.energyCategory}>
                        {attack ? <AbilityList pokemon={pokemon} onAttack={onAttack}/> : null}
                        {attack&&retreatalbe ? <RetreatBar pokemon={pokemon} onRetreat={onRetreat}/> : null}
                        </div>
                    </CardView>
                :
                <CardView {...rest} card={pokemon} instantKey={pokemon.instantKey}/>

        );
    } ;


export default PokemonView;