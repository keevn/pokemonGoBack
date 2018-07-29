


export  function desktest(x,width, margin,data) {

        var card = new Array(x);
        var position = [];
        for(var j = 0; j < card.length; j++){

            var deck_width = (width + margin) * card.length;
            var card_height = width * 4 / 3 + margin * 2;

            x = (100 - width) / (card.length - 1)
            var coord = x * j;
            position[j] = coord;
        }
        console.log(position);
        for(var i = 0; i < position.length;i++){
            if((data == position[i])|| (data > position[i] && data < position[i+1])){
                console.log(i)
            }
        }
    }
    desktest(4,50,5,50);






