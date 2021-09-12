const serverURL = "https://uam.jdcorrea.me/chess/web/game";
class Server
{
    constructor()
    {
        this.key = undefined;
        this.onMove = undefined;
    }

    join(username)
    {
        let joinPromise = new Promise(function(joinOk, joinError)
        {
            let joinReq = new XMLHttpRequest();

            joinReq.onload = (e) => {
                if(e.currentTarget.status == 200)
                {
                    let response = JSON.parse(this.responseText);
                    joinOk(response["color"]);
                }
                else
                {
                    joinError("could not connect");
                }
                
            }
            joinReq.open("GET", serverURL+ '/join?username=' + username);
            joinReq.send();
        });       
        return joinPromise;
    }

    move(piece, pos)
    {

    }
}