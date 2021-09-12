/* constants for the rows */
const A = 'a';
const B = 'b';
const C = 'c';
const D = 'd';
const E = 'e';
const F = 'f';
const G = 'g';
const H = 'h';

function pos2Coord(pos) {
    return {
        x: pos.charCodeAt(0) - 'a'.charCodeAt(0),
        y: pos.charCodeAt(1) - '1'.charCodeAt(0)
    }
}

function coord2Pos(coord) {
    return String.fromCharCode('a'.charCodeAt(0) + coord.x) + 
        String.fromCharCode('1'.charCodeAt(0) + coord.y);
}

/* piece types */
const PAWN = '';
const BISHOP = 'B';
const KNIGHT = 'N';
const ROOK = 'R';
const QUEEN = 'Q';
const KING = 'K';

/* colors for the pieces */
const BLACK = 'B';
const WHITE = 'W';

/* order for the pieces in the first and eight row */
const pieceOrder = [ROOK, KNIGHT, BISHOP, QUEEN, KING, BISHOP, KNIGHT, ROOK];
/* constant array to store the 16 pieces */
const pieces = {};
const defaultPositions = {};

/**
 * Represents a piece of the chess game
 */
class Piece 
{
    constructor(id, type, color) 
    {
        this.id = id;
        this.type = type;
        this.color = color;
    }
    label()
    {
        return type + this.getPositionName();
    }
    getPositionName() 
    {
        return this.position.col + this.position.row;
    }   
}

/**
 * Represents a move in the chess game
 */
class Move 
{
    constructor(piece, position) 
    {
        this.piece = piece;
        this.position = position;
    }
}

/**
 * Represents the logic of a game of chess
 */
class Game 
{
    constructor() 
    {
        this.positions = [];
        this.turn = WHITE;
        this.moves = [];
        this.onMove = undefined;
        this.onCapture = undefined;
        this.reset();
    }
    reset() 
    {
        for (pId in pieces)   
        {
            //console.log(pId);
            this.positions[pId] = pId;
        }        
                          
        
    }

    movePiece(piece, pos)
    {
        //piece = this.positions
        console.log("game.movePiece(",piece,pos,")");
        let cm = this.can_move(piece, pos);
        console.log("cm: ",cm);
        if(cm)
        {
            this.positions[pos] = piece.id;
            this.positions[piece.position] = undefined;    
            piece.position =  pos;       
            game.onMove(piece, pos);
        }        
        return cm;
    }    

    can_move(piece,posf)
    {
        //console.log("can_move: ",piece,posf);
        switch (piece.type)
        {
            case PAWN:
                return this.can_move_pawn(piece,posf);
            case ROOK:
                return this.can_move_rook(piece,posf);
            case KNIGHT:
                return this.can_move_knight(piece,posf);
            case BISHOP:
                return this.can_move_bishop(piece,posf);
            case QUEEN:
                return this.can_move_queen(piece,posf);
            case KING:
                return this.can_move_king(piece,posf);
        }
    }

    can_move_king(piece,posf)
    {
        let pos = pos2Coord(piece.id);
        let posfc = pos2Coord(posf);

        let move = {x:0,y:0};

        if(posfc.x > pos.x)
            move.x = 1;
        if(posfc.x < pos.x)            
            move.x = -1;
        if(posfc.y > pos.y)
            move.y = 1;
        if(posfc.y < pos.y)
            move.y = -1;
                      
        let lng = Math.abs((posfc.y - pos.y))>Math.abs((posfc.x - pos.x))?Math.abs((posfc.y - pos.y)):Math.abs((posfc.x - pos.x));   
        console.log("lng: ",lng);     
        let m = this.validDirection(pos, posfc, move) && lng == 1 && this.inBoard(posfc) && !this.isOccpByColor(posf, piece.color);         
         
        
        return m;
    }

    can_move_queen(piece,posf)
    {
        let m = this.can_move_bishop(piece,posf) || this.can_move_rook(piece,posf);
        return m;
    }

    can_move_bishop(piece,pos)
    {
        let posi = pos2Coord(piece.position);
        let posfc = pos2Coord(pos);
        //console.log("posi.y: ",posi.y," posf.y: ",posfc.y);
        let f = Math.abs(posfc.x - posi.x);        
        let c = Math.abs(posfc.y - posi.y);
        let move = {x:0,y:0}
        if(posfc.x > posi.x)
            move.x = 1;
        else
            move.x = -1;
        if(posfc.y > posi.y)
            move.y = 1;
        else
            move.y = -1;     
        //console.log("Void Path: ",this.voidPath(posi, posfc,move));
        let m = f == c && this.voidPath(posi, posfc,move) && this.inBoard(posfc) && !this.isOccpByColor(pos, piece.color);
       
        return m;
    }

    can_move_knight(piece,pos)
    {  
        let posi = pos2Coord(piece.position);                    
        let posfc = pos2Coord(pos);
        console.log("posI: ",posi);
        console.log("posF: ",posfc);
        let h = Math.abs(posfc.x - posi.x);
        let v = Math.abs(posfc.y - posi.y);
        console.log("isOccpByColor(",posfc,",",piece.color,"): ",this.isOccpByColor(posfc, piece.color))
        let occ = this.isOccpByColor(posfc, piece.color);
        console.log("occ: ",occ);
        if(h*v == 2 && !this.isOccpByColor(posfc, piece.color))                    
            return true;    
        return false;        
    }
    
    can_move_rook(piece,posf)
    {
        let pos = pos2Coord(piece.id);
        let posfc = pos2Coord(posf);
        let m1 = this.validDirection(pos, posfc, {x:0,y:1}) && this.inBoard(posfc) && this.voidPath(pos,posfc,{x:0,y:1}) && !this.isOccpByColor(posf, piece.color);
        let m2 = this.validDirection(pos, posfc, {x:1,y:0}) && this.inBoard(posfc) && this.voidPath(pos,posfc,{x:1,y:0}) && !this.isOccpByColor(posf, piece.color);  
        // console.log("m1");
        // console.log(m1);
        // console.log("m2");
        // console.log(m2);    
        return m1 || m2;
    }

    inBoard(pos)
    {
        return pos.x>=0 && pos.x<=7 && pos.y >=0 && pos.y<=7;
    }

    can_move_pawn(piece,posf)
    {   
        let move = piece.color==WHITE?{x:0,y:1}:{x:0,y:-1};
        let pos = pos2Coord(piece.position);
        let posfc = pos2Coord(posf);              
        let lng = Math.abs(posfc.y - pos.y);
        let m1 = this.validDirection(pos, posfc, move) && lng <= this.getMaxLpawn(piece) && !this.isOccp(posf) && this.voidPath(pos,posfc,move) && this.inBoard(posfc);             
        //captura
        move.x = 1;
        let m2 = this.validDirection(pos, posfc, move) && this.isOccpByColor(posf, piece.color==WHITE?BLACK:WHITE) && this.inBoard(posfc);   
        // console.log("m1");
        // console.log(m1);
        // console.log("m2");
        // console.log(m2);
        return m1 || m2;
               
    }    

    validDirection(posi, posfc, move)
    {
        let mv = { x:(posfc.x - posi.x), y:(posfc.y - posi.y)};
        let h = mv.x==0?0:(mv.x / Math.abs(mv.x));
        let v = mv.y==0?0:(mv.y / Math.abs(mv.y));
        if(move.x == h && move.y == v)
            return true;
        return false;
    }

    getMaxLpawn(pawn)
    {
        return defaultPositions[pawn.id]?2:1;
    }

    isOccp(pos)
    {
        console.log("isOcc(248): ",this.positions[pos], "pos: ",pos)
        if(this.positions[pos])
            return true;
        return false;
    }

    isOccpByColor(pos, color)
    {  
        console.log("isOccByColor: ",this.positions[coord2Pos(pos)], "color: ",color)   
        console.log("positions(d2): ",this.positions[coord2Pos(pos)]);
        if(this.isOccp(coord2Pos(pos)))
        {
            //console.log("isOcc: T");
            //console.log("piece: ",pieces[this.positions[coord2Pos(pos)]]);
            return pieces[this.positions[coord2Pos(pos)]]?.color==color?true:false;
        }
        return false;  
        //return this.positions[coord2Pos(pos)]?.color==color?true:false;           
    }

    voidPath(posi, posfc, dir)
    {
        let xn = Math.abs(posfc.x - posi.x);
        let yn = Math.abs(posfc.y - posi.y);
        let n = xn>yn?xn:yn;
        n-=1;
        //console.log("n = ",n);  
        let xi=posi.x;
        let yi=posi.y;   
        console.log("dir x:",dir.x," dir y:",dir.y)   
        for(let i=0; i<n; i++)
        {
            xi+=dir.x;
            yi+=dir.y;
            let pos = coord2Pos({x:xi,y:yi});
            //console.log("pos",pos);
            //console.log(pieces[pos]);
            if(this.isOccp(pos))
                return false;
        }
        return true;
    }    

}

let c = 'a';
for (pType of pieceOrder) {
    
    pieces[c + 1] = new Piece(c + 1, pType, WHITE);
    pieces[c + 8] = new Piece(c + 8, pType, BLACK);
    pieces[c + 2] = new Piece(c + 2, PAWN, WHITE);
    pieces[c + 7] = new Piece(c + 7, PAWN, BLACK);    
    c = String.fromCharCode(c.charCodeAt(0) + 1);    
}
for (pId in pieces) {    
    defaultPositions[pId] = pId;  
    pieces[pId].position = pId;    
}

