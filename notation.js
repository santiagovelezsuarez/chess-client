const LONG_CASTLE = 2;
const SHORT_CASTLE = 1;
const NO_CASTLE = 0;

const CHECK = 1;
const CHECK_MATE = 2;
const NO_CHECK = 0;

class Converter {
    /**
     * 
     * @param {Game} game 
     * @param {Move} move 
     * @returns {string} the move in standard chess notation
     */
    toString(game, move) {
        /*
         * <P>?<col/row>x?<pos>+?+?
         * 0-0
         * 0-0-0
         * <pos>=<P>
         * <color>x
         */
        let piece = move.piece;
        let position = move.position;
        let prevPosition = move.prevPosition;

        let castle = this.isCastle(piece, position, prevPosition);
        let ambiguity = this.getAmbiguity(game, piece, position, prevPosition);
        let isPromotion = this.isPromotion(piece, position);
        let check = this.getCheck(game, piece, position);
        if (castle != NO_CASTLE) {
            return castle == SHORT_CASTLE ? "0-0" : "0-0-0";
        }
        let moveStr = "";
        if (piece.type != PAWN) {
            moveStr += piece.type;
        }
        if (ambiguity != null) {
            moveStr += ambiguity;
        }
        if (move.isCapture) {
            if (piece.type == PAWN) // if a pawn is capturing, use the column
                moveStr += move.prevPosition.charAt(0);
            moveStr += "x";
        }
        moveStr += position;
        if (isPromotion) {
            return moveStr + "=" + promotedType;
        }
        if (check != NO_CHECK) {
            moveStr += check == CHECK ? "+" : "++";
        }
        return moveStr;
    }

    /**
     * 
     * @param {Piece} piece 
     * @param {string} position
     * @param {string} prevPosition
     * @return {number} return LONG_CASTLE, SHORT_CASTLE or NO_CASTLE
     */
    isCastle(piece, position, prevPosition) {
        if (piece.type != KING) {
            return NO_CASTLE;
        }
        let xyPrevPosition = pos2Coord(prevPosition);
        let xyNextPosition = pos2Coord(position);
        let dx = xyNextPosition.x - xyPrevPosition.x;
        if (Math.abs(dx) != 2) {
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
    getAmbiguity(game, piece, position, prevPosition) {

        //Filter all pieces by color, type, and different than param piece
        let siblings = Object.values(pieces).filter((s) => {
            return s.color == piece.color 
                && s != piece 
                && s.type == piece.type
                && game.getPiecePosition(s) != null;
        });
        //If no siblings, exit function
        if (siblings.length == 0) 
            return null;
        else {
            let sibling = undefined;
            let sameX = false;
            let sameY = false;
            let difference = "";
            //Check each sibling
            for (let i = 0; i < siblings.length; i++) {
                //Check all siblings
                sibling = siblings[i];
                //Check if any sibling shares row or column
                if (game.canMove(sibling, position)) {
                    if (!sameX) sameX = game.getPiecePosition(sibling).charAt(0) == prevPosition.charAt(0);
                    if (!sameY) sameY = game.getPiecePosition(sibling).charAt(1) == prevPosition.charAt(1);
                }
            }
            //If piece shares row or column with any available piece, add row or column to difference
            if (sameY) difference += prevPosition.charAt(0);
            if (sameX) difference += prevPosition.charAt(1);
            //return difference
            if (difference != "") return difference;
            else return null;
        }
    }

    isPromotion(piece, position) {
        /* Verifica que sea peón y dependiendo del color 
         * que haya llegado primera o última fila, respectivamente */
        if (piece.type != PAWN) {
            return false;
        } else if (piece.type == PAWN) {
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
    getCheck(game, piece, pos) {
        let color = game.getTurn();
        let kingPos;

        for (let pId in pieces) {
            let piece = pieces[pId];
            if (piece.type == KING && piece.color == color)
                kingPos = game.getPiecePosition(piece);
        }

        return game.canMove(piece, kingPos) ? CHECK : NO_CHECK;
    }

    toPieceAndPos(game, move) {
        /*
         * <P>?<col/row>x?<pos>=<type>+?+?
         * 0-0
         * 0-0-0
         * <color>x
         */
        let asCastle = this.parseCastle();
        if (asCastle != null) return asCastle;

        return this.parseMove(game, move);
    }

    /**
     * 
     * @param {string} move 
     * @return {{piece: Piece, pos: string}|null}
     */
    parseCastle(game, move) {
        let piece;
        let pos = "";
        if (move === "0-0" || move === "0-0-0") {
            move === "0-0-0" ? pos = H : pos = A;
            if (game.getTurn() === WHITE) {
                piece = game.pieces.find(piece => piece.id === D + '1');
                pos += "1";
            } else {
                piece = game.pieces.find(piece => piece.id === D + '8');
                pos += "8";
            }
            return ({ "piece": piece, "pos": pos });
        } else {
            return null
        }
    }

    /**
     * 
     * @param {Game} game 
     * @param {string} move 
     * @return {char|null} WHITE, BLACK or null
     */
    parseResign(game, move) {
        const moveRegex = /([rw])x/;
        let match = move.match(moveRegex);
        if (match == null) return null;
        return match[1] == 'b' ? BLACK : WHITE;
    }

    /**
     * 
     * @param {Game} game 
     * @param {string} move 
     * @return {{piece: Piece, pos: string, promotionType: char}|null}
     */
    parseMove(game, move) {
        //<P>?<col/row>?x?<pos>+?+? 
        const moveRegex = /([RNBKQ])?([12345678abcdefgh])?x?([abcdefgh][12345678])(?:=([RNBQ]))?(\+?\+?)?/;
        let match = move.match(moveRegex);
        if (match == null) return null;
        let pType = match[1] === undefined ? PAWN : match[1].charAt(0);
        let disamb = match[2];
        let pos = match[3];
        let promotionType = match[4];
        let color = game.getTurn();
        let possiblePieces = Object.values(pieces).filter((p) => {
            return p.type == pType 
                && p.color == color 
                && game.canMove(p, pos)
                && (!disamb || game.getPiecePosition(p).indexOf(disamb) != -1);
        });
        if (possiblePieces.length == 0)
            throw new Error("Move is invalid");
        if (possiblePieces.length > 1)
            throw new Error("Ambiguous move");
        return {piece: possiblePieces[0], pos: pos, promotionType: promotionType};
    }

}