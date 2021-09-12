/**
 * Class managing the UI for the chess board
 */

 class Board 
 {
    constructor(container, piecesDef) 
    {
        //console.log("PiecesDef:");
        //console.log(piecesDef);
        this.onPieceDragged = undefined;
        var table = document.createElement("table");
        table.className = "chess";        
        for(let i=0; i<8; i++)
        {
            var tr = document.createElement("tr");
            table.appendChild(tr);
            for(let j=0; j<8; j++)
            {
                var td = document.createElement("td");      
                td.id = coord2Pos({x:j, y:Math.abs(i-7)});
                td.ondrop = this.dropFn;  
                td.ondragover = this.dragOverfn;              
                tr.appendChild(td);
            }
        }
        container.appendChild(table);
        this.createPieces(piecesDef);
        
         
        //console.log(piecesDef);
    }

    createPieces(pieces)
    {        
        /*console.log(pieces);
        console.log(pieces["a1"]);*/

        /*console.log(pos2Coord("c5"));
        console.log(coord2Pos({x:2, y:4}));*/

        const FA = "fas fa-chess-";
        const SIZE = "fa-3x";
        const I = {
            'R' : FA+"rook "+SIZE,
            'N' : FA+"knight "+SIZE,
            'B' : FA+"bishop "+SIZE,
            'Q' : FA+"queen "+SIZE,
            'K' : FA+"king "+SIZE,
            '' : FA+"pawn "+SIZE,
        };                    
        for(let piece in pieces)
        {
            //console.log(pieces[piece]);
            //console.log(pieces[piece].type);
            let i = document.createElement("i");
            i.id = pieces[piece].type+"-"+pieces[piece].id;
            i.className = I[pieces[piece].type];
            i.style = pieces[piece].color==WHITE?"color: white":"color: black";
            i.draggable = "true";
            i.ondragstart = this.dragFn;
            //i.setAttribute('ondrop', 'dropFn(event)');
            //i.setAttribute('ondragstart', 'dragFn(event)');
            document.getElementById(piece).appendChild(i);            
        }

    }
    
    setPiecePosition(piece,pos) 
    {
        //console.log("setPiecePosition");
        //console.log(piece,pos);
        let idp = piece.type+"-"+piece.id;
        //console.log(idp);
        let i=document.getElementById(idp);        
        //console.log(i);
        document.getElementById(pos).appendChild(i);
    }

    setPosition(piece, pos) 
    {
    
    }

    removePiece(piece) 
    {
    
    }    

    dropFn(ev)
    {
        ev.preventDefault();      
        var data = ev.dataTransfer.getData("text");
        //console.log("data: "+data);        
        //let piece = pieces[data.substr(data.indexOf('-')+1)];
        let id = data.substr(data.indexOf('-')+1);
        console.log(data.substr(data.indexOf('-')+1));
        let pos = ev.target.id;
        //console.log("(piece,pos) : ("+piece,pos+")");
        //console.log("To: "+ev.target.id);
        //console.log(this.onPieceDragged);
        if(board.onPieceDragged)
            board.onPieceDragged(pieces[id], pos);  
    }

    dragOverfn(ev)
    {
        ev.preventDefault();    
    }

    dragFn(ev)
    {
        ev.dataTransfer.setData("text", ev.target.id);    
        //console.log("From: "+ev.target.id);
    }


}



