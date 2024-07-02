const verifyToken = (req, res, next)=> {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status("403").json({
            message : "Fordbidden"
        });
    }
}

const checkRole = (req, res, next)=>{
    const {role} = req.body;

    console.log("role : ",role);
    if(req.body.role ==="user"){
        res.status("403").json({
            message : "Fordbidden"
        });
    }
    else next();
}

module.exports = {verifyToken, checkRole};