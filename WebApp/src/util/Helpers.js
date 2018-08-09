import {cardList} from '../mockData/data';
import {Card} from "../component/model/Card";
import {Modal,Select} from "antd";
import Coin from "../component/Coin";
import React from "react";
import random from "lodash.random";
import {getDeckList} from "./APIUtils";
import DeckList from "../component/DeckList";

export function formatDate(dateString) {
    const date = new Date(dateString);

    const monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
    ];

    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return monthNames[monthIndex] + ' ' + year;
}

export function formatDateTime(dateTimeString) {
    const date = new Date(dateTimeString);

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr",
        "May", "Jun", "Jul", "Aug",
        "Sep", "Oct", "Nov", "Dec"
    ];

    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return date.getDate() + ' ' + monthNames[monthIndex] + ' ' + year + ' - ' + date.getHours() + ':' + date.getMinutes();
}


export function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function shuffle(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}

export function isValidatedDeck(cardIds){
    let condition1;
    let condition2;

    let validated= true;
    for (const id of cardIds) {
        const card = Card.getCardInstants(id);
    }


    return validated;
}

export const FlipCoin =(n=1,title,afterFlip)=> {
    let result;
    const moveResult=(value)=>{
        result = value;
    };
    Modal.info({
        title: title,
        content: (
            <Coin afterFlip={moveResult} size={70} times={n}/>
        ),
        onOk: ()=>{
            if (!result) {
                const value = random(0, n);
                result= {head:value,tail:n-value};
            }
            afterFlip(result);
        }
    });
};

export const DeckSelector =(user,onConfirm)=> {
    let result;
    const callback=(value)=>{
        result = [value.player_list,value.AI_list,value.playerShuffle,value.AI_Shuffle];
    };

    Modal.info({
        title: "Select the deck you wanna play:",
        content: (
            <DeckList user={user} onChange={callback}/>
        ),
        width:500,
        onOk: ()=>{onConfirm( result);}
    });

};

