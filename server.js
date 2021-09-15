const serverURL = "https://uam.jdcorrea.me/chess/web/game";
class Server
{
    constructor()
    {
        this.key = undefined;
        this.onMove = undefined;
        this.onOpponentResigns = undefined;
    }

    join(username="'-'")
    {
        let joinPromise = new Promise(function(joinOk, joinError)
        {
            let joinReq = new XMLHttpRequest();
            joinReq.open("GET", serverURL+ '/join?name=' + username);
            joinReq.onload = (e) => {
                if(e.currentTarget.status == 200)
                {
                    console.log(e);
                    let response = JSON.parse(joinReq.responseText);
                    console.log("response: ",response);
                    this.key = response["key"];
                    joinOk(response["color"]);
                }
                else
                {
                    joinError("could not connect");
                }
                
            }
            
            joinReq.send();
        });       
        return joinPromise;
    }

    /**
      * Sends the given move to the server
      * @param {string} move 
      * @return {Promise<void>}
      */
    move(move)
    {
        let movePromise = new Promise(function(moveOk, moveError)
        {
            let moveReq = new XMLHttpRequest();
            moveReq.open("POST", serverURL+ '/move');
            moveReq.onload = (e) => {
                if(e.currentTarget.status == 200)
                {
                    console.log(e);
                    let response = JSON.parse(joinReq.responseText);
                    console.log("response: ",response);                    
                    moveOk();
                }
                else
                {
                    moveError("could not move");
                }
                
            }
            
            moveReq.send({key:this.key, move});
        });       
        return movePromise;
    }

    /**
      * Notifies the server that the used wants to resign
      * @returns {Promise<void>} 
      */
     resign() 
     {
        // call serverUrl + '/resign' passing the key by POST
        // server should return code 200 if ok
     }
}