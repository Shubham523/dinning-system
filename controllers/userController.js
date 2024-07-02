const db = require("../config/database");
const { v4: uuidv4 } = require('uuid');
const crypto = require("crypto");
const jwt = require("jsonwebtoken")

function createHash(plainPassword, salt){
    return crypto.
    createHmac('sha512', salt)
   .update(plainPassword)
   .digest('hex');
}

const registerUser = async( req, res)=>{
    const {email, password, role, username} = req.body;
    console.log("data : ", email, password, role, username);
    try{
        const salt = uuidv4(); 
        const hashedPassword = createHash(password,salt);
        const user = await db.query("select * from users where email = ? or username = ? or password = ?",[email, username, hashedPassword]);
        if(user[0].length > 0){
            return res.status(401).json({
                status : "User already exists with same credentials. Kindly login",
                status_code: 401
            })
        }
         
       

        const response =  await db.query("insert into users (email, password, username, salt, role ) values(?,?,?,?,?)", [email, hashedPassword, username, salt, role]);
        
        return res.status(200).json({
           status: "Account successfully created",
            status_code: 200,
            user_id: response[0].insertId
        })
    }
    catch(error){
        return res.status(500).json({
            success : false,
            message : "error in register api",
            error
        })
    }

}

const loginUser = async(req, res) =>{
    const {username, password} = req.body;
    console.log(" user logimn details", username, password);
    if(!username || !password) {
        return res.status(400).json({
            success : false,
            message : "Please enter all details"
        })
    }
    try{
        
        const user = await db.query(`select * from users where username = ?`,[username]);
        console.log("user first ", user[0][0]);
        if(!user[0][0].user_id){
            return res.status(401).json({
                status: "Incorrect username/password provided. Please retry",
                status_code: 401
            });
        }
        
            const salt = user[0][0].salt; 
           console.log(" salt : ",salt)
            const hashedPassword = createHash(password, salt);
            console.log("hashe : ",hashedPassword);
           
            const result = await db.query(`select * from users where username = ? and password = ?`,[username, hashedPassword]);
            console.log("\n result : ", result[0].length);
            if(!result[0][0].user_id){
                
                return res.status(400).json({
                    success : false,
                    message : "Invalid email or password in ifffff",
                });
            }
            else{
                const id = user[0][0].user_id;
                console.log(" id : ", id, process.env.SECRET)
                const access_token = jwt.sign({username}, process.env.SECRET, {expiresIn : 86400})
                console.log(" token : ", access_token);
                return res.status(200).json({
                    status: "Login successful",
                     status_code: 200,
                    user_id: id,
                    access_token: access_token 
                })
            }
        
        
        
        

    }
    catch(error){
        return res.status(500).json({
            message : "error in login api",
            error : error
        })}
        
    
}

module.exports={registerUser, loginUser}