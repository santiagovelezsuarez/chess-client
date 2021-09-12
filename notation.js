const LONG_CASTLE = 2;
const SHORT_CASTLE = 1;
const NO_CASTLE = 0;

const CHECK = 1;
const CHECK_MATE = 2;
const NO_CHECK = 0;

class Converter 
{
    toString(game, piece, position, prevPosition, isCapture, promotedType) 
    {
        /*
         * <P>?<col/row>x?<pos>+?+?
         * 0-0
         * 0-0-0
         * <pos>=<P>
         * <color>x
         */
        let castle = this.isCastle(piece, position, prevPosition);
        let ambiguity = this.getAmbiguity(game, piece, position);
        let isPromotion = this.isPromotion(piece, pos);
        let check = this.getCheck();
        if (castle != NO_CASTLE) 
        {
            return castle == SHORT_CASTLE ? "0-0" : "0-0-0";
        }
        if (isPromotion) 
        {
            return pos + "=" + promotedType;
        }
        let move = "";
        if (piece.type != PAWN) 
        {
            move += piece.type;
        }
        if (ambiguity != null) 
        {
            move += ambiguity;
        }
        if (isCapture) 
        {
            move += "x";
        }
        move += pos;
        if (check != NO_CHECK) 
        {
            move += check == CHECK ? "+" : "++";
        }
        return move;
    }

    /**
     * 
     * @param {Piece} piece 
     * @param {string} position
     * @param {string} prevPosition
     * @return {number} return LONG_CASTLE, SHORT_CASTLE or NO_CASTLE
     */
    isCastle(piece, position, prevPosition) 
    {
        if (piece.type != KING) 
        {
            return NO_CASTLE;
        }
        let xyPrevPosition = pos2Coord(prevPosition);
        let xyNextPosition = pos2Coord(position);
        let dx = xyNextPosition.x - xyPrevPosition.x;
        if (Math.abs(dx) != 2) 
        {
            return NO_CASTLE;
        }
        return dx > 0 ? SHORT_CASTLE : LONG_CASTLE;
    }

    /**
     * 
     * @param {Game} game 
     * @param {Piece} piece 
     * @param {string} position 
     * @return {char} The row number, column letter or null
     */
    getAmbiguity(game, piece, position) 
    {

        //Filter all pieces by color, type, and different than param piece
        let siblings = pieces.filter((s) => {
            if (s.color == piece.color & s != piece & s.type == piece.type) return true;
            else return false
        });
        //If no siblings, exit function
        if (siblings.length == 0) return false;
        else 
        {
            let sibling = undefined;
            let sameX = false;
            let sameY = true;
            let difference = "";
            //Check each sibling
            for (let i = 0; i < siblings.length; i++)
            {
                //Check all siblings
                sibling = siblings[i];
                //Check if any sibling shares row or column
                if (sibling.canMove(position)) 
                {
                    if (!sameX) sameX = sibling.getPosition().charAt(0) == piece.getPosition().charAt(0);
                    if (!sameY) sameY = sibling.getPosition().charAt(1) == piece.getPosition().charAt(1);
                }
            }
            //If piece shares row or column with any available piece, add row or column to difference
            if (sameX) difference += piece.getPosition().charAt(0);
            if (sameY) difference += piece.getPosition().charAt(1);
            //return difference
            if (difference != "") return difference;
            else return false;
        }
    }

    isPromotion(piece, pos)
    {
        /*Verifica que sea peón y dependiendo del color 
         *que haya llegado primera o última fila correspondientemente*/
        if (piece.type != PAWN)
        {
            return false;
        } 
        else if (piece.type == PAWN)
        {
            let color = piece.color;
            let row = parseInt(position.charAt(1));
            return row === (color === WHITE ? 8 : 1);
        }
    }

    /**
     * 
     * @param {Game} game 
     * @param {Piece} piece 
     * @param {string} pos 
     * @return {number} CHECK, CHEK_MATE or NO_CHECK
     */
    getCheck(game, piece, pos) 
    {
        let color = game.turn;
        let kingPos;

        for (let piece in pieces) 
        {
            if (piece.type == KING && piece.color != color)
                kingPos = game.positions[piece.id];
        }

        return game.can_move(piece, kingPos) ? CHECK : NO_CHECK;
    }

    toPieceAndPos(game, move) {
        /*
         * <P>?<col/row>x?<pos>+?+?
         * 0-0
         * 0-0-0
         * <pos>=<P>
         * <color>x
         */
    }

    /**
     * 
     * @param {string} move 
     * @return {{piece: Piece, pos: string}|null}
     */
    parseCastle(game, move) 
    {
        let piece;
        let pos = "";
        if (move === "0-0" || move === "0-0-0")
        {
            move === "0-0-0" ? pos = H : pos = A;
            if (game.turn === WHITE) 
            {
                piece = game.pieces.find(piece => piece.id === D + '1');
                pos += "1";
            }
            else 
            {
                piece = game.pieces.find(piece => piece.id === D + '8');
                pos += "8";
            }
            return ({ "piece": piece, "pos": pos });
        } 
        else 
        {
            return null
        }
    }

    /**
     * 
     * @param {Game} game 
     * @param {string} move 
     * @return {{piece: Piece, pos: string, promotionType: string} | null}
     */
    parsePromotion(game, move) 
    {

    }

    /**
     * 
     * @param {Game} game 
     * @param {string} move 
     * @return {char|null} WHITE, BLACK or null
     */
    parseResign(game, move) 
    {

    }

    /**
     * 
     * @param {Game} game 
     * @param {string} move 
     * @return {{piece: Piece, pos: string}|null}
     */
    parseMove(game, move) 
    {
        //<P>?<col/row>?x?<pos>+?+? 
        const moveRegex = /(?P[RNBKQ]?)([12345678abcdefgh]?x?([abcdefgh][12345678])\+?)/;
        move.match(moveRegex);
    }

}